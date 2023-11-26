import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LucroDespesaInterface } from '../../tipos/lucro_despesa.interface';
import { MetasInterface } from '../../../metas/tipos/metas.interface';
import { LucroDespesaService } from '../../services/lucro-despesa.service';
import { MetasService } from '../../../metas/service/metas.service';
import {
  ViewWillEnter
} from '@ionic/angular';

@Component({
  selector: 'app-movimentacao-cadastro-meta',
  templateUrl: './movimentacao-cadastro-meta.component.html',
  styleUrls: ['./movimentacao-cadastro-meta.component.scss'],
})
export class MetaCadastroComponent implements OnInit, ViewWillEnter {
  dadoId: number | null;
  dadoForm: FormGroup;
  tipo: string;
  icone: string = 'home';
  dados: MetasInterface[] = [];
  
  iconRows = [
    ['home', 'game-controller-outline', 'airplane-outline'],
    ['pizza-outline', 'people-circle-outline', 'car-sport-outline'],
    ['wallet-outline', 'logo-apple', 'desktop-outline']
  ];

  constructor(
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private lucroDespesaService: LucroDespesaService,
    private metasService: MetasService,
    private router: Router
  ) {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') || 'Valor Padrão';
    this.dadoId = null;
    this.dadoForm = this.initForm();
  }

  ionViewWillEnter() {
    this.metas();
  }

  metas(){
   const observable = this.metasService.getDados();
    observable.subscribe(
      (dados) => {
        this.dados = dados;
      },
      (erro) => {
        console.error(erro);
        this.toastController
          .create({
            message: `Não foi possível listar as metas`,
            duration: 5000,
            keyboardClose: true,
            color: 'danger',
          })
          .then((t) => t.present());
      }
    );
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
      descricao: new FormControl("Meta"),
      data: new FormControl(dado?.data || new Date().toISOString()),
      banco: new FormControl(null),
      conta: new FormControl(null),
      valor: new FormControl(dado?.valor || null, [Validators.required, Validators.min(0)]),
      icone: new FormControl(this.icone),
      meta: new FormControl(null,Validators.required),
      tipo: new FormControl("M")
    });
  }

  onSubmit(tipo: string) {
    const dado: LucroDespesaInterface = {
      ...this.dadoForm.value,
      id: this.dadoId,
    };
    this.lucroDespesaService.salvar(dado, tipo).subscribe(
      () => this.router.navigate(['movimentacao']),
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
  }

  get descricao() {
    return this.dadoForm.get('descricao');
  }
}
