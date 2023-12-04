import { AuthenticationService } from '../../../providers/authentication/authentication.service';
import { CommonService } from '../../../providers/common/common.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MenuService } from '../../../providers/menu/menu.service';
import { ModalController, NavController, IonicApp, AlertController, App } from 'ionic-angular';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { DataService } from './../../../providers/data-service/data.service';
import { Vibration } from '@ionic-native/vibration';
import { SoundService } from '../../../providers/data-service/sound.service';
import { parse, isAfter } from 'date-fns';
import lo_isEmpty from 'lodash/isEmpty';
declare const ClientJS: any;
import 'clientjs';

@Component({
  selector: 'confirm-order-button',
  templateUrl: 'confirm-order-button.html'
})
export class ConfirmOrderButtonComponent {

  @Input('menu') menu: any;
  @Input('orderContent') orderContent: any;

  // Output to orderDetails
  @Output() response = new EventEmitter<any>();

  // Cleaner code
  menuSet: any;
  orderSet: any;

  // HTML properties
  takeAwayCounter: number = 0;
  totalPrice: any;
  subTotal: any;
  taxCharge: any;
  serviceCharge: any;
  packagingFee: any;
  rounding: any;

  // Controller
  itemOpened: boolean = false;
  confirmClicked: boolean = false;
  canConfirm: boolean = true;
  orderId: string;
  status: string;
  needSpinner: boolean = false;
  needTranslate: boolean = false;

  // Parameters
  finalOrder: any;
  fingerprint: any;

  constructor(
    public authenticationService: AuthenticationService,
    public commonService: CommonService,
    public menuService: MenuService,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public dataService: DataService,
    public ionicApp: IonicApp,
    public vibration: Vibration,
    public soundService: SoundService,
    public alertCtrl: AlertController,
    public app: App) { }

  ngOnInit() {
    const client = new ClientJS();
    this.fingerprint = client.getFingerprint();
    this.listenNotification();
    this.listenToTranslate();
  }

