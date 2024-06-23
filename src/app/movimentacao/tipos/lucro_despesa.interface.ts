
export interface LucroDespesaInterface {
  id?: any;
  descricao: string;
  data: Date;
  conta?: number | any;
  valor: number;
  icone: string;
  meta: number | any;
  tipo: 'D' | 'L' | 'M';
}

export interface Paginate {
  page: number;
  lastPage: number;
  data: any;
}
