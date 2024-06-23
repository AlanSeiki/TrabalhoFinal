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
  }

  ionViewWillLeave() {
  }

  ionViewDidLeave() {
  }

  ngOnInit() {}

  inativar(dado: MetasInterface){
    dado.ativo = dado.ativo == true ? false : true
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
        console.error(erro);
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
  
  listar() {
    const observable = this.metasService.getDados();
    observable.subscribe(
      (dados) => {
        this.dados = dados;
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
}
