import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MetasInterface } from '../tipos/metas.interface';

import { map } from 'rxjs/operators';
import { LucroDespesaInterface } from 'src/app/movimentacao/tipos/lucro_despesa.interface';
@Injectable({
  providedIn: 'root'
})
export class MetasService {

  private url = 'http://localhost:3000/metas';

  constructor(
    private httpClient: HttpClient
  ) {}

  getDados(): Observable<MetasInterface[]>{
    return this.httpClient.get<MetasInterface[]>(this.url)
  }

  getDado( id: number): Observable<MetasInterface> {
    return this.httpClient.get<MetasInterface>(`${this.url}/${id}`);
  }

  getMovimetnacao(id: number): Observable<LucroDespesaInterface[]>{
    let url_mov = 'http://localhost:3000/listaGeral';
    const dadosLocais = this.httpClient.get<LucroDespesaInterface[]>(url_mov)
    return dadosLocais.pipe(map(dadosLocais => {
      var dadosMov;
      dadosMov = dadosLocais.filter(item => item.tipo === 'M' && item.meta == id)
      return dadosMov;
    }))
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