import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DespesaInterface } from '../../tipos/despesa.interface';
import { DespesaService } from '../../services/despesa.service';

@Component({
  selector: 'app-contas-cadastro',
  templateUrl: './contas-cadastro.component.html',
  styleUrls: ['./contas-cadastro.component.scss'],
})
export class DespesaCadastroComponent implements OnInit {
  dadoId: number | null;
  dadoForm: FormGroup;
  dadoTipo: string | null;
  tipo: string;
  icone:string = 'home';

  iconRows = [
    ['home', 'game-controller-outline', 'airplane-outline'],
    ['pizza-outline', 'logo-rss', 'logo-steam'],
    ['wallet-outline', 'logo-apple', 'logo-xbox']
  ];

  constructor(
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private despesaService: DespesaService,
    private router: Router
  ) {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') || 'Valor Padrão';
    this.dadoId = null;
    this.dadoForm = this.initForm();
    this.dadoTipo = null;
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    const tipo = this.activatedRoute.snapshot.paramMap.get('tipo');
    
    if (id) {
      this.dadoId = parseInt(id);
      this.dadoTipo = tipo == null ? 'D' : tipo;
      this.despesaService.getDado(this.dadoId, this.dadoTipo).subscribe((dado) => {
        this.dadoForm = this.initForm(dado);
        this.icone = dado.icone;
      });
    }
  }

  setSelectedIcon(iconName: string): void {
    console.log(this.icone)
      this.icone = iconName;
      console.log(this.icone)
      console.log(iconName)
  }
  

  initForm(dado?: DespesaInterface): FormGroup {
    return new FormGroup({
      id: new FormControl(dado?.id || null),
      descricao: new FormControl(dado?.descricao || '', Validators.required),
      data: new FormControl(new Date),
      banco: new FormControl(null),
      conta: new FormControl(null),
      valor: new FormControl(dado?.valor || null, [Validators.required, Validators.min(0)]),
      icone: new FormControl(dado?.icone || this.icone),
    });
  }

  onSubmit(tipo: string) {
    console.log(tipo)
    const dado: DespesaInterface = {
      ...this.dadoForm.value,
      id: this.dadoId,
    };

    this.despesaService.salvar(dado, tipo).subscribe(
      () => this.router.navigate(['contas']),
      (erro) => {
        console.error(erro);
        this.toastController
          .create({
            message: `Não foi possível salvar a conta ${dado.descricao}`,
            duration: 5000,
            keyboardClose: true,
            color: 'danger',
          })
          .then((t) => t.present());
      }
    );
  }

  get descricao() {
    return this.dadoForm.get('descricao');
  }
}
