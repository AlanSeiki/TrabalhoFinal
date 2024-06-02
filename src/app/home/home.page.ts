import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  ToastController,
  ViewDidLeave,
  ViewWillEnter,
  ViewWillLeave,
} from '@ionic/angular';
import { LucroDespesaInterface, Paginate } from '../movimentacao/tipos/lucro_despesa.interface';
import { LucroDespesaService } from '../movimentacao/services/lucro-despesa.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, ViewWillEnter, ViewDidLeave, ViewWillLeave, ViewDidLeave {
  dados: LucroDespesaInterface[] | null = [];
  lucro: number | null;
  despesa: number | null;
  saldo: number | null;
  icone: string = '';
  color: string = '';
  constructor(
    private lucroDespesaService: LucroDespesaService,
    private toastController: ToastController
    ) {
      this.lucro = null;
      this.despesa = null;
      this.saldo = null;
    }

  ionViewWillEnter() {
    this.listar();
    this.getSaldo();
    this.getLucro();
    this.getDespesa();
  }

  ionViewDidEnter() {
  }

  ionViewWillLeave() {
  }

  ionViewDidLeave() {
  }

  ngOnInit() {}

  getSaldo(){
    const valor = this.lucroDespesaService.getSaldo();
    valor.subscribe(
      (dados) => {
        if(dados > 0){
          this.color = 'success'
          this.icone = 'happy-outline'
          this.saldo = dados;
        }else{
          this.color = 'danger'
          this.icone = 'sad-outline'
          this.saldo = dados*-1;
        }
      },(erro) => {
        console.error(erro);
        this.toastController
          .create({
            message: `Não foi possível pegar o saldo`,
            duration: 5000,
            keyboardClose: true,
            color: 'danger',
          })
          .then((t) => t.present());
      }
    )
  }
  getDespesa(){
    const valor = this.lucroDespesaService.getDespesa();
    valor.subscribe(
      (dados) => {
       this.despesa = dados
      },(erro) => {
        console.error(erro);
        this.toastController
          .create({
            message: `Não foi possível pegar o saldo`,
            duration: 5000,
            keyboardClose: true,
            color: 'danger',
          })
          .then((t) => t.present());
      }
    )
  }

  getLucro() {
    const valor = this.lucroDespesaService.getLucro();
    valor.subscribe(
      (dados) => {
       this.lucro = dados
      },(erro) => {
        console.error(erro);
        this.toastController
          .create({
            message: `Não foi possível pegar o saldo`,
            duration: 5000,
            keyboardClose: true,
            color: 'danger',
          })
          .then((t) => t.present());
      }
    )
  }

  listar() {
    const observable = this.lucroDespesaService.getDadosSimplificado();
    observable.subscribe(
      (dados: Paginate) => {
        console.log(dados)
        this.dados = dados.data;
      },
      (erro) => {
        console.error(erro);
        this.toastController
          .create({
            message: `Não foi possível listar as movimentações`,
            duration: 5000,
            keyboardClose: true,
            color: 'danger',
          })
          .then((t) => t.present());
      }
    );
  }

}
