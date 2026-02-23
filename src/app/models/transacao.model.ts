export interface Transacao {
    id: number;
    tipo: 'GANHO' | 'GASTO';
    categoriaId: number;
    categoriaNome: string;
    valor: number;
    data: string;
    descricao?: string;
    litros?: number;
    paymentMethod?: string;
    usuarioId: number;
    usuarioNome: string;
}

export interface TransacaoRequest {
    tipo: 'GANHO' | 'GASTO';
    categoriaId: number;
    valor: number;
    data: string;
    descricao?: string;
    litros?: number;
    paymentMethod?: string;
}

export interface Resumofinanceiro {
    totalGanhos: number;
    totalGastos: number;
    lucroLiquido: number;
    quantidadeTransacoes: number;
}