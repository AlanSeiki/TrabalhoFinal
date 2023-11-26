import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { MetasInterface } from './tipos/metas.interface';
import {
  AlertController,
  ToastController,
  ViewDidLeave,
  ViewWillEnter,
  ViewWillLeave,
} from '@ionic/angular';
import { MetasService } from './service/metas.service';
import { Router } from '@angular/router';

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
    private metasService: MetasService,
    private router: Router
  ) { }

  ionViewWillEnter() {
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

  inativar(dado: MetasInterface){
    dado.ativo = dado.ativo == true ? false : true
    this.metasService.salvar(dado).subscribe(
      () => this.router.navigate(['metas']),
      (erro) => {
        console.error(erro);
        this.toastController
          .create({
            message: `Não foi possível inativar a meta ${dado.descricao}`,
            duration: 5000,
            keyboardClose: true,
            color: 'danger',
          })
          .then((t) => t.present());
      }
    );
  }
  
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
