import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../providers/data-service/data.service';
import { NavController, NavParams, IonicPage, ModalController, Platform } from 'ionic-angular';
import { RestaurantPage } from '../restaurant/restaurant';
import { RestaurantService } from '../../providers/restaurant/restaurant.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { UserService } from '../../providers/user/user.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { SuperTabsComponent } from 'ionic2-super-tabs';
import lo_isEmpty from 'lodash/isEmpty';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-voucher',
  templateUrl: 'voucher.html',
  providers: [SocialSharing]
})
export class VoucherPage {

  // Supertabs controller
  @ViewChild(SuperTabsComponent) superTabs: SuperTabsComponent;

  selectedIndex: number;
  voucherId: string;
  restaurantId: string;
  restaurantName: string = 'Loading...';
  vouchersTitle: any;
  restaurant: any;

  view: any;
  isFavourited: boolean;

  // Share properties
  voucherName: any;
  voucherImage: any;

  // super-tab properties
  selectedTabIndex: number = 0;
  page: any = 'VoucherDetailPage';

  constructor(
    public authenticationService: AuthenticationService,
    public dataService: DataService,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public restaurantService: RestaurantService,
    public socialSharing: SocialSharing,
    public userService: UserService) {
  }

  ngOnInit() {
    this.restaurantId = this.navParams.get('restaurantId');
    this.restaurantName = this.navParams.get('restaurantName');
    this.selectedIndex = this.navParams.get('selectedIndex') || 0;

    this.isFavourited = this.userService.checkIsFavourited(this.restaurantId);
    this.view = this.navCtrl.getActive().instance;

    this.setUpRestaurantVoucherTitle();
    this.listenToVoucherShare();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpRestaurantVoucherTitle() {
    this.restaurantService.getRestaurantDetailsSegment(this.restaurantId, 'segment').pipe(untilDestroyed(this)).subscribe(val => {
      this.restaurant = val;
      this.restaurantName = val.details.restaurantName;
      this.restaurantService.getVouchersTitle(this.restaurantId).pipe(untilDestroyed(this)).subscribe(val2 => {
        this.vouchersTitle = val2.map(val3 => ({
          _id: val3._id,
          newPrice: val3.details.newPrice,
          suitablePax: this.updateSuitablePaxTitle(val3.details.suitablePax)
        }));
        this.slideToIndex(this.selectedIndex);
      });
    });
  }

  private slideToIndex(index: number) {
    if (this.vouchersTitle.length > index) {
      setTimeout(() => {
        this.superTabs.slideTo(index);
      }, 500);
    }
  }

  private listenToVoucherShare() {
    this.dataService.currentVoucherShare.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        this.voucherName = val.voucherName;
        this.voucherImage = val.voucherImage;
      }
    });
  }

  updateSuitablePaxTitle(suitablePax) {
    return suitablePax ? `(${suitablePax} Pax)` : '';
  }

  merge(voucherId, restaurant) {
    return {
      voucher: voucherId,
      restaurant: restaurant
    };
  }

  activeShare() {
    if (this.platform.is('cordova')) {
      const message = `Get this voucher '${this.voucherName}' - ${this.restaurantName} on Vouchy :) https://play.google.com/store/apps/details?id=com.ilovou.vouchy`;
      const subject = this.voucherName;
      const image = this.voucherImage;
      const url = ``;
      this.socialSharing.share(message, subject, image, url).then().catch();
    }
  }

  toggleFavourite() {
    if (this.authenticationService.checkLoginStatus()) {
      if (this.isFavourited) {
        this.userService.removeFavourites(this.restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
          this.isFavourited = !this.isFavourited;
          this.authenticationService.addRemoveFavourite('remove', this.restaurantId);
        });
      } else {
        this.userService.addFavourites(this.restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
          this.isFavourited = !this.isFavourited;
          this.authenticationService.addRemoveFavourite('add', this.restaurantId);
        });
      }
    } else {
      if (this.view instanceof RestaurantPage) {
        this.navCtrl.push('LoginPage');
      } else {
        this.navCtrl.parent.parent.push('LoginPage');
      }
    }
  }

  presentMenu() {
    const modal = this.modalCtrl.create('MenuPopOverComponent', { activePage: this.view });
    modal.present();
  }

  back() {
    this.navCtrl.pop();
  }

}
