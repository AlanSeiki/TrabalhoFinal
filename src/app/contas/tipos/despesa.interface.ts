
export interface DespesaInterface {
  id?: number | null;
  descricao: string;
  data: Date;
  banco?: number | null;
  conta?: number | null;
  valor: number;
  parcelas?: number | null;
  icone: string;
  tipo: 'D';
}