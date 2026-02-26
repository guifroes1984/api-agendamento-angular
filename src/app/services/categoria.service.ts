import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) { }

  public buscarCategoriasGanho(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/ganhos`);
  }

  public buscarCategoriasGasto(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/gastos`);
  }

  public buscarMetodosPagamentos(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/pagamentos`);
  }

}
