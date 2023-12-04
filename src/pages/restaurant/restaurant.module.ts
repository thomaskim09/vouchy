import { DisplayShareComponentsModule } from '../../components/display-share/display-share.components.module';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { RestaurantDetailComponentsModule } from '../../components/restaurant-detail/restaurant-detail.components.module';
import { RestaurantPage } from './restaurant';
import { VoucherDetailComponentsModule } from '../../components/voucher-detail/voucher-detail.components.module';

@NgModule({
  declarations: [
    RestaurantPage
  ],
  imports: [
    DisplayShareComponentsModule,
    IonicPageModule.forChild(RestaurantPage),
    RestaurantDetailComponentsModule,
    VoucherDetailComponentsModule,
  ],
})
export class RestaurantPageModule { }
