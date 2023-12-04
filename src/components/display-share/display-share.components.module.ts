import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { NotificationComponent } from './notification/notification';
import { RestaurantCardComponent } from './restaurant-card/restaurant-card';
import { VoucherDetailFeedbackComponent } from './voucher-detail-feedback/voucher-detail-feedback';

@NgModule({
  declarations: [
    NotificationComponent,
    RestaurantCardComponent,
    VoucherDetailFeedbackComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    NotificationComponent,
    RestaurantCardComponent,
    VoucherDetailFeedbackComponent,
  ]
})
export class DisplayShareComponentsModule { }