  ngOnChanges() {
    this.menuSet = this.menu.menuSettings;
    this.orderSet = this.menu.orderSettings;
    this.setUpConfirmDetails();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private emitResponse(content) {
    this.response.emit(content);
  }

  private setUpConfirmDetails() {
    // Cleaner code
    const menuSet = this.menuSet.td;
    const orderSet = this.orderSet;
    const orderCon = this.orderContent;
    // Initiate
    let subTotal;
    let taxCharge;
    let serviceCharge;
    let packagingFee;
    let totalPrice;
    let totalPriceText;
    let rounding;
    // Calculate subtotal
    subTotal = orderCon.totalPrice;
    // Calculate packagingFee
    if (menuSet.hasTakeAway && menuSet.hasTakeAwayFee) {
      this.takeAwayCounter = 0;
      packagingFee = 0;
      if (menuSet.hasTakeAwayPerPackage) {
        orderCon.foodItemList.map(val => {
          if (val.needTakeAway || !orderSet.isDineIn || orderSet.needTakeAway) {
            this.takeAwayCounter += val.quantity;
          }
        });
        packagingFee = this.takeAwayCounter * menuSet.takeAwayFee;
      } else {
        packagingFee = menuSet.takeAwayFee;
      }
    }
    // Calculate taxCharge
    if (menuSet.hasTax) {
      taxCharge = this.roundUpPrice((subTotal + this.zero(packagingFee)) * (menuSet.taxPercentage / 100));
    }
    // Calculate serviceCharge
    if (menuSet.hasServiceCharge) {
      serviceCharge = this.roundUpPrice((subTotal + this.zero(packagingFee)) * (menuSet.serviceChargePercentage / 100));
    }
    // Calculate rounding and totalPrice
    totalPrice = this.roundUpPrice(this.zero(subTotal) + this.zero(packagingFee) + this.zero(taxCharge) + this.zero(serviceCharge));
    totalPriceText = (totalPrice).toFixed(2);
    rounding = this.getRoundingAdjustment(totalPriceText);
    if (rounding.value === '0') {
      totalPrice = parseFloat(totalPriceText);
    } else if (rounding.type === '+') {
      totalPrice += parseFloat(rounding.value);
    } else if (rounding.type === '-') {
      totalPrice -= parseFloat(rounding.value);
    }
    // Display to HTML
    this.subTotal = subTotal.toFixed(2);
    this.taxCharge = menuSet.hasTax ? taxCharge.toFixed(2) : undefined;
    this.serviceCharge = menuSet.hasServiceCharge ? serviceCharge.toFixed(2) : undefined;
    this.packagingFee = (menuSet.hasTakeAway && menuSet.hasTakeAwayFee) ? packagingFee.toFixed(2) : undefined;
    this.rounding = rounding;
    this.totalPrice = totalPrice.toFixed(2);
    // Check if collection time provided
    this.canConfirm = (!orderSet.isDineIn) ? this.hasValue(orderSet.collectTime) : this.hasValue(orderSet.tableNo);
  }

  private hasValue(value) {
    return value ? true : false;
  }

  private listenToTranslate() {
    this.dataService.currentTranslate.pipe(untilDestroyed(this)).subscribe(val => {
      this.needTranslate = val.needTranslate;
    });
  }

  toggleList() {
    this.itemOpened = !this.itemOpened;
  }

  confirmOrder() {
    if (!this.orderSet.isDineIn && !this.orderSet.collectTime) {
      this.commonService.presentToast(this.needTranslate ? '请选择拿餐时间点 :)' : 'Please pick a collect time :)');
      return;
    }
    if (!this.orderSet.isDineIn && !this.withinCorrentTime()) {
      this.commonService.presentToast(this.needTranslate ? '请输入正确拿餐时间点 :)' : 'Please insert the correct collect time :)');
      return;
    }
    if (this.orderSet.isDineIn && !this.orderSet.tableNo) {
      this.presentTableNo();
      return;
    }
    if (this.orderSet.isDineIn && !this.withinTableNoRange()) {
      this.commonService.presentToast(this.needTranslate ? '请输入正确桌子号码 :)' : 'Please insert the correct table no :)');
      this.orderSet.tableNo = undefined;
      this.menu.orderSettings['tableNo'] = undefined;
      this.updateMenu();
      this.presentTableNo();
      return;
    }
    if (this.authenticationService.checkLoginStatus()) {
      this.needSpinner = true;
      const currentUser = this.authenticationService.currentUserValue;
      const orderDetails = this.orderContent.foodItemList.map(val => ({
        itemName: val.itemName,
        itemShortName: val.itemShortName,
        itemCode: val.itemCode,
        itemPrice: val.itemPrice,
        quantity: val.quantity,
        remarkObject: val.remarkObject,
        extraRemark: val.extraRemark,
        needTakeAway: val.needTakeAway
      }));
      const billDetails = {
        userToken: currentUser.deviceToken,
        username: currentUser.username,
        contact: currentUser.contact,
        isDineIn: this.orderSet.isDineIn,
        needTakeAway: this.orderSet.needTakeAway,
        tableNo: this.orderSet.tableNo,
        collectTime: this.removeTimeZero(this.orderSet.collectTime),
        subTotal: this.floatZero(this.subTotal),
        taxCharge: this.floatZero(this.taxCharge),
        serviceCharge: this.floatZero(this.serviceCharge),
        packagingFee: this.floatZero(this.packagingFee),
        roundingType: this.rounding.type,
        roundingAdjustment: this.floatZero(this.rounding.value),
        totalPrice: this.floatZero(this.totalPrice),
      };
      this.finalOrder = {
        userId: currentUser._id,
        fingerprint: this.fingerprint,
        restaurantId: this.orderSet.restaurantId,
        orderDetails: orderDetails,
        billDetails: billDetails
      };
      if (!this.menuSet.sd.hasTableNoLock) {
        this.sendOrder();
      } else {
        // Check table status before sending order
        this.menuService.checkTableStatus(this.fingerprint, this.orderSet.restaurantId, this.orderSet.tableNo).pipe(untilDestroyed(this)).subscribe(val => {
          this.sendOrder();
        }, err => {
          this.needSpinner = false;
          this.alertCtrl.create({
            title: this.needTranslate ? '桌号已绑定' : 'Table locked',
            subTitle: this.needTranslate ? '这桌子订单还未完成，请使用<b>之前点餐的手机</b>或者<b>通知柜台服务生</b>' : `This table's order is not complete yet. Please use your <b>previous phone</b> to order or send a <b>table unlock request</b> :)`,
            buttons: [
              {
                text: this.needTranslate ? '返回' : 'Back',
                role: 'cancel',
              },
              {
                text: this.needTranslate ? '发送通知' : 'Send Request',
                handler: data => {
                  const content = {
                    fingerprint: this.fingerprint,
                    receiverId: this.orderSet.restaurantId,
                    title: `Table ${this.orderSet.tableNo}`,
                    body: `Need table unlocking`
                  };
                  this.menuService.needService(content).pipe(untilDestroyed(this)).subscribe(val => {
                    this.commonService.presentToast(this.needTranslate ? '发送通知中...请稍等再试' : 'Table unlock request sent, please try again later');
                  });
                }
              }
            ]
          }).present();
        });
      }
    } else {
      const activePage = this.navCtrl.getActive().instance;
      this.navCtrl.push('LoginPage', { view: activePage });
    }
  }

  private checkIsOverlay() {
    const nav = this.app._appRoot._getActivePortal() || this.app.getActiveNavs()[0];
    const activeView = nav.getActive();
    return (activeView.isOverlay);
  }

  private presentTableNo() {
    if (this.checkIsOverlay()) {
      return;
    }
    this.alertCtrl.create({
      title: this.needTranslate ? '请输入桌子号码' : 'Please Insert Table No',
      subTitle: this.needTranslate ? '桌子号码在QR码的下方哟' : 'Table no is below the QR code',
      inputs: [
        {
          name: 'tableNo',
          placeholder: 'e.g. 21',
          value: this.orderSet.tableNo,
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
            this.orderSet.tableNo = data.tableNo;
            this.menu.orderSettings['tableNo'] = data.tableNo;
            this.menu.orderSettings['tableNoClicked'] = true;
            this.updateMenu();
            this.confirmOrder();
          }
        }]
    }).present();
  }

