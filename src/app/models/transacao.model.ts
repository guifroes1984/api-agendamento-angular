export interface Transacao {
    id: number;
    tipo: 'GANHO' | 'GASTO';
    categoria: string;
    valor: number;
    data: string;
    descricao?: string;
    usuarioId: number;
    usuarioNome: string;
}

export interface TransacaoRequest {
    tipo: 'GANHO' | 'GASTO';
    categoria: string;
    valor: number;
    data: string;
    descricao?: string;
}

export interface Resumofinanceiro {
    totalGanhos: number;
    totalGastos: number;
    lucroLiquido: number;
    quantidadeTransacoes: number;
}