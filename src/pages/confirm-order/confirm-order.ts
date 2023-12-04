import lo_isEmpty from 'lodash/isEmpty';
import lo_remove from 'lodash/remove';
import { CommonService } from '../../providers/common/common.service';
import { Component } from '@angular/core';
import { DataService } from '../../providers/data-service/data.service';
import { IonicPage, NavController, NavParams, AlertController, Platform, IonicApp, App } from 'ionic-angular';
import { MenuService } from '../../providers/menu/menu.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { parse, format } from 'date-fns';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-confirm-order',
  templateUrl: 'confirm-order.html',
})
export class ConfirmOrderPage {

  // Params passed in
  menu: any;
  mainList: any;
  orderContent: any;

  // Model for input
  takeAwayModel: boolean = false;
  tableModel: string;
  collectTimeModel: string;

  // Datetime
  hourList: any;

  // Controller
  orderId: string;
  confirmClicked: boolean = false;
  needTranslate: boolean = false;

  // Tools
  backSub: any;

  constructor(
    public alertCtrl: AlertController,
    public commonService: CommonService,
    public dataService: DataService,
    public menuService: MenuService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public ionicApp: IonicApp,
    public app: App) { }

  ngOnInit() {
    this.menu = this.navParams.get('menu');
    this.mainList = this.navParams.get('orderCart');
    this.tableModel = this.menu.orderSettings.tableNo;
    this.combineDuplication();
    this.setUpOrderContent();
    this.listenToMenuChanges();
    this.listenToCartChanges();
    this.setUpHourList();
    this.registerBackButton();
    this.listenToTranslate();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    if (this.backSub) {
      this.backSub();
    }
  }

  private listenToTranslate() {
    this.dataService.currentTranslate.pipe(untilDestroyed(this)).subscribe(val => {
      this.needTranslate = val.needTranslate;
    });
  }

  emitResponse(ev) {
    this.orderId = ev.orderId;
    this.confirmClicked = ev.confirmClicked;
  }

  private combineDuplication() {
    this.mainList.foodItemList.map(val => {
      const filtered = this.mainList.foodItemList.filter(val2 => (val._id === val2._id && val.foodRemark === val2.foodRemark));
      if (filtered.length > 1) {
        val.quantity += filtered.length - 1;
        filtered.shift();
        filtered.map(val2 => lo_remove(this.mainList.foodItemList, n => n.code === val2.code));
      }
      return;
    });
    this.dataService.changeOrderCart({
      foodItemList: this.mainList.foodItemList,
    });
  }

  private setUpOrderContent() {
    this.orderContent = {
      foodItemList: this.mainList.foodItemList,
      remarkShortCuts: this.menu.remarkShortCuts,
      totalPrice: this.mainList.totalPrice
    };
  }

