import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, ViewDidLeave, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { ContasInterface } from './tipos/contas-interface';
import { ContasService } from './service/contas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contas',
  templateUrl: './contas.page.html',
  styleUrls: ['./contas.page.scss'],
})

export class ContasPage 
implements OnInit, ViewWillEnter, ViewDidLeave, ViewWillLeave, ViewDidLeave {
  dados: ContasInterface[] = [];
  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private contasService: ContasService,
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

  inativar(dado: ContasInterface){
    this.contasService.salvar(dado).subscribe(
      () => this.router.navigate(['contas']),
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
    const observable = this.contasService.getDados();
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