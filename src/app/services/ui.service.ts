import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private openTransactionFormSubject = new Subject<void>();
  openTransactionForm$ = this.openTransactionFormSubject.asObservable();

  openTransactionForm(): void {
    this.openTransactionFormSubject.next();
  }
}