  private sendOrder() {
    this.menuService.sendOrderInfo(this.finalOrder).pipe(untilDestroyed(this)).subscribe(val => {
      this.needSpinner = false;
      this.confirmClicked = true;
      this.orderId = val.orderId;
      this.status = val.status;
      this.emitResponse({
        orderId: val.orderId,
        confirmClicked: true,
        canPop: false
      });
      this.presentModal(this.orderId, this.status);
    });
  }

  private withinCorrentTime() {
    if (this.orderSet.collectTime) {
      const time = parse(this.orderSet.collectTime, 'hh:mma', new Date());
      return isAfter(time, new Date());
    }
    return false;
  }

  private withinTableNoRange() {
    if (!this.menuSet.sd.hasTableNoRange) {
      return true;
    }
    const maxTableNo = Number(this.menuSet.sd.tableNoRange);
    const tableNo = Number(this.orderSet.tableNo);
    if (tableNo < 1 || tableNo > maxTableNo) {
      return false;
    } else {
      return true;
    }
  }

  private removeTimeZero(value) {
    if (!value) {
      return;
    }
    let result = value;
    if (result.charAt(0) === '0') {
      result = result.substr(1);
    }
    return result;
  }

  private getRoundingAdjustment(price) {
    const last = price.slice(-1);
    switch (last) {
      case '1': return { value: '0.01', type: '-' };
      case '2': return { value: '0.02', type: '-' };
      case '3': return { value: '0.02', type: '+' };
      case '4': return { value: '0.01', type: '+' };
      case '5': return { value: '0', type: '' };
      case '6': return { value: '0.01', type: '-' };
      case '7': return { value: '0.02', type: '-' };
      case '8': return { value: '0.02', type: '+' };
      case '9': return { value: '0.01', type: '+' };
      case '0': return { value: '0', type: '' };
    }
  }

  private zero(value) {
    return value || 0;
  }

  private floatZero(value) {
    return value ? parseFloat(value) : undefined;
  }

