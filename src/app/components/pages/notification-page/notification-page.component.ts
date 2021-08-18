import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.scss']
})
export class NotificationPageComponent implements OnInit {

  notifications: any;
  loading: boolean;

  constructor(
    notificationsService: NotificationsService,
    alertService: AlertService
  ) {
    this.loading = true;
    notificationsService.getAll()
      .subscribe(notifications => {
        this.notifications = notifications;
        this.loading = false;

        notificationsService.countSubject$.next({ type: 'notif', count: 0 });
      }, () => {
        this.loading = false;

        alertService.error('Error');
      });
  }

  ngOnInit(): void {
  }

  text(notification) {
    let text;
    if ('intro_like' === notification.type) {
      text = 'has liked you. You are now matched!';
    } else if ('matched' === notification.type) {
      text = 'and you are now matched!';
    } else if ('view' === notification.type) {
      text = 'has viewed your profile.';
    }

    return text;
  }

}
