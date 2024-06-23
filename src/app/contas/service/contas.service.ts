import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContasInterface } from '../tipos/contas-interface';
import { Paginate } from 'src/app/movimentacao/tipos/lucro_despesa.interface';

@Injectable({
  providedIn: 'root'
})
export class ContasService {

  private url = 'http://localhost:3000/contas'

  constructor(
    private httpClient: HttpClient
  ) {}
  
  getDados(page = 1, limit = 10): Observable<Paginate> {
    const dadosLocais = this.httpClient.get<Paginate>(this.url+`/paginate?page=${page}&limit=10`)
    return dadosLocais;
  }
  getDadosC(): Observable<ContasInterface[]> {
    const dadosLocais = this.httpClient.get<ContasInterface[]>(this.url)
    return dadosLocais;
  }

  getDado( id: number): Observable<ContasInterface> {
    return this.httpClient.get<ContasInterface>(`${this.url}/${id}`);
  }

  private adicionar( dado: ContasInterface)  {
    return this.httpClient.post(this.url, dado);
  }

  private atualizar( dado: ContasInterface) {
    return this.httpClient.patch(`${this.url}/${dado.id}`, dado);
  }

  salvar( dado: ContasInterface ) {
    if(dado.id) {
      return this.atualizar(dado);
    } else {
      return this.adicionar(dado);
    }
  }
}