import { Component, Input } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { RestaurantService } from '../../../providers/restaurant/restaurant.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { DataService } from './../../../providers/data-service/data.service';

@Component({
  selector: 'order-detail-slide',
  templateUrl: 'order-detail-slide.html'
})
export class OrderDetailSlideComponent {

  @Input('menu') menu: any;
  @Input('restaurantId') restaurantId: any;
  @Input('categoryIndex') categoryIndex: any;

  voucherSlides = [];
  noti: any;

  // Controller
  needTranslate: boolean = false;
  timer: any;

  constructor(
    public restaurantService: RestaurantService,
    public navCtrl: NavController,
    public dataService: DataService,
    public alertCtrl: AlertController) { }

  ngOnInit() {
    this.listenToTranslate();
    this.setUpVoucherSlides();
  }

  ngOnChanges() {
    this.noti = this.menu.menuSettings.nd;
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
  }

  private listenToTranslate() {
    this.dataService.currentTranslate.pipe(untilDestroyed(this)).subscribe(val => {
      this.needTranslate = val.needTranslate;
    });
  }

  private setUpVoucherSlides() {
    const time = this.categoryIndex === -1 ? 0 : 1000;
    this.timer = setTimeout(() => {
      this.restaurantService.getRestaurantDetailVouchers(this.restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
        this.voucherSlides = val;
        if (val.length === 0 && this.categoryIndex === -1) {
          this.presentAlert();
        }
      });
    }, time);
  }

  private presentAlert() {
    this.alertCtrl.create({
      title: this.needTranslate ? '很抱歉' : 'Our apologies',
      subTitle: this.needTranslate ? `餐厅菜单需要开通优惠卷` : `Restaurant's menu needs voucher to function`,
      enableBackdropDismiss: false
    }).present();
  }

  goToVoucher(selectedIndex) {
    this.navCtrl.parent.parent.push('VoucherPage', {
      restaurantName: this.menu.orderSettings.restaurantName,
      restaurantId: this.menu.orderSettings.restaurantId,
      selectedIndex: selectedIndex
    });
  }

  presentNotice() {
    this.alertCtrl.create({
      title: this.needTranslate ? this.noti.noticeTitleTranslated : this.noti.noticeTitle,
      subTitle: this.needTranslate ? this.noti.noticeContentTranslated : this.noti.noticeContent,
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
        }]
    }).present();
  }

  checkSlideNumber() {
    return this.voucherSlides.length === 1 ? false : true;
  }

}
