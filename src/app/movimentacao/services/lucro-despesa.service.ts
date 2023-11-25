import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin  } from 'rxjs';
import { LucroDespesaInterface } from '../tipos/lucro_despesa.interface';
import { mergeMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LucroDespesaService {

  private url = '';

  constructor(
    private httpClient: HttpClient
  ) {}

  getDados(): Observable<LucroDespesaInterface[]> {
    const urlDespesa = 'http://localhost:3000/despesa';
    const urlLucro = 'http://localhost:3000/lucro';
  
    // Combina as duas solicitações usando forkJoin
    return forkJoin({
      despesa: this.httpClient.get<LucroDespesaInterface[]>(urlDespesa),
      lucro: this.httpClient.get<LucroDespesaInterface[]>(urlLucro)
    }).pipe(
      // Usa o operador map para adicionar uma propriedade "tipo" aos itens da lista
      map(result => {
        result.despesa.forEach(item => item.tipo = 'D');
        result.lucro.forEach(item => item.tipo = 'L');
        return result.despesa.concat(result.lucro);
      })
    );
  }

  excluir( id: number, tipo:string ): Observable<Object> {
    this.url = tipo == 'D' ? 'http://localhost:3000/despesa' : 'http://localhost:3000/lucro'
    return this.httpClient.delete(`${this.url}/${id}`);
  }

  getDado( id: number, tipo:string ): Observable<LucroDespesaInterface> {
    this.url = tipo == 'D' ? 'http://localhost:3000/despesa' : 'http://localhost:3000/lucro'
    return this.httpClient.get<LucroDespesaInterface>(`${this.url}/${id}`);
  }

  private adicionar( dado: LucroDespesaInterface )  {
    return this.httpClient.post(this.url, dado);
  }

  private atualizar( dado: LucroDespesaInterface ) {
    return this.httpClient.put(`${this.url}/${dado.id}`, dado);
  }

  salvar( dado: LucroDespesaInterface, tipo:string ) {
    this.url = tipo == 'D' ? 'http://localhost:3000/despesa' : 'http://localhost:3000/lucro';
    if(dado.id) {
      return this.atualizar(dado);
    } else {
      return this.adicionar(dado);
    }
  }
}