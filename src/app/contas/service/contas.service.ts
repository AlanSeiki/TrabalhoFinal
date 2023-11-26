import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContasInterface } from '../tipos/contas-interface';

@Injectable({
  providedIn: 'root'
})
export class ContasService {

  private url = 'http://localhost:3000/contas';

  constructor(
    private httpClient: HttpClient
  ) {}

  getDados(): Observable<ContasInterface[]>{
    return this.httpClient.get<ContasInterface[]>(this.url)
  }

  getDado( id: number): Observable<ContasInterface> {
    return this.httpClient.get<ContasInterface>(`${this.url}/${id}`);
  }

  private adicionar( dado: ContasInterface)  {
    return this.httpClient.post(this.url, dado);
  }

  private atualizar( dado: ContasInterface) {
    return this.httpClient.put(`${this.url}/${dado.id}`, dado);
  }

  salvar( dado: ContasInterface ) {
    if(dado.id) {
      return this.atualizar(dado);
    } else {
      return this.adicionar(dado);
    }
  }
}