import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notification: Notification | null = null;
  show = false;
  private subscription!: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notification$.subscribe(
      notification => {
        this.notification = notification;
        this.show = !!notification;
      }
    );
  }

  close(): void {
    this.show = false;
    this.notificationService.clear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getIcon(): string {
    switch (this.notification?.type) {
      case 'success': return 'bi-check-circle-fill';
      case 'error': return 'bi-exclamation-circle-fill';
      case 'info': return 'bi-info-circle-fill';
      default: return 'bi-bell-fill';
    }
  }

  getColors(): string {
    switch (this.notification?.type) {
      case 'success': return 'bg-green-50 border-green-500 text-green-700';
      case 'error': return 'bg-red-50 border-red-500 text-red-700';
      case 'info': return 'bg-blue-50 border-blue-500 text-blue-700';
      default: return 'bg-gray-50 border-gray-500 text-gray-700';
    }
  }
}
