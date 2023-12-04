import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'order-button',
  templateUrl: 'order-button.html'
})
export class OrderButtonComponent {

  @Input('menu') menu: any;
  @Input('orderCart') orderCart: any;

  // Controller
  needSpinner: boolean = false;

  constructor(public navCtrl: NavController) { }

  getTotalLength(list) {
    return list.reduce((a, c) => a += c.quantity, 0);
  }

  navigateToConfirmOrder() {
    this.needSpinner = true;
    this.navCtrl.parent.parent.push('ConfirmOrderPage', {
      menu: this.menu,
      orderCart: this.orderCart
    });
    this.needSpinner = false;
  }

}
