import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  ToastController,
  ViewDidLeave,
  ViewWillEnter,
  ViewWillLeave,
} from '@ionic/angular';
import { DespesaInterface } from '../../tipos/despesa.interface';
import { DespesaService } from '../../services/despesa.service';

@Component({
  selector: 'app-despesa',
  templateUrl: './despesa-lista.page.html',
  styleUrls: ['./despesa-lista.page.scss'],
})
export class DespesaListaComponent
  implements OnInit, ViewWillEnter, ViewDidLeave, ViewWillLeave, ViewDidLeave
{
  dados: DespesaInterface[] = [];

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private despesaService: DespesaInterface
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

  listar() {
    const observable = this.despesaService.getDados();
    observable.subscribe(
      (dados) => {
        console.log(dados)
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

  confirmarExclusao(dado: DespesaInterface) {
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

  private excluir(dado: DespesaInterface) {
    if (dado.id) {
      this.despesaService.excluir(dado.id,'A').subscribe(
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
