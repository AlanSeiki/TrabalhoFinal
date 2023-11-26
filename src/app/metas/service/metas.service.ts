import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MetasInterface } from '../tipos/metas.interface';

import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MetasService {

  private url = 'http://localhost:3000/metas';

  constructor(
    private httpClient: HttpClient
  ) {}

//   getDados(dataFinal:string,dataInicial:string,tipo:string): Observable<MetasInterface[]> {
//     const dadosLocais = this.httpClient.get<MetasInterface[]>(this.url)
  
//     return dadosLocais.pipe(
//       map(dadosLocais => {
//         const dataAtual1 = new Date(dataInicial)
//         const dataFinal1 = new Date(dataFinal)
//         var dadosLucro;
//         if(tipo != '' && dataInicial != '' && dataFinal != ''){
//            dadosLucro = dadosLocais.filter(item => item.tipo === tipo && new Date(item.data) >= dataAtual1 && new Date(item.data) <= dataFinal1);
//         }else if(dataInicial != '' && dataFinal != '' && tipo == ''){
//            dadosLucro = dadosLocais.filter(item => new Date(item.data) >= dataAtual1 && new Date(item.data) <= dataFinal1);
//         }else if(dataInicial == '' && dataFinal != '' && tipo == ''){
//           dadosLucro = dadosLocais.filter(item => new Date(item.data) <= dataFinal1);
//        }else if(dataInicial != '' && dataFinal == '' && tipo == ''){
//           dadosLucro = dadosLocais.filter(item => new Date(item.data) >= dataAtual1);
//        }else if(dataInicial == '' && dataFinal == '' && tipo != ''){
//           dadosLucro = dadosLocais.filter(item => item.tipo === tipo);
//        }else{
//            dadosLucro = dadosLocais;
//         }
        

//         return dadosLucro;
//       })
//     );
//   }

  getDados(): Observable<MetasInterface[]>{
    return this.httpClient.get<MetasInterface[]>(this.url)
  }

  excluir( id: number): Observable<Object> {
    return this.httpClient.delete(`${this.url}/${id}`);
  }

  getDado( id: number): Observable<MetasInterface> {
    return this.httpClient.get<MetasInterface>(`${this.url}/${id}`);
  }

  private adicionar( dado: MetasInterface)  {
    return this.httpClient.post(this.url, dado);
  }

  private atualizar( dado: MetasInterface) {
    return this.httpClient.put(`${this.url}/${dado.id}`, dado);
  }

  salvar( dado: MetasInterface ) {
    if(dado.id) {
      return this.atualizar(dado);
    } else {
      return this.adicionar(dado);
    }
  }
}