  private listenToMenuChanges() {
    this.dataService.currentMenu.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        this.menu = {
          categoryList: val.categoryList,
          remarkShortCuts: val.remarkShortCuts,
          menuSettings: val.menuSettings,
          orderSettings: val.orderSettings
        };
        if (this.menu.orderSettings.tableNo) {
          this.tableModel = this.menu.orderSettings.tableNo;
        }
      }
    });
  }

  private listenToCartChanges() {
    this.dataService.currentOrderCart.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        this.orderContent = {
          foodItemList: val.foodItemList,
          totalPrice: this.calculateTotalPrice(val.foodItemList),
          menuSettings: this.menu.menuSettings,
          remarkShortCuts: this.menu.remarkShortCuts,
        };
        if (val.foodItemList.length === 0) {
          this.back();
        }
        // Set up take away toggle value
        if (this.menu.orderSettings.isDineIn) {
          this.takeAwayModel = val.foodItemList.length === 0 ? false : val.foodItemList.every(val1 => val1.needTakeAway);
          this.menu.orderSettings['needTakeAway'] = this.takeAwayModel;
        }
      }
    });
  }

  private calculateTotalPrice(list) {
    const total = list.reduce((a, c) => a + (c.unitPrice * c.quantity), 0);
    return this.roundUpPrice(total);
  }

  private removeUserSetting() {
    // Empty food choosen
    this.dataService.changeOrderCart({
      foodItemList: []
    });
    // Reset menu settings
    this.menu.orderSettings['needTakeAway'] = false;
    this.menu.orderSettings['collectTime'] = undefined;
    this.updateMenu();
  }

  private cannotModifyText() {
    return this.needTranslate ? '无法在订单发送后更改信息' : `Order's details cannot be modified once sent :)`;
  }

  toggleTakeAway() {
    if (this.confirmClicked) {
      this.commonService.presentToast(this.cannotModifyText());
      return;
    }
    this.menu.orderSettings['needTakeAway'] = this.takeAwayModel;
    this.updateMenu();
  }

  presentTableNo() {
    if (this.confirmClicked) {
      this.commonService.presentToast(this.cannotModifyText());
      return;
    }
    this.alertCtrl.create({
      title: this.needTranslate ? '请输入桌子号码' : 'Please Insert Table No',
      subTitle: this.needTranslate ? '桌子号码在QR码的下方哟' : 'Table no is below the QR code',
      inputs: [
        {
          name: 'tableNo',
          placeholder: 'e.g. 21',
          value: this.tableModel,
          type: 'number',
          max: 5
        }],
      buttons: [
        {
          text: this.needTranslate ? '返回' : 'Back',
          role: 'cancel',
        },
        {
          text: this.needTranslate ? '确认' : 'Confirm',
          handler: data => {
            if (!data.tableNo) {
              return;
            }
            this.tableModel = data.tableNo;
            this.menu.orderSettings['tableNo'] = this.tableModel;
            this.menu.orderSettings['tableNoClicked'] = true;
            this.updateMenu();
          }
        }]
    }).present();
  }

  collectTimeChanged() {
    const beforeFormat = parse(`${this.collectTimeModel}`, 'HH:mm', new Date());
    const correctTime = format(beforeFormat, 'hh:mma');
    this.menu.orderSettings['collectTime'] = correctTime;
    this.updateMenu();
  }

  private setUpHourList() {
    if (this.menu.orderSettings.isDineIn) {
      return;
    }
    function hours12(hour) { return (hour + 24) % 12 || 12; }
    const currentHour = hours12(new Date().getHours());
    const hourList = [];
    for (let i = currentHour; i <= currentHour + 2; i++) {
      hourList.push(hours12(i));
    }
    this.hourList = hourList;
  }

  private registerBackButton() {
    if (this.platform.is('android') || this.platform.is('windows')) {
      this.backSub = this.platform.registerBackButtonAction(() => {
        const activeModal = this.ionicApp._modalPortal.getActive();
        if (activeModal && activeModal.isOverlay) {
          activeModal.dismiss();
          return;
        }
        this.back();
      }, 1);
    }
  }

  private updateMenu() {
    this.menu = this.menu; // To trigger confirm button Input()
    this.dataService.changeMenu({
      categoryList: this.menu.categoryList,
      remarkShortCuts: this.menu.remarkShortCuts,
      menuSettings: this.menu.menuSettings,
      orderSettings: this.menu.orderSettings
    });
  }

  private roundUpPrice(value) {
    return Math.round((value + 0.00001) * 100) / 100;
  }

  private checkIsOverlay() {
    const nav = this.app._appRoot._getActivePortal() || this.app.getActiveNavs()[0];
    const activeView = nav.getActive();
    return (activeView.isOverlay);
  }

  back() {
    if (!this.confirmClicked) {
      this.navCtrl.pop();
      return;
    }
    if (this.checkIsOverlay()) {
      return;
    }
    const alert = this.alertCtrl.create({
      title: this.needTranslate ? '确定取消订单?' : 'Stop waiting for response?',
      subTitle: this.needTranslate ? '若离开此页面，订单将被取消' : 'By leaving this page, the order will be considered as <b>cancelled</b>',
      buttons: [
        {
          text: this.needTranslate ? '返回' : 'Back',
          role: 'cancel',
        },
        {
          text: this.needTranslate ? '确认' : 'Confirm',
          handler: data => {
            this.cancelOrder();
          }
        }
      ]
    });
    alert.present();
  }

  private cancelOrder() {
    const object = {
      orderId: this.orderId,
      status: 'UC',
      restaurantId: this.menu.orderSettings.restaurantId
    };
    this.menuService.checkOrderStatus(object.orderId, object.status).pipe(untilDestroyed(this)).subscribe(val => {
      this.menuService.changeOrderStatus(object).pipe(untilDestroyed(this)).subscribe(val2 => {
        this.removeUserSetting();
        this.confirmClicked = false;
        this.commonService.presentToast(this.needTranslate ? '订单已取消' : 'Order cancelled');
        this.navCtrl.pop();
      });
    }, error => {
      this.alertCtrl.create({
        title: this.needTranslate ? '订单状态已更新' : 'Order status has been updated',
        subTitle: error.error.message,
        enableBackdropDismiss: false,
        buttons: [
          {
            text: this.needTranslate ? '知道了' : 'Got It',
            handler: () => {
              if (error.error.canPop) {
                this.navCtrl.pop();
              }
            }
          }]
      }).present();
    });
  }
}
