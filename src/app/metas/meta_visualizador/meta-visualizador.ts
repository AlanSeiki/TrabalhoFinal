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
  porcentagemConcluida:number = 0;
  valorTotalN:number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private metasService: MetasService,
    private toastController: ToastController,
  ) {
    
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    var valor = 0;
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
        valor = dado.valor;
      });

      const valorTotal = this.metasService.getValor(parseInt(id));
      valorTotal.subscribe(
        (dados)=>{
          this.valorTotalN = dados;
          this.porcentagemConcluida = (dados*100)/valor;
        }
      )
      const observable = this.metasService.getMovimetnacao(parseInt(id));
      observable.subscribe(
        (dadosArray) => {
          if (Array.isArray(dadosArray) && dadosArray.length > 0) {
            // Mapeando os dados para o formato esperado pelo gráfico
            const data = dadosArray.map(dados => ({
              year: dados.mes,
              count: dados.soma
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
                        order: 2
                      },
                      {
                        type: 'line',
                        label: 'Valor Meta',
                        data: Array(data.length).fill(valorLinhaFixa),
                        borderColor: 'red', // Cor da linha
                        borderWidth: 2, // Largura da linha
                        fill: false, // Não preencher abaixo da linha
                        order: 1
                      }
                    ]
                  }
                }
              );
            } else {
              console.error('Elemento do gráfico não encontrado.');
            }
          } else {
            this.toastController
            .create({
              message: 'Não existem movimentações para está Meta',
              duration: 2000,
              keyboardClose: true,
              color: 'success',
            }).then((t) => t.present());
          }
        },
        // ...
      );
      
    }
  }

}
