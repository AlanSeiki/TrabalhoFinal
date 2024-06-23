import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, ViewDidLeave, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { ContasInterface } from './tipos/contas-interface';
import { ContasService } from './service/contas.service';
import { Router } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
@Component({
  selector: 'app-contas',
  templateUrl: './contas.page.html',
  styleUrls: ['./contas.page.scss'],
})

export class ContasPage 
implements OnInit, ViewWillEnter {
  dados: ContasInterface[] = [];
  lastPage: number = 0;
  page: number = 0;
  items = [];
  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private contasService: ContasService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.dados = [];
    this.listar();
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
  
  listar(page = 1) {
    const observable = this.contasService.getDados(page);
    observable.subscribe(
      (dados) => {
        this.page = dados.page ?? 0;
        this.lastPage = dados.lastPage ?? 0;
        this.dados = [...this.dados, ...dados.data];
      },
      (erro) => {
        console.error(erro);
        this.toastController
          .create({
            message: `Não foi possível listar os contas`,
            duration: 5000,
            keyboardClose: true,
            color: 'danger',
          })
          .then((t) => t.present());
      }
    );
  }
  
  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    if (this.page < this.lastPage) {
      setTimeout(() => {
        this.listar(this.page + 1)
        ev.target.complete();
      }, 500);
    } else {
      ev.target.disabled = true;
    }
  }
}