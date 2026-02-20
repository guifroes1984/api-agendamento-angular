import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification | null>();
  notification$ = this.notificationSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000): void {
    this.notificationSubject.next({ message, type, duration });
    
    // Auto-fechar após a duração
    setTimeout(() => {
      this.notificationSubject.next(null);
    }, duration);
  }

  showSuccess(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  showError(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  showInfo(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  clear(): void {
    this.notificationSubject.next(null);
  }
}
