import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { RestaurantDetailInfoComponent } from './restaurant-detail-info/restaurant-detail-info';
import { RestaurantDetailMainComponent } from './restaurant-detail-main/restaurant-detail-main';
import { RestaurantDetailVoucherComponent } from './restaurant-detail-voucher/restaurant-detail-voucher';

@NgModule({
  declarations: [
    RestaurantDetailMainComponent,
    RestaurantDetailInfoComponent,
    RestaurantDetailVoucherComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    RestaurantDetailMainComponent,
    RestaurantDetailInfoComponent,
    RestaurantDetailVoucherComponent,
  ]
})
export class RestaurantDetailComponentsModule { }
