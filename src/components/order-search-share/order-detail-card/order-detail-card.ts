import { CommonService } from '../../../providers/common/common.service';
import { Component, Input } from '@angular/core';
import { DataService } from '../../../providers/data-service/data.service';
import { ModalController } from 'ionic-angular';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'order-detail-card',
  templateUrl: 'order-detail-card.html'
})
export class OrderDetailCardComponent {

  @Input('menu') menu: any;
  @Input('orderCart') orderCart: any;

  // Controller
  needTranslate: boolean = false;

  constructor(
    public commonService: CommonService,
    public dataService: DataService,
    public modalCtrl: ModalController,
    public navCtrl: NavController) { }

  ngOnInit() {
    this.listenToTranslate();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private listenToTranslate() {
    this.dataService.currentTranslate.pipe(untilDestroyed(this)).subscribe(val => {
      this.needTranslate = val.needTranslate;
    });
  }

  presentRemark(item) {
    event.stopPropagation();
    const it = JSON.parse(JSON.stringify(item)); // To avoid overiding previous variable
    const uniqueCode = new Date().valueOf();
    if (it.details && it.details.needRemark) {
      const modal = this.modalCtrl.create('OrderDetailRemarkComponent', {
        type: 'Order',
        foodId: it._id,
        price: it.itemPrice,
        details: it.details,
        wholeItem: it,
        remarkShortCuts: this.menu.remarkShortCuts,
        orderCart: this.orderCart,
        uniqueCode: uniqueCode,
        needTakeAway: false,
        needTranslate: this.needTranslate
      });
      modal.present();
      modal.onDidDismiss(val => {
        if (val.isAdded) {
          this.commonService.presentToast(this.needTranslate ? '已添加进订单' : 'Item added to cart :)', 1500);
        }
      });
    } else {
      it['code'] = uniqueCode;
      it['quantity'] = 1;
      it['unitPrice'] = it.itemPrice;
      it['foodRemark'] = '';
      it['needTakeAway'] = false;
      this.orderCart.foodItemList.push(it);
      this.dataService.changeOrderCart({
        foodItemList: this.orderCart.foodItemList,
      });
      this.commonService.presentToast(this.needTranslate ? '已添加进订单' : 'Item added to cart :)', 1500);
    }
  }
}
