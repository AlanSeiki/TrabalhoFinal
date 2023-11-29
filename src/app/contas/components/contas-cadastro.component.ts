import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ContasInterface } from '../tipos/contas-interface';
import { ContasService } from '../service/contas.service';
import { LucroDespesaInterface } from '../../movimentacao/tipos/lucro_despesa.interface';
import { LucroDespesaService } from 'src/app/movimentacao/services/lucro-despesa.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-contas-cadastro',
  templateUrl: './contas-cadastro.component.html',
  styleUrls: ['./contas-cadastro.component.scss'],
})


export class ContasCadastroComponent implements OnInit {
  dadoId: number | null;
  dadoForm: FormGroup;
  tipo: string;
  icone:string = 'home';
  movimentacao: LucroDespesaInterface;


  iconRows = [
    ['home', 'game-controller-outline', 'airplane-outline'],
    ['pizza-outline', 'people-circle-outline', 'car-sport-outline'],
    ['wallet-outline', 'logo-apple', 'desktop-outline']
  ];

  constructor(
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private contasService: ContasService,
    private lucroDespesaService: LucroDespesaService,
    private router: Router,
    private loadingController: LoadingController
  ) {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') || 'Valor Padrão';
    this.dadoId = null;
    this.dadoForm = this.initForm();
    this.movimentacao = {
      id: null,
      descricao:"",
      data:new Date,
      conta:null,
      valor:0,
      icone:"",
      meta:null,
      tipo:"D"
    }
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    
    if (id) {
        this.dadoId = parseInt(id);
        this.contasService.getDado(this.dadoId).subscribe((dado) => {
        this.dadoForm = this.initForm(dado);
        this.icone = dado.icone;
      });
    }
  }

  setSelectedIcon(iconName: string): void {
      this.icone = iconName;
  }
  

  initForm(dado?: ContasInterface): FormGroup {
    return new FormGroup({
      id: new FormControl(dado?.id || null),
      descricao: new FormControl(dado?.descricao || '', Validators.required),
      valor: new FormControl(dado?.valor, [Validators.required, Validators.min(0)]),
      parcelas: new FormControl(dado?.parcelas, [Validators.required, Validators.min(0)]),
      data: new FormControl(dado?.data || new Date().toISOString(), [Validators.required, Validators.min(0)]),
      icone: new FormControl(dado?.icone || this.icone),
    });
  }

 
//Basicamente eu faço ele aguardar o processo de deleção um a um para não dar erro no json server promise espera o retorno e timeout 
//grante que cada um rode no seu tempo promisse.all verifica se foram todas deletas e retorna para função submit
  excluirGeral(dado: ContasInterface) {
    return new Promise((resolve, reject) => {
      this.lucroDespesaService.getDados('','','D',dado.id,null).subscribe(
        (dados) => {
          const excluirPromises = dados.map((item, index) => {
            return new Promise<void>((resolveInner) => {
              setTimeout(() => {
              this.lucroDespesaService.excluir(item.id == null ? 0 : item.id).subscribe(
                () => {
                    resolveInner();
                },
                (erroExclusao) => reject(erroExclusao)
              );
            }, index * 1000); 
            });
          });
          Promise.all(excluirPromises)
            .then(() => {
              console.log("Todas as exclusões concluídas");
              resolve(true);
            })
            .catch((erro) => {
              console.error(erro);
              reject(erro);
            });
        },
        (erro) => {
          console.error(erro);
          reject(erro);
        }
      );
    });
  }
  

  async adicionaListaGeral(dado: ContasInterface) {
    this.movimentacao.descricao = dado.descricao;
    this.movimentacao.valor = parseFloat((dado.valor / dado.parcelas).toFixed(2));
    this.movimentacao.icone = dado.icone;
    this.movimentacao.conta = dado.id;
    var data = new Date(dado.data);
  
    for (let index = 0; index < dado.parcelas; index++) {
      if (index === 0) {
        this.movimentacao.data = dado.data;
      } else {
        this.movimentacao.data = new Date(data.setMonth(data.getMonth() + 1));
      }
  
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          this.lucroDespesaService.salvar(this.movimentacao, "D").subscribe(
            () => {
              resolve();
            },
            (erro) => {
              console.error("Erro ao salvar movimentação:", erro);
            }
          );
        }, 500); // Atraso de 1000 ms multiplicado pelo índice
      });
    }
  }
  

   async onSubmit() {
    const dado: ContasInterface = {
      ...this.dadoForm.value,
      id: this.dadoId,
    };
   
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      message: 'Salvando',
      duration: 0,
    });
    await loading.present();
    
    if (this.dadoId) {
       await this.excluirGeral(dado);
    }
 
     await this.adicionaListaGeral(dado);
     console.log("inciar terminar")
        this.contasService.salvar(dado).subscribe(
          () => this.router.navigate(['contas']),
          (erro) => {
            console.error(erro);
            this.toastController
              .create({
                message: `Não foi possível salvar a movimentação ${dado.descricao}`,
                duration: 5000,
                keyboardClose: true,
                color: 'danger',
              })
              .then((t) => t.present());
          }
        );
        loading.dismiss();
  }

  get descricao() {
    return this.dadoForm.get('descricao');
  }
}