import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { OrderSearchShareComponentsModule } from '../../components/order-search-share/order-search-share.components.module';
import { SearchItemPage } from './search-item';

@NgModule({
  declarations: [
    SearchItemPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchItemPage),
    OrderSearchShareComponentsModule
  ],
})
export class SearchItemPageModule { }
