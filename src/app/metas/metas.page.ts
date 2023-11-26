import { Component, OnInit } from '@angular/core';
import { MetasInterface } from './tipos/metas.interface';
import {
  AlertController,
  ToastController,
  ViewDidLeave,
  ViewWillEnter,
  ViewWillLeave,
} from '@ionic/angular';
import { MetasService } from './service/metas.service';

@Component({
  selector: 'app-metas',
  templateUrl: './metas.page.html',
  styleUrls: ['./metas.page.scss'],
})
export class MetasPage 
implements OnInit, ViewWillEnter, ViewDidLeave, ViewWillLeave, ViewDidLeave {
  dados: MetasInterface[] = [];
  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private metasService: MetasService
  ) { }

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
    const observable = this.metasService.getDados();
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
}
