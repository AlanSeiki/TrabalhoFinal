import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin  } from 'rxjs';
import { DespesaInterface } from '../tipos/despesa.interface';
import { mergeMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DespesaService {

  private url = '';

  constructor(
    private httpClient: HttpClient
  ) {}

  getDados(): Observable<DespesaInterface[]> {
    const urlDespesa = 'http://localhost:3000/despesa';
    const urlLucro = 'http://localhost:3000/lucro';
  
    // Combina as duas solicitações usando forkJoin
    return forkJoin({
      despesa: this.httpClient.get<DespesaInterface[]>(urlDespesa),
      lucro: this.httpClient.get<DespesaInterface[]>(urlLucro)
    }).pipe(
      // Usa o operador map para adicionar uma propriedade "tipo" aos itens da lista
      map(result => {
        result.despesa.forEach(item => item.tipo = 'D');
        return result.despesa.concat(result.lucro);
      })
    );
  }

  excluir( id: number, tipo:string ): Observable<Object> {
    this.url = tipo == 'D' ? 'http://localhost:3000/despesa' : 'http://localhost:3000/lucro'
    return this.httpClient.delete(`${this.url}/${id}`);
  }

  getDado( id: number, tipo:string ): Observable<DespesaInterface> {
    this.url = tipo == 'D' ? 'http://localhost:3000/despesa' : 'http://localhost:3000/lucro'
    return this.httpClient.get<DespesaInterface>(`${this.url}/${id}`);
  }

  private adicionar( dado: DespesaInterface )  {
    return this.httpClient.post(this.url, dado);
  }

  private atualizar( dado: DespesaInterface ) {
    return this.httpClient.put(`${this.url}/${dado.id}`, dado);
  }

  salvar( dado: DespesaInterface, tipo:string ) {
    this.url = tipo == 'D' ? 'http://localhost:3000/despesa' : 'http://localhost:3000/contas';
    if(dado.id) {
      return this.atualizar(dado);
    } else {
      return this.adicionar(dado);
    }
  }
}