import { Component } from '@angular/core';
import {
  InfiniteScrollCustomEvent,
  ToastController,
  ViewWillEnter,
} from '@ionic/angular';
import { LucroDespesaInterface, Paginate } from '../movimentacao/tipos/lucro_despesa.interface';
import { LucroDespesaService } from '../movimentacao/services/lucro-despesa.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements ViewWillEnter {
  dados: LucroDespesaInterface[] | any = [];
  lucro: any;
  despesa: any;
  saldo: number | null;
  icone: string = '';
  color: string = '';
  lastPage: number = 0;
  page: number = 0;

  constructor(
    private lucroDespesaService: LucroDespesaService,
    private toastController: ToastController
    ) {
      this.lucro = 0;
      this.despesa = 0;
      this.saldo = 0;
    }

  ionViewWillEnter() {
    this.listar();
    this.getSaldo();
    this.getLucro();
  }

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

 async getLucro() {
    const valor = await this.lucroDespesaService.getLucro();
    valor.subscribe(
      (dados: any) => {
        let lucroTotal;
        let despesaTotal;
        dados.map(function(v: any) {
          if (v.tipo == 'L') {
            lucroTotal = v.total;
          } else if (v.tipo == 'D') {
            despesaTotal = v.total;
          } 
        })
        this.lucro = lucroTotal;
        this.despesa = despesaTotal;

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

  listar(page = 1) {
    const observable = this.lucroDespesaService.getDadosSimplificado(page);
    observable.subscribe(
      (dados: Paginate) => {
        this.page = dados.page ?? 0;
        this.lastPage = dados.lastPage ?? 0;
        this.dados = [...this.dados, ...dados.data];
      },
      (erro) => {
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
