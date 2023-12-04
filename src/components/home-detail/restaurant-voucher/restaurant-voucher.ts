import { Component, Input } from '@angular/core';
import { DataService } from '../../../providers/data-service/data.service';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { TagService } from '../../../providers/tag/tag.service';

@Component({
  selector: 'restaurant-voucher',
  templateUrl: 'restaurant-voucher.html'
})
export class RestaurantVoucherComponent {

  @Input('restaurantVouchers') input: any;

  // skeleton
  skeletonArray: any[] = new Array(6);
  skeletonChildrenArray: any[] = new Array(1);

  constructor(
    public dataService: DataService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public tagService: TagService) { }

  toggleSection(i) {
    this.input[i].toggleStatus = !this.input[i].toggleStatus;
  }

  selectRestaurant(restaurantId) {
    this.navCtrl.parent.parent.push('RestaurantPage', {
      restaurantId: restaurantId,
    });
  }

  selectVoucher(restaurantId, restaurantName, selectedIndex) {
    this.navCtrl.parent.parent.push('VoucherPage', {
      restaurantId: restaurantId,
      restaurantName: restaurantName,
      selectedIndex: selectedIndex
    });
  }
}
