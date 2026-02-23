export interface Categoria {
    id: number;
    nome: string;
    tipo: 'GANHO' | 'GASTO' | 'PAGAMENTO';
}

export interface CategoriasResponse {
    earningCategories: Categoria[];
    expenseCategories: Categoria[];
    paymentMethods: Categoria[];
}