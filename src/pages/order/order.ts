import { Component } from '@angular/core';
import { DataService } from '../../providers/data-service/data.service';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { MenuService } from '../../providers/menu/menu.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TranslateService } from '../../providers/data-service/translate.service';
import { CommonService } from './../../providers/common/common.service';
import { IntroService } from './../../providers/data-service/intro.service';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  // Basic params received
  restaurantId: string;
  // Extra params received
  restaurantName: string;
  isDineIn: boolean;
  needTakeAway: boolean;

  // HTML properties
  hasTranslation: boolean = false;
  needTranslate: boolean = false;

  // JS Properties
  menuId: string;

  // SearchItemPage params
  all: any;
  menu: any;

  foodButtonClicked: boolean = false;
  itemInCart: boolean = false;
  page: any = 'OrderDetailPage';
  orderInfo = [];

  constructor(
    public dataService: DataService,
    public menuService: MenuService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public translateService: TranslateService,
    public commonService: CommonService,
    public introService: IntroService) { }

  ngOnInit() {
    this.needTranslate = this.translateService.currentTranslateValue.needTranslate;
    this.restaurantId = this.navParams.get('restaurantId');

    this.restaurantName = this.navParams.get('restaurantName');
    this.isDineIn = this.navParams.get('isDineIn');

    this.needTakeAway = this.navParams.get('needTakeAway');
    this.setUpMenu(this.restaurantId);
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    this.dataService.changeOrderCart({
      foodItemList: []
    });
  }

  private setUpMenu(restaurantId) {
    this.menuService.getMenu(restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
      // If menu not available
      if (!val) {
        this.presentAlert();
        return;
      }
      // Cleanner code
      const ms = val.menuSettings;
      const sd = ms.securityDetails || {};
      const md = ms.modeDetails || {};
      const cd = ms.commonDetails || {};
      const td = ms.totalDetails || {};
      const nd = ms.noticeDetails || {};
      val.menuSettings = {
        sd: sd,
        md: md,
        cd: cd,
        td: td,
        nd: nd
      };
      // Order mode
      if (this.isDineIn && md.orderMode === 'onlyTakeAway') {
        this.presentAlert();
        return;
      }
      // Translate
      this.hasTranslation = cd.hasTranslation;
      // General
      this.menuId = val._id;
      const resDe = val.restaurantDetails;
      const orderSettings = {
        menuId: this.menuId,
        restaurantId: this.restaurantId,
        restaurantName: resDe.restaurantName,
        tableNo: undefined,
        needTakeAway: this.needTakeAway || false,
        isDineIn: typeof this.isDineIn === 'boolean' ? this.isDineIn : true
      };
      this.orderInfo = val.categoryDetails;
      this.menu = {
        remarkShortCuts: val.remarkShortCuts,
        menuSettings: val.menuSettings
      };
      this.restaurantName = resDe.restaurantName;
      this.all = {
        categoryList: val.categoryDetails,
        remarkShortCuts: val.remarkShortCuts,
        menuSettings: val.menuSettings,
        orderSettings: orderSettings,
      };
      this.dataService.changeMenu(this.all);

      const needIntro = this.introService.currentIntroValue.needIntro;
      if (needIntro) {
        this.navCtrl.push('IntroPage', {
          needTranslate: this.needTranslate,
          type: 'order'
        });
      } else {
        if (orderSettings.isDineIn) {
          this.presentTableNo();
        }
      }
    });
  }

  private presentAlert() {
    this.alertCtrl.create({
      title: this.needTranslate ? '很抱歉' : 'Our apologies',
      subTitle: this.needTranslate ? `餐厅已停止接受食物订单` : `Restaurant's has stopped receiving order.`,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Back',
          handler: data => {
            this.back();
          }
        }
      ]
    }).present();
  }

  private presentTableNo() {
    this.alertCtrl.create({
      title: this.needTranslate ? '请输入桌子号码' : 'Please Insert Table No',
      subTitle: this.needTranslate ? '桌子号码在QR码的下方哟' : 'Table no is below the QR code',
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'tableNo',
          placeholder: 'e.g. 21',
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
            this.all.orderSettings['tableNo'] = data.tableNo;
            this.all.orderSettings['tableNoClicked'] = true;
            this.dataService.changeMenu(this.all);
          }
        }]
    }).present();
  }

  setUpParams(id, index) {
    return {
      categoryId: id,
      restaurantId: this.restaurantId,
      menuId: this.menuId,
      index: index
    };
  }

  getCategoryName(item) {
    return (this.needTranslate) ? item.categoryNameTranslated : item.categoryName;
  }

  toggleTranslate(ev) {
    this.needTranslate = ev.value;
    this.translateService.updateTranslateUption({ needTranslate: ev.value });
    this.dataService.changeTranslate({ needTranslate: ev.value });
  }

  presentSearch() {
    this.navCtrl.push('SearchItemPage', {
      menuId: this.menuId,
      menu: this.menu,
      needTranslate: this.needTranslate
    });
  }

  goToHistoryTicket() {
    this.navCtrl.push('HistoryOrderPage', {
      menu: this.menu,
      restaurantName: this.restaurantName,
      restaurantId: this.restaurantId,
      type: 'tempOrders'
    });
  }

  back() {
    this.translateService.updateTranslateUption({ needTranslate: false });
    this.dataService.changeTranslate({ needTranslate: false });
    this.navCtrl.pop();
  }

}
