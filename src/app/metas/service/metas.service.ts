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

  getDado( id: number): Observable<MetasInterface> {
    return this.httpClient.get<MetasInterface>(`${this.url}/${id}`);
  }

  getMovimetnacao(id: number): Observable<DadosAgrupadosPorMes[]> {
    let url_mov = 'http://localhost:3000/listaGeral';
    const dados = this.httpClient.get<LucroDespesaInterface[]>(url_mov)
    return dados.pipe(
      map(dadosLocais => {
        // Filtra os dados para considerar apenas itens do tipo 'M' com a meta específica
        const dadosFiltrados = dadosLocais.filter(item => item.tipo === 'M' && item.meta == id);
        // Agrupa os dados por mês e calcula a soma para cada mês
        const dadosAgrupados: DadosAgrupadosPorMes[] = [];
  
        dadosFiltrados.forEach(item => {
          const mes = new Date(item.data).toISOString().slice(0, 7); // Obtém o ano e o mês
          const indice = dadosAgrupados.findIndex(x => x.mes === mes);
  
          if (indice !== -1) {
            // Se o mês já existe, adiciona o valor ao total existente
            dadosAgrupados[indice].soma += item.valor;
          } else {
            // Se o mês não existe, cria um novo objeto de mês
            dadosAgrupados.push({ mes, soma: item.valor });
          }
        });
  
        return dadosAgrupados;
      })
    );
  }

  private adicionar( dado: MetasInterface)  {
    return this.httpClient.post(this.url, dado);
  }

  private atualizar( dado: MetasInterface) {
    return this.httpClient.put(`${this.url}/${dado.id}`, dado);
  }

  salvar( dado: MetasInterface ) {
    const valorMeta = dado.valor;
    const dataInicio = new Date(dado.data_inicial);
    const dataFinal = new Date(dado.data_final);
    const metaMensal = this.calcularValorMensal(valorMeta, dataInicio, dataFinal);
    dado.valor_mes = metaMensal;
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