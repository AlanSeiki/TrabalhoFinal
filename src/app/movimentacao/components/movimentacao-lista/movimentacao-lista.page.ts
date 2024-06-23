import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  InfiniteScrollCustomEvent,
  ToastController,
  ViewDidLeave,
  ViewWillEnter,
  ViewWillLeave,
} from '@ionic/angular';
import { LucroDespesaInterface } from '../../tipos/lucro_despesa.interface';
import { LucroDespesaService } from '../../services/lucro-despesa.service';
import { MetasService } from '../../../metas/service/metas.service';
import { ContasService } from '../../../contas/service/contas.service';
import { MetasInterface } from 'src/app/metas/tipos/metas.interface';
import { ContasInterface } from 'src/app/contas/tipos/contas-interface';

@Component({
  selector: 'app-movimentacao',
  templateUrl: './movimentacao-lista.page.html',
  styleUrls: ['./movimentacao-lista.page.scss']
})
export class MovimentacaoListaComponent
  implements OnInit, ViewWillEnter, ViewDidLeave, ViewWillLeave, ViewDidLeave
{
  dados: LucroDespesaInterface[] | any = [] = [];
  metas: MetasInterface[] = [];
  contas: ContasInterface[] = [];
  isModalOpen = false;
  dataInicial: string = '';
  dataFinal: string = '';  
  tipo: string = '';
  conta: any;
  meta: any;
  lastPage: number = 0;
  page: number = 0;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private lucroDespesaService: LucroDespesaService,
    private metasService: MetasService,
    private contasService: ContasService,
  ) {}

  ionViewWillEnter() {
    this.listar();
    this.dados = [];
    this.carregarFiltros();
  }

  ionViewDidEnter() {
  }

  ionViewWillLeave() {
  }

  ionViewDidLeave() {
  }

  ngOnInit() {}

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  aplicarFiltros() {
    this.conta == "T" ? this.conta = null: '';
    this.meta == "T" ? this.meta = null: '';
    this.dados = [];
    this.page = 1;
    this.lastPage = 0;
    this.listar();
    this.setOpen(false)
  }

  listar(page = 1) {
    const observable = this.lucroDespesaService.getDados(this.dataFinal,this.dataInicial,this.tipo,this.conta,this.meta,page);
    observable.subscribe(
      (dados) => {
        this.page = dados.page ?? 0;
        this.lastPage = dados.lastPage ?? 0;
        this.dados = [...this.dados, ...dados.data];
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

  confirmarExclusao(dado: LucroDespesaInterface) {
    this.alertController
      .create({
        header: 'Confirmação de exclusão',
        message: `Deseja excluir a movimentação ${dado.descricao}?`,
        buttons: [
          {
            text: 'Sim',
            handler: () => this.excluir(dado),
          },
          {
            text: 'Não',
          },
        ],
      })
      .then((alerta) => alerta.present());
  }

  carregarFiltros(){
    const observable = this.metasService.getDadosAtivo();
    observable.subscribe(
      (dados) => {
        this.metas = dados;
      });
    const contas = this.contasService.getDadosC();
    contas.subscribe(
      (dados) => {
        this.contas = dados;
      });
  }

  private excluir(dado: LucroDespesaInterface) {
    if (dado.id) {
      this.lucroDespesaService.excluir(dado.id).subscribe(
        (data: any) => {
          this.toastController
            .create({
              message: data.message,
              duration: 1500,
              keyboardClose: true,
              color: 'success',
            }).then((t) => t.present());
            this.dados = []
            this.listar()
        }        
        ,
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
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    if (this.page < this.lastPage) {
      setTimeout(() => {
        this.listar(this.page + 1)
        ev.target.complete();
      }, 500);
    } else {
      ev.target.complete();
    }
  }
}
