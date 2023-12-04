import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { RestaurantService } from '../../providers/restaurant/restaurant.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { UserService } from '../../providers/user/user.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-restaurant',
  templateUrl: 'restaurant.html',
  providers: [SocialSharing]
})
export class RestaurantPage {

  view: any;
  isFavourited: boolean;

  restaurantId: any;
  restaurantDetails: any;
  restaurantDetailVouchers: any;
  restaurantInfo: any;

  restaurantDetailMain: any;
  restaurantDetailInfo: any;
  feedback: any;

  constructor(
    public authenticationService: AuthenticationService,
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
    this.isFavourited = this.userService.checkIsFavourited(this.restaurantId);
    this.view = this.navCtrl.getActive().instance;
    this.setUpRestaurantDetails();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  setUpRestaurantDetails() {
    this.restaurantService.getRestaurantDetails(this.restaurantId, 'details').pipe(untilDestroyed(this)).subscribe(val => {
      const de = val.details;
      this.restaurantDetails = {
        restaurantName: de.restaurantName,
        restaurantImage: de.restaurantImage,
        restaurantImageList: de.restaurantImageList
      };
      this.restaurantDetailMain = {
        restaurantId: this.restaurantId,
        restaurantName: de.restaurantName,
        rating: de.rating,
        restaurantType: val.restaurantType,
        contact: de.contact,
        fullAddress: de.fullAddress,
        hasMenu: val.hasMenu,
        hasReservation: val.hasReservation,
        noticeContent: val.noticeContent,
        orderMode: val.orderMode,
        feature: val.feature
      };
      this.restaurantDetailInfo = {
        businessHours: de.businessHours,
        routineRestDay: de.routineRestDay,
        holidays: val.holidays || [],
        shortAreaName: de.shortAreaName,
        restriction: de.restriction,
        isVegetarian: de.isVegetarian
      };
      this.restaurantInfo = {
        restaurantId: val._id,
        restaurantName: de.restaurantName
      };
    });
    this.restaurantService.getRestaurantDetailVouchers(this.restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
      this.restaurantDetailVouchers = val;
    });
    this.feedback = {
      type: 'restaurant',
      id: this.restaurantId,
      pageSize: 2,
      pageNum: 1,
    };
  }

  activeShare() {
    if (this.platform.is('cordova')) {
      const message = `Find ${this.restaurantDetails.restaurantName}'s voucher on Vouchy :) https://play.google.com/store/apps/details?id=com.ilovou.vouchy`;
      const subject = this.restaurantDetails.restaurantName;
      const image = this.restaurantDetails.restaurantImage;
      const url = ``;
      this.socialSharing.share(message, subject, image, url).then().catch();
    }
  }

  back() {
    this.navCtrl.pop();
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
    const profileModal = this.modalCtrl.create('MenuPopOverComponent', { activePage: this.view });
    profileModal.present();
  }

  checkImageList() {
    if (this.restaurantDetails.restaurantImageList) {
      return (this.restaurantDetails.restaurantImageList.length > 0);
    } else {
      return false;
    }
  }

}
