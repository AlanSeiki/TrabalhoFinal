import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MetasInterface } from '../tipos/metas.interface';

import { map } from 'rxjs/operators';
import { LucroDespesaInterface } from 'src/app/movimentacao/tipos/lucro_despesa.interface';

interface DadosAgrupadosPorMes {
  mes: string;
  soma: number;
}

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

  getDadosAtivo(): Observable<MetasInterface[]>{
    return this.httpClient.get<MetasInterface[]>(this.url).pipe(map(dados => {
      return dados.filter(item => item.ativo == true);
    })
    )
  }

  getDado( id: number): Observable<MetasInterface> {
    return this.httpClient.get<MetasInterface>(`${this.url}/${id}`);
  }

  getMovimetnacao(id: number): Observable<DadosAgrupadosPorMes[]> {
    let url_mov = `http://localhost:3000/movimentacao/movientacaoPorMes/${id}`;
    const dados = this.httpClient.get<DadosAgrupadosPorMes[]>(url_mov)
    return dados
  }

  getValor(id: number){
    let url_mov = `http://localhost:3000/movimentacao/movientacaoPorMes/${id}`;
    const dados = this.httpClient.get<any[]>(url_mov)
    return dados.pipe(
      map(dadosLocais => {
        var valorTotal = 0;
        dadosLocais.forEach(item => {
          valorTotal+=item.soma
        });
        
        return valorTotal;
      })
    );
  }

  private adicionar( dado: MetasInterface)  {
    return this.httpClient.post(this.url, dado);
  }

  private atualizar( dado: MetasInterface) {
    return this.httpClient.patch(`${this.url}/${dado.id}`, dado);
  }

  salvar( dado: MetasInterface ) {
    if(dado.id) {
      return this.atualizar(dado);
    } else {
      return this.adicionar(dado);
    }
  }

  calcularValorMensal(valor: number, dataInicio: Date, dataFinal: Date): number{
  const diferencaEmMilissegundos = dataFinal.getTime() - dataInicio.getTime();

  const diferencaEmMeses = diferencaEmMilissegundos / (1000 * 60 * 60 * 24 * 30);

  const mediaMensal = valor / diferencaEmMeses;

  return parseFloat(mediaMensal.toFixed(2));
  }
}