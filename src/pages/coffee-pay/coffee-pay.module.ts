import { CoffeePayPage } from './coffee-pay';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    CoffeePayPage,
  ],
  imports: [
    IonicPageModule.forChild(CoffeePayPage),
  ],
})
export class CoffeePayPageModule { }