  private roundUpPrice(value) {
    return Math.round((value + 0.00001) * 100) / 100;
  }

  recheckStatus(id) {
    this.needSpinner = true;
    this.menuService.getTempOrderStatus(id).pipe(untilDestroyed(this)).subscribe(val => {
      this.presentModal(id, val.status, val);
      this.needSpinner = false;
    });
  }

  private presentModal(id, status, content?) {
    const modal = this.modalCtrl.create('ConfirmOrderPopOverPage', {
      orderId: id,
      status: status,
      menu: this.menu,
      finalOrder: this.finalOrder,
      content: content,
      needTranslate: this.needTranslate
    });
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.emitResponse({
          orderId: id,
          confirmClicked: data.confirmClicked
        });
        if (data.navigateToMenu) {
          this.removeUserSetting();
          this.dataService.changeOrderCart({
            foodItemList: []
          });
        }
        if (data.status) {
          this.status = data.status;
        }
      }
    });
  }

  private removeUserSetting() {
    this.menu.orderSettings['needTakeAway'] = false;
    this.menu.orderSettings['collectTime'] = undefined;
    this.updateMenu();
  }

  private updateMenu() {
    this.dataService.changeMenu({
      categoryList: this.menu.categoryList,
      remarkShortCuts: this.menu.remarkShortCuts,
      menuSettings: this.menu.menuSettings,
      orderSettings: this.menu.orderSettings
    });
  }

  private listenNotification() {
    this.dataService.currentFcmMessage.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        const activeModal = this.ionicApp._modalPortal.getActive();
        if (!activeModal.isOverlay && this.confirmClicked && val.msg.content.orderId === this.orderId) {
          this.presentModal(val.msg.content.orderId, val.msg.content.status, val.msg.content);
          this.soundService.playSound();
          this.vibration.vibrate([100, 100, 100]);
        }
      }
    });
  }

  cancelOrder() {
    this.alertCtrl.create({
      title: this.needTranslate ? '确定取消订单?' : 'Stop waiting for response?',
      subTitle: this.needTranslate ? '订单将被取消' : 'The order will be <b>cancelled</b>',
      buttons: [
        {
          text: this.needTranslate ? '返回' : 'Back',
          role: 'cancel',
        },
        {
          text: this.needTranslate ? '确认' : 'Confirm',
          handler: data => {
            this.changeStatus();
          }
        }
      ]
    }).present();
  }

  private changeStatus() {
    const object = {
      orderId: this.orderId,
      status: 'UC',
      restaurantId: this.menu.orderSettings.restaurantId
    };
    this.needSpinner = true;
    this.menuService.checkOrderStatus(object.orderId, object.status).pipe(untilDestroyed(this)).subscribe(val => {
      this.menuService.changeOrderStatus(object).pipe(untilDestroyed(this)).subscribe(val2 => {
        this.needSpinner = false;
        this.confirmClicked = false;
        this.emitResponse({
          orderId: this.orderId,
          confirmClicked: false,
          canPop: true
        });
        // Empty food choosen
        this.dataService.changeOrderCart({
          foodItemList: []
        });
        this.commonService.presentToast(this.needTranslate ? '订单已取消' : 'Order cancelled');
      });
    }, error => {
      this.needSpinner = false;
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

  // HTML text getter
  getPackagingFeeText() {
    if (this.needTranslate) {
      return `打包费 (${this.takeAwayCounter}样)`;
    } else {
      if (this.takeAwayCounter > 1) {
        return `Packaging Fee (${this.takeAwayCounter} Items)`;
      }
      return `Packaging Fee (${this.takeAwayCounter} Item)`;
    }
  }

  getServiceChargeText() {
    if (this.needTranslate) {
      return `服务税 (${this.menuSet.td.serviceChargePercentage}%)`;
    } else {
      return `Service Charge (${this.menuSet.td.taxPercentage}%)`;
    }
  }

  getSSTText() {
    if (this.needTranslate) {
      return `税务 (${this.menuSet.td.taxPercentage}% SST)`;
    } else {
      return `Tax (${this.menuSet.td.taxPercentage}% SST)`;
    }
  }

}
