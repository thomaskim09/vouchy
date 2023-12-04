import { CommonService } from '../../../providers/common/common.service';
import { Component, Input } from '@angular/core';
import { DataService } from '../../../providers/data-service/data.service';
import { ModalController } from 'ionic-angular';
import { untilDestroyed } from 'ngx-take-until-destroy';
import lo_remove from 'lodash/remove';

@Component({
  selector: 'confirm-order-card',
  templateUrl: 'confirm-order-card.html'
})
export class ConfirmOrderCardComponent {

  @Input('menu') menu: any;
  @Input('orderContent') orderContent: any;
  @Input('confirmClicked') confirmClicked: boolean;

  // Controller
  needTranslate: boolean = false;

  // Cleaner code
  menuSet: any;
  orderSet: any;

  // toggle properties
  firstEnter: boolean = true;
  toggleClicked: boolean = false;
  quantityClicked: boolean = false;

  constructor(
    public commonService: CommonService,
    public dataService: DataService,
    public modalCtrl: ModalController) { }

  ngOnInit() {
    this.listenToTranslate();
  }

  ngOnChanges() {
    this.menuSet = this.menu.menuSettings;
    this.orderSet = this.menu.orderSettings;
    this.changeAllTakeAway(this.menu.orderSettings.needTakeAway);
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private listenToTranslate() {
    this.dataService.currentTranslate.pipe(untilDestroyed(this)).subscribe(val => {
      this.needTranslate = val.needTranslate;
    });
  }

  private changeAllTakeAway(needTakeAway) {
    if (this.firstEnter) {
      this.firstEnter = false;
      return;
    }
    if (this.toggleClicked) {
      this.toggleClicked = false;
      return;
    }
    if (this.quantityClicked) {
      this.quantityClicked = false;
      return;
    }
    if (this.menu.orderSettings.tableNoClicked) {
      this.menu.orderSettings.tableNoClicked = false;
      return;
    }
    if (this.confirmClicked) {
      return;
    }
    const list = this.orderContent.foodItemList;
    this.orderContent.foodItemList = list.map(val => {
      if (!needTakeAway && val.needTakeAway) {
        val.foodRemarkTranslated = val.foodRemarkTranslated.substr(4);
        val.foodRemark = val.foodRemark.substr(11);
      } else if ((needTakeAway && !val.needTakeAway)) {
        val.foodRemarkTranslated = val.foodRemarkTranslated ? '打包, ' + val.foodRemarkTranslated : '打包, ';
        val.foodRemark = val.foodRemark ? 'Take Away, ' + val.foodRemark : 'Take Away, ';
      }
      val.needTakeAway = needTakeAway;
      return val;
    });
  }

  private cannotModifyText() {
    return this.needTranslate ? '无法在订单发送后更改信息' : `Order's details cannot be modified once sent :)`;
  }

  toggleTakeAway(i, value) {
    if (this.confirmClicked) {
      this.commonService.presentToast(this.cannotModifyText());
      return;
    }
    this.orderContent.foodItemList[i].needTakeAway = value;
    const list = this.orderContent.foodItemList[i];
    if (value) {
      list.foodRemarkTranslated = list.foodRemarkTranslated ? '打包, ' + list.foodRemarkTranslated : '打包, ';
      list.foodRemark = list.foodRemark ? 'Take Away, ' + list.foodRemark : 'Take Away, ';
    } else {
      list.foodRemarkTranslated = list.foodRemarkTranslated.substr(4);
      list.foodRemark = list.foodRemark.substr(11);
    }
    this.orderContent.foodItemList[i] = list;
    this.toggleClicked = true;
    this.updateOrderCart();
  }

  presentRemark(item) {
    if (this.confirmClicked) {
      this.commonService.presentToast(this.cannotModifyText());
      return;
    }
    const it = item;
    if (it.details && it.details.needRemark) {
      const orderCart = {
        foodItemList: this.orderContent.foodItemList,
        totalPrice: this.orderContent.totalPrice
      };
      const modal = this.modalCtrl.create('OrderDetailRemarkComponent', {
        type: 'Confirm',
        foodId: it._id,
        price: it.itemPrice,
        details: it.details,
        wholeItem: it,
        remarkShortCuts: this.orderContent.remarkShortCuts,
        orderCart: orderCart,
        uniqueCode: it.code,
        quantity: it.quantity,
        needTakeAway: it.needTakeAway,
        needTranslate: this.needTranslate
      });
      modal.present();
    }
  }

  addQuantity(i) {
    event.stopPropagation();
    if (this.confirmClicked) {
      this.commonService.presentToast(this.cannotModifyText());
      return;
    }
    this.quantityClicked = true;
    const item = this.orderContent.foodItemList[i];
    this.orderContent.totalPrice += item.itemPrice;
    item.quantity++;
    this.updateOrderCart();
  }

  subtractQuantity(i) {
    event.stopPropagation();
    if (this.confirmClicked) {
      this.commonService.presentToast(this.cannotModifyText());
      return;
    }
    this.quantityClicked = true;
    const item = this.orderContent.foodItemList[i];
    if (item.quantity > 1) {
      this.orderContent.totalPrice -= item.itemPrice;
      item.quantity--;
      this.updateOrderCart();
    } else if (item.quantity === 1) {
      this.orderContent.totalPrice -= item.itemPrice;
      item.quantity--;
      lo_remove(this.orderContent.foodItemList, n => n.code === item.code);
      this.updateOrderCart();
    }
  }

  private updateOrderCart() {
    this.dataService.changeOrderCart({
      foodItemList: this.orderContent.foodItemList,
      totalPrice: this.orderContent.totalPrice
    });
  }
}
