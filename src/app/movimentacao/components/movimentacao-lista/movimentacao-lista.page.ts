import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  ToastController,
  ViewDidLeave,
  ViewWillEnter,
  ViewWillLeave,
} from '@ionic/angular';
import { LucroDespesaInterface } from '../../tipos/lucro_despesa.interface';
import { LucroDespesaService } from '../../services/lucro-despesa.service';

@Component({
  selector: 'app-movimentacao',
  templateUrl: './movimentacao-lista.page.html',
  styleUrls: ['./movimentacao-lista.page.scss']
})
export class MovimentacaoListaComponent
  implements OnInit, ViewWillEnter, ViewDidLeave, ViewWillLeave, ViewDidLeave
{
  dados: LucroDespesaInterface[] = [];
  isModalOpen = false;
  dataInicial: string = ''; // Variável para armazenar a data inicial
  dataFinal: string = '';   // Variável para armazenar a data final
  tipo: string = '';        // Variável para armazenar o tipo (L ou D)
  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private lucroDespesaService: LucroDespesaService
  ) {}

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.listar();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave');
  }

  ngOnInit() {}

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  aplicarFiltros() {
    this.listar();
    this.setOpen(false)
  }

  listar() {
    const observable = this.lucroDespesaService.getDados(this.dataFinal,this.dataInicial,this.tipo);
    observable.subscribe(
      (dados) => {
        this.dados = dados;
      },
      (erro) => {
        console.error(erro);
        this.toastController
          .create({
            message: `Não foi possível listar os autores`,
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

  private excluir(dado: LucroDespesaInterface) {
    if (dado.id) {
      this.lucroDespesaService.excluir(dado.id).subscribe(
        () => this.listar(),
        (erro) => {
          console.error(erro);
          this.toastController
            .create({
              message: `Não foi possível excluir o autor ${dado.descricao}`,
              duration: 5000,
              keyboardClose: true,
              color: 'danger',
            })
            .then((t) => t.present());
        }
      );
    }
  }
}
