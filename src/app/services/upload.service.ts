import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comprovante } from '../models/comprovate.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private apiUrl = `${environment.apiUrl}/comprovantes`;

  constructor(private http: HttpClient) { }

  public uploadComprovante(transacaoId: number, arquivo: File): Observable<Comprovante> {
    const formData = new FormData();
    formData.append('file', arquivo, arquivo.name);

    return this.http.post<Comprovante>(`${this.apiUrl}/upload/${transacaoId}`, formData);
  }

  public buscarPorTransacaoId(transacaoId: number): Observable<Comprovante[]> {
    return this.http.get<Comprovante[]>(`${this.apiUrl}/transacao/${transacaoId}`);
  }

  public deletarComprovante(transacaoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/transacao/${transacaoId}`);
  }

}
