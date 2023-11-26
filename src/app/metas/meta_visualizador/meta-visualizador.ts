import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { MetasService } from '../service/metas.service';
import Chart from "chart.js/auto";
import { format } from 'date-fns';

@Component({
  selector: 'app-meta-visualizador',
  templateUrl: './meta-visualizador.html',
  styleUrls: ['./meta-visualizador.scss'],
})
export class MetasVisualizadorCadastroComponent implements OnInit {
  id?: string;
  descricao?: string;
  valor_mes?: number;
  valor?: number;
  data_inicial?: Date;
  data_final?: Date;
  ativo?: boolean;
  icone?: string;  
  private grafico?: Chart;
  dados: any = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private metasService: MetasService,
    private toastController: ToastController
  ) {
    
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    
    if (id) {
      let ids = parseInt(id);
      this.metasService.getDado(ids).subscribe((dado) => {
        this.id = dado.id;
        this.descricao = dado.descricao;
        this.valor_mes = dado.valor_mes;
        this.valor = dado.valor;
        this.data_inicial = dado.data_inicial;
        this.data_final = dado.data_final;
        this.ativo = dado.ativo;
        this.icone = dado.icone;
      });
      const observable = this.metasService.getMovimetnacao(parseInt(id));
      observable.subscribe(
        (dadosArray) => {
          if (Array.isArray(dadosArray) && dadosArray.length > 0) {
            // Mapeando os dados para o formato esperado pelo gráfico
            const data = dadosArray.map(dados => ({
              year: format(new Date(dados.data), 'dd/MM/yyyy'),
              count: dados.valor
            }));
      
            const valorLinhaFixa = this.valor_mes; // Valor fixo para a linha
      
            const ctx = document.getElementById('myChart');
      
            if (ctx instanceof HTMLCanvasElement) {
              this.grafico = new Chart(
                ctx,
                {
                  type: 'bar',
                  data: {
                    labels: data.map(row => row.year),
                    datasets: [
                      {
                        label: 'Valor adicionado a Meta',
                        data: data.map(row => row.count),
                        backgroundColor: 'azure', // Cor das barras
                      },
                      {
                        type: 'line',
                        label: 'Linha Fixa',
                        data: Array(data.length).fill(valorLinhaFixa),
                        borderColor: 'red', // Cor da linha
                        borderWidth: 2, // Largura da linha
                        fill: true // Não preencher abaixo da linha
                      }
                    ]
                  }
                }
              );
            } else {
              console.error('Elemento do gráfico não encontrado.');
            }
          } else {
            console.error('Dados não são um array válido ou estão vazios.');
          }
        },
        // ...
      );
      
    }
  }

}
