
export interface LucroDespesaInterface {
  id?: number | null;
  descricao: string;
  data: Date;
  conta?: number | null;
  valor: number;
  icone: string;
  meta: number | null;
  tipo: 'D' | 'L' | 'M';
}

export interface Paginate {
  data: LucroDespesaInterface[] | null;
  lastPage: number | null;
  page: number | null;
  total: number | null;
}