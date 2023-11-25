import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LucroDespesaInterface } from '../tipos/lucro_despesa.interface';


@Injectable({
  providedIn: 'root'
})
export class LucroDespesaService {

  private url = 'http://localhost:3000/listaGeral';

  constructor(
    private httpClient: HttpClient
  ) {}

  getDados(): Observable<LucroDespesaInterface[]> {
    return  this.httpClient.get<LucroDespesaInterface[]>(this.url)
  }

  getDadosSimplificado(): Observable<LucroDespesaInterface[]> {
    return this.httpClient.get<LucroDespesaInterface[]>(this.url);
  }

  getSaldo(): Observable<LucroDespesaInterface[]> {
    // Combina as duas solicitações usando forkJoin
    return  this.httpClient.get<LucroDespesaInterface[]>(this.url)
     
  }

  excluir( id: number): Observable<Object> {
    return this.httpClient.delete(`${this.url}/${id}`);
  }

  getDado( id: number): Observable<LucroDespesaInterface> {
    return this.httpClient.get<LucroDespesaInterface>(`${this.url}/${id}`);
  }

  private adicionar( dado: LucroDespesaInterface, tipo:string)  {
    dado.tipo = tipo == 'D' ? "D" : "L";
    return this.httpClient.post(this.url, dado);
  }

  private atualizar( dado: LucroDespesaInterface) {
    return this.httpClient.put(`${this.url}/${dado.id}`, dado);
  }

  salvar( dado: LucroDespesaInterface, tipo:string ) {
    if(dado.id) {
      return this.atualizar(dado);
    } else {
      return this.adicionar(dado,tipo);
    }
  }
}