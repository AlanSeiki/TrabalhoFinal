import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ContasInterface } from '../tipos/contas-interface';
import { ContasService } from '../service/contas.service';

@Component({
  selector: 'app-contas-cadastro',
  templateUrl: './contas-cadastro.components.html',
  styleUrls: ['./contas-cadastro.components.scss'],
})
export class ContasCadastroComponent implements OnInit {
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
    private contasService: ContasService,
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
      data: new FormControl(new Date),
      banco: new FormControl(null),
      conta: new FormControl(null),
      valor: new FormControl(dado?.valor || null, [Validators.required, Validators.min(0)]),
      icone: new FormControl(this.icone),
    });
  }

  onSubmit(tipo: string) {
    const dado: ContasInterface = {
      ...this.dadoForm.value,
      id: this.dadoId,
    };

    this.contasService.salvar(dado).subscribe(
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
