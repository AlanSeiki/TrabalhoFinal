
export interface LucroDespesaInterface {
  id?: number | null;
  descricao: string;
  data: Date;
  banco?: number | null;
  conta?: number | null;
  valor: number;
  icone: string;
  meta: number | null;
  tipo: 'D' | 'L' | 'M';
}