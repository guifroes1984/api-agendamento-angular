import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Resumofinanceiro, Transacao, TransacaoRequest } from '../models/transacao.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = `${environment.apiUrl}/transacoes`;

  constructor(private http: HttpClient) { }

  public listarTodas(): Observable<Transacao[]> {
    return this.http.get<Transacao[]>(this.apiUrl);
  }

  public buscarPorId(id: number): Observable<Transacao> {
    return this.http.get<Transacao>(`${this.apiUrl}/${id}`);
  }

  public ObterResumo(): Observable<Resumofinanceiro> {
    return this.http.get<Resumofinanceiro>(`${this.apiUrl}/resumo`);
  }

  public criar(transacao: TransacaoRequest): Observable<Transacao> {
    return this.http.post<Transacao>(this.apiUrl, transacao);
  }

  public atualizar(id: number, transacao: TransacaoRequest): Observable<Transacao> {
    return this.http.put<Transacao>(`${this.apiUrl}/${id}`, transacao);
  }

  public deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
