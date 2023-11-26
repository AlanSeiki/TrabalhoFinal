export interface ContasInterface {
    id?: number | null;
    descricao: string;
    data: Date;
    valor: number;
    parcelas?: number | null;
    icone: string;
  }