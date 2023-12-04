import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../providers/user/user.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-history-order-detail',
  templateUrl: 'history-order-detail.html',
})
export class HistoryOrderDetailPage {

  type: string;
  title: any;

  // Parameter pass to components
  itemContent: any;
  menu: any;
  responseDetails: any;
  orderContent: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService) { }

  ngOnInit() {
    this.title = this.navParams.get('title');
    this.type = this.navParams.get('type');
    const orderId = this.navParams.get('orderId');
    this.setUpOrderDetails(orderId);
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpOrderDetails(orderId) {
    if (this.type === 'tempOrders') {
      this.userService.getTempOrderDetails(orderId).pipe(untilDestroyed(this)).subscribe(val => {
        this.menu = this.navParams.get('menu');
        this.processList(val);
      });
    } else {
      this.userService.getOrderDetails(orderId).pipe(untilDestroyed(this)).subscribe(val => {
        if (val) {
          this.menu = {
            td: val.menuSettings.totalDetails
          };
        }
        this.processList(val);
      });
    }
  }

  private processList(val) {
    if (val) {
      // For history order main
      this.itemContent = val;
      this.responseDetails = val.responseDetails;
      // For history order button
      this.orderContent = {};
      this.orderContent['itemContent'] = val;
    }
  }

  back() {
    this.navCtrl.pop();
  }
}
