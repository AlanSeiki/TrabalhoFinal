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
    'home', 'game-controller-outline', 'airplane-outline',
    'pizza-outline', 'people-circle-outline', 'car-sport-outline',
    'wallet-outline', 'logo-apple', 'desktop-outline',"boat-outline","diamond-outline","restaurant-outline"
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
      descricao: new FormControl({value: dado?.descricao, disabled: this.tipo == 'M' ? true : false }|| '', Validators.required),
      data: new FormControl(this.getFormattedDate(dado?.data) || this.getFormattedDate1(new Date())),
      conta: new FormControl(null),
      valor: new FormControl(dado?.valor || null, [Validators.required, Validators.min(0)]),
      icone: new FormControl(dado?.icone || this.icone ,[Validators.required]),
      meta: new FormControl(dado?.meta?.id || null),
    });
  }

  getFormattedDate1(date: Date): string {
    
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    localDate.setHours(0, 0, 0, 0);

    return localDate.toISOString();
  }
  
  getFormattedDate(dateString: any): string {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    return date.toISOString().substring(0, 10); // Obtém apenas a parte da data em formato ISO
  }

  onSubmit(tipo: string) {
    const dado: LucroDespesaInterface = {
      ...this.dadoForm.value,
      id: this.dadoId,
    };

    this.lucroDespesaService.salvar(dado, tipo).subscribe(
      (data: any) => {
        this.toastController
          .create({
            message: data.message,
            duration: 1500,
            keyboardClose: true,
            color: 'success',
          }).then((t) => t.present());
        this.router.navigate(['movimentacao'])
      },
      (error) => {
        this.toastController
          .create({
            message: error.error.message,
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
