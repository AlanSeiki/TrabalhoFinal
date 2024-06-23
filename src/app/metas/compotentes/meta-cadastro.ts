import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { MetasInterface } from '../tipos/metas.interface';
import { MetasService } from '../service/metas.service';

@Component({
  selector: 'app-meta-cadastro',
  templateUrl: './meta-cadastro.html',
  styleUrls: ['./meta-cadastro.scss'],
})
export class MetasCadastroComponent implements OnInit {
  dadoId: number | null;
  dadoForm: FormGroup;
  tipo: string;
  icone: string = 'home';

  iconRows = [
    'home', 'game-controller-outline', 'airplane-outline',
    'pizza-outline', 'people-circle-outline', 'car-sport-outline',
    'wallet-outline', 'logo-apple', 'desktop-outline', "boat-outline", "diamond-outline", "restaurant-outline"
  ];

  constructor(
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private metasService: MetasService,
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
      this.metasService.getDado(this.dadoId).subscribe((dado) => {
        this.dadoForm = this.initForm(dado);
        this.icone = dado.icone;
      });
    }
  }

  setSelectedIcon(iconName: string): void {
    this.icone = iconName;
  }


  initForm(dado?: MetasInterface): FormGroup {
    return new FormGroup({
      id: new FormControl(dado?.id || null),
      descricao: new FormControl(dado?.descricao || '', Validators.required),
      data_inicial: new FormControl(this.getFormattedDate(dado?.data_inicial), Validators.required),
      data_final: new FormControl(this.getFormattedDate(dado?.data_final), Validators.required),
      valor: new FormControl(dado?.valor || null, [Validators.required, Validators.min(0)]),
      valor_mes: new FormControl(dado?.valor_mes),
      icone: new FormControl(dado?.icone || this.icone),
      ativo: new FormControl(true),
    });
  }
  getFormattedDate(dateString: any): string {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    return date.toISOString().substring(0, 10); // Obtém apenas a parte da data em formato ISO
  }
  onSubmit() {
    const dado: MetasInterface = {
      ...this.dadoForm.value,
      id: this.dadoId,
    };

    this.metasService.salvar(dado).subscribe(
      (data: any) => {
        this.toastController
          .create({
            message: data.message,
            duration: 1500,
            keyboardClose: true,
            color: 'success',
          }).then((t) => t.present());
        this.router.navigate(['metas'])
      },
      (erro) => {
        this.toastController
          .create({
            message: erro.error.message,
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
