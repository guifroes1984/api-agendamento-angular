export interface Comprovante {
    id: number;
    nomeOriginal: string;
    nomeArquivo: string;
    tipoArquivo: string;
    tamanho: number;
    caminho: string;
    dataUpload: string;
    transacaoId: number;
    transacaoDescricao: string;
}