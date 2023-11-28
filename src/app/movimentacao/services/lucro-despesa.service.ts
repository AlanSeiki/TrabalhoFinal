import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LucroDespesaInterface } from '../tipos/lucro_despesa.interface';

import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LucroDespesaService {

  private url = 'http://localhost:3000/listaGeral';

  constructor(
    private httpClient: HttpClient
  ) {}

  getDados(dataFinal:string,dataInicial:string,tipo:string,conta:any): Observable<LucroDespesaInterface[]> {
    const dadosLocais = this.httpClient.get<LucroDespesaInterface[]>(this.url)
  
    return dadosLocais.pipe(
      map(dadosLocais => {
        const dataAtual1 = new Date(dataInicial)
        const dataFinal1 = new Date(dataFinal)
        var dadosLucro;
        dadosLucro = dadosLocais.filter(item =>
          (tipo === '' || item.tipo === tipo) &&
          (dataInicial === '' || new Date(item.data) >= dataAtual1) &&
          (dataFinal === '' || new Date(item.data) <= dataFinal1) &&
          (conta == null || item.conta == conta)
        )
        

        return dadosLucro;
      })
    );
  }

  getDadosSimplificado(): Observable<LucroDespesaInterface[]> {
    const dadosLocais = this.httpClient.get<LucroDespesaInterface[]>(this.url)
  
    return dadosLocais.pipe(
      map(dadosLocais => {
        // Ordena os dados pela data em ordem decrescente
        const dadosOrdenados = dadosLocais.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  
        // Pega os primeiros 5 registros
        const ultimos5Registros = dadosOrdenados.slice(0, 5);
  
        // Retorna os últimos 5 registros
        return ultimos5Registros;
      })
    );
  }
  getSaldo(): Observable<number> {
    const dadosLocais = this.httpClient.get<LucroDespesaInterface[]>(this.url)
    return dadosLocais.pipe(
      map(dadosLocais => {
        const dataAtual = new Date();

        // Filtra apenas os elementos com tipo igual a 'L' e data até a data atual
        const dadosLucro = dadosLocais.filter(item => item.tipo === 'L' && new Date(item.data) <= dataAtual);
  
        // Filtra apenas os elementos com tipo igual a 'D' e data até a data atual
        const dadosDespesa = dadosLocais.filter(item => item.tipo === 'D' && new Date(item.data) <= dataAtual);
  
        // Calcula a soma dos valores de lucro
        const saldoLucro = dadosLucro.reduce((soma, valor) => soma + valor.valor, 0);
  
        // Calcula a soma dos valores de despesa
        const saldoDespesa = dadosDespesa.reduce((soma, valor) => soma + valor.valor, 0);
  
        // Calcula o saldo como a diferença entre lucro e despesa
        const saldo = saldoLucro - saldoDespesa;
  
        return saldo;
      })
    );
  }
  getLucro(): Observable<number> {
    const dadosLocais = this.httpClient.get<LucroDespesaInterface[]>(this.url)
    return dadosLocais.pipe(
      map(dadosLocais => {
        const dataAtual = new Date();
        const dadosLucro = dadosLocais.filter(item => item.tipo === 'L' && new Date(item.data) <= dataAtual);
        const dadosOrdenados = dadosLucro.reduce((soma,valor) => soma + valor.valor, 0);
        return dadosOrdenados;
      })
    );
  }
  getDespesa(): Observable<number> {
    const dadosLocais = this.httpClient.get<LucroDespesaInterface[]>(this.url)
    return dadosLocais.pipe(
      map(dadosLocais => {
        const dataAtual = new Date();
        const dadosLucro = dadosLocais.filter(item => item.tipo === 'D' && new Date(item.data) <= dataAtual);
        const dadosOrdenados = dadosLucro.reduce((soma,valor) => soma + valor.valor, 0);
        return dadosOrdenados;
      })
    );
  }

  excluir( id: number): Observable<Object> {
    return this.httpClient.delete(`${this.url}/${id}`);
  }

  getDado( id: number): Observable<LucroDespesaInterface> {
    return this.httpClient.get<LucroDespesaInterface>(`${this.url}/${id}`);
  }

  private adicionar( dado: LucroDespesaInterface, tipo:string)  {
    dado.tipo = tipo == 'D' ? "D" : tipo == 'L' ? "L" : "M";
    return this.httpClient.post(this.url, dado);
  }

  private atualizar( dado: LucroDespesaInterface, tipo:string) {
    dado.tipo = tipo == 'D' ? "D" : "L";
    return this.httpClient.put(`${this.url}/${dado.id}`, dado);
  }

  salvar( dado: LucroDespesaInterface, tipo:string ) {
    if(dado.id) {
      return this.atualizar(dado,tipo);
    } else {
      return this.adicionar(dado,tipo);
    }
  }
}