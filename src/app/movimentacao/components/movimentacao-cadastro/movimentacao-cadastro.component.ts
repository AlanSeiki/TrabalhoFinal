import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LucroDespesaInterface } from '../../tipos/lucro_despesa.interface';
import { LucroDespesaService } from '../../services/lucro-despesa.service';

@Component({
  selector: 'app-movimentacao-cadastro',
  templateUrl: './movimentacao-cadastro.component.html',
  styleUrls: ['./movimentacao-cadastro.component.scss'],
})
export class LucroDespesaCadastroComponent implements OnInit {
  dadoId: number | null;
  dadoForm: FormGroup;
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
    private lucroDespesaService: LucroDespesaService,
    private router: Router
  ) {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') || 'Valor Padrão';
    this.dadoId = null;
    this.dadoForm = this.initForm();
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    
    if (id) {
      this.dadoId = parseInt(id);
      this.lucroDespesaService.getDado(this.dadoId).subscribe((dado) => {
        this.dadoForm = this.initForm(dado);
        this.icone = dado.icone;
      });
    }
  }

  setSelectedIcon(iconName: string): void {
      this.icone = iconName;
  }
  

  initForm(dado?: LucroDespesaInterface): FormGroup {
    return new FormGroup({
      id: new FormControl(dado?.id || null),
      descricao: new FormControl(dado?.descricao || '', Validators.required),
      data: new FormControl(dado?.data || new Date().toISOString()),
      conta: new FormControl(null),
      valor: new FormControl(dado?.valor || null, [Validators.required, Validators.min(0)]),
      icone: new FormControl(this.icone),
      meta: new FormControl(null)
    });
  }

  onSubmit(tipo: string) {
    const dado: LucroDespesaInterface = {
      ...this.dadoForm.value,
      id: this.dadoId,
    };

    this.lucroDespesaService.salvar(dado, tipo).subscribe(
      () => this.router.navigate(['movimentacao']),
      (error) => {
        this.toastController
          .create({
            message: `Não foi possível salvar a movimentação ${error.message}`,
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
