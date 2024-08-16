import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LucroDespesaInterface, Paginate } from '../tipos/lucro_despesa.interface';

import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LucroDespesaService {

  private url = 'http://localhost:3000/movimentacao';

  constructor(
    private httpClient: HttpClient
  ) {}

  getDados(dataFinal:string,dataInicial:string,tipo:string,conta:any,meta:any,page=1): Observable<Paginate> {
    const params = {
      dataFinal: dataFinal || '',
      dataInicial: dataInicial || '',
      tipo: tipo || '',
      conta: conta || '',
      meta: meta || ''
    };

    const dadosLocais = this.httpClient.get<Paginate>(this.url+`/paginate?page=${page}&limit=15`,{params: params});
    return dadosLocais;
  }

  getDadosSimplificado(page = 1, limit = 10): Observable<Paginate> {
    const dadosLocais = this.httpClient.get<Paginate>(this.url+`/paginate?page=${page}&limit=10`)
    return dadosLocais;
  }
  
  getSaldo(): Observable<number> {
    const dadosLocais = this.httpClient.get<LucroDespesaInterface[]>(this.url)
    return dadosLocais.pipe(
      map(dadosLocais => {
        const dataAtual = new Date();

        const dadosLucro = dadosLocais.filter(item => item.tipo === 'L' && new Date(item.data) <= dataAtual);
  
        const dadosDespesa = dadosLocais.filter(item => item.tipo === 'D' && new Date(item.data) <= dataAtual);
  
        const saldoLucro = dadosLucro.reduce((soma, valor) => soma + valor.valor, 0);
  
        const saldoDespesa = dadosDespesa.reduce((soma, valor) => soma + valor.valor, 0);
  
        const saldo = saldoLucro - saldoDespesa;
  
        return saldo;
      })
    );
  }
 async getLucro() {
    const dadosLocais = await this.httpClient.get(this.url+'/lucro_despesa')
    return dadosLocais
  }

  excluir( id: number): Observable<Object> {
    return this.httpClient.delete(`${this.url}/${id}`);
  }

  getDado( id: number): Observable<LucroDespesaInterface> {
    return this.httpClient.get<LucroDespesaInterface>(`${this.url}/${id}`);
  }

  private adicionar( dado: LucroDespesaInterface, tipo:string) {
    dado.tipo = tipo == 'D' ? "D" : tipo == 'L' ? "L" : "M";
    return this.httpClient.post<{ message: string }>(this.url, dado);
  }

  private atualizar( dado: LucroDespesaInterface, tipo:string) {
    dado.tipo = tipo == 'D' ? "D" : tipo == 'L' ? "L" : "M";
    return this.httpClient.patch<{ message: string }>(`${this.url}/${dado.id}`, dado);
  }

  salvar( dado: LucroDespesaInterface, tipo:string ) {
    if(dado.id) {
      return this.atualizar(dado,tipo);
    } else {
      return this.adicionar(dado,tipo);
    }
  }
}