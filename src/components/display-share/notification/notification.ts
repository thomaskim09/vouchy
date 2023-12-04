import { Component, Input } from '@angular/core';
import { UserService } from '../../../providers/user/user.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'notification',
  templateUrl: 'notification.html'
})
export class NotificationComponent {

  @Input('notifications') notifications: any;
  @Input('hasNotifications') hasNotifications: boolean;

  isRead: boolean = false;
  counter: number = 0;
  timer: any;

  constructor(public userService: UserService) { }

  ngOnChanges() {
    this.readNotifications();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
  }

  private readNotifications() {
    if (this.notifications && this.notifications.length > 0 && this.hasNotifications) {
      this.userService.readNotifications('F').pipe(untilDestroyed(this)).subscribe(val => { });
    }
  }
}
