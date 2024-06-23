
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
  page: number;
  lastPage: number;
  data: any;
}
