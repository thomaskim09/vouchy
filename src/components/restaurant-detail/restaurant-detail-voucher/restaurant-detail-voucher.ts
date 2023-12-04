import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'restaurant-detail-voucher',
  templateUrl: 'restaurant-detail-voucher.html'
})
export class RestaurantDetailVoucherComponent {

  @Input('restaurantDetailVouchers') resvou: any;
  @Input('restaurantInfo') restaurantInfo: any;

  // Controller
  itemOpened: boolean = false;
  needSpinner: boolean = false;

  // skeleton
  skeletonArray: any[] = new Array(3);

  constructor(public navCtrl: NavController) { }

  checkStatus(status) {
    switch (status) {
      case 'OP': return 'Get';
      case 'WG': return 'View';
    }
  }

  checkIfLine(index, length) {
    return (index + 1 === length && length <= 3) ? false : true;
  }

  goToVoucher(selectedIndex) {
    this.needSpinner = true;
    event.stopPropagation();
    this.navCtrl.push('VoucherPage', {
      restaurantId: this.restaurantInfo.restaurantId,
      restaurantName: this.restaurantInfo.restaurantName,
      selectedIndex: selectedIndex
    });
    this.needSpinner = false;
  }

  toggleSection() {
    this.itemOpened = !this.itemOpened;
  }

}
