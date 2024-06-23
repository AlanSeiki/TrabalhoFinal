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
  icone: string = 'home';
  movimentacao: LucroDespesaInterface;


  iconRows = [
    'home', 'game-controller-outline', 'airplane-outline',
    'pizza-outline', 'people-circle-outline', 'car-sport-outline',
    'wallet-outline', 'logo-apple', 'desktop-outline', "boat-outline", "diamond-outline", "restaurant-outline"
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
      descricao: "",
      data: new Date,
      conta: null,
      valor: 0,
      icone: "",
      meta: null,
      tipo: "D"
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
      descricao: new FormControl(dado?.descricao || '', [Validators.required, Validators.maxLength(30)]),
      valor: new FormControl(dado?.valor, [Validators.required, Validators.min(0)]),
      parcela: new FormControl(dado?.parcela, [Validators.required, Validators.min(0)]),
      data: new FormControl(this.getFormattedDate(dado?.data), [Validators.required]),
      icone: new FormControl(dado?.icone || this.icone, [Validators.required]),
    });
  }

  getFormattedDate(dateString: any): string {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    return date.toISOString().substring(0, 10); // Obtém apenas a parte da data em formato ISO
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
    this.contasService.salvar(dado).subscribe(
      (data: any) => {
        this.toastController
          .create({
            message: data.message,
            duration: 1500,
            keyboardClose: true,
            color: 'success',
          }).then((t) => t.present());
        this.router.navigate(['contas'])
      },
      (data) => {
        this.toastController
          .create({
            message: data.error.message,
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