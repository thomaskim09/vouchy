import { HomeDetailSlideComponent } from './home-detail-slide/home-detail-slide';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { RestaurantVoucherComponent } from './restaurant-voucher/restaurant-voucher';

@NgModule({
  declarations: [
    HomeDetailSlideComponent,
    RestaurantVoucherComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    HomeDetailSlideComponent,
    RestaurantVoucherComponent,
  ]
})
export class HomeDetailComponentsModule { }
