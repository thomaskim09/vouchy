import { AlertController, IonicPage, ModalController, NavController } from 'ionic-angular';
import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { CommonService } from '../../providers/common/common.service';
import { Component } from '@angular/core';
import { DataService } from '../../providers/data-service/data.service';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { NGXLogger } from 'ngx-logger';
import { Platform } from 'ionic-angular/platform/platform';
import { Storage } from '@ionic/storage';
import { TagService } from '../../providers/tag/tag.service';
import { UserService } from '../../providers/user/user.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Vibration } from '@ionic-native/vibration';
import lo_isEmpty from 'lodash/isEmpty';
import lo_minBy from 'lodash/minBy';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-home-detail',
  templateUrl: 'home-detail.html',
  providers: [Geolocation, Diagnostic, LocationAccuracy]
})
export class HomeDetailPage {

  // Properties for distance calculation
  userLatitude: any;
  userLongitude: any;
  citiesList = [];
  closestCity: any = {};
  distanceList = [];

  // HTML controller
  isSearchOn: boolean = false;
  isFilterOn: boolean = false;
  hasNotifications: boolean = false;

  // Infinite scroll
  pageNum: number = 1;
  pageSize: number = 4;

  // Tools controller
  needRefreshNearby: boolean = false;
  refresher: any;
  infiniteScroll: any;
  needInfiniteScroll: boolean = true;
  timer: any;
  needSpinner: boolean = false;

  // Restaurant voucher section
  restaurantVouchers: any = [];
  infiniteContent: any;

  coordinateKey: string = 'Vouchy_User_Coordinates';
  closestCityKey: string = 'Vouchy_Closest_City';

  constructor(
    public alertCtrl: AlertController,
    public authenticationService: AuthenticationService,
    public commonService: CommonService,
    public dataService: DataService,
    public diagnostic: Diagnostic,
    public geolocation: Geolocation,
    public locationAccuracy: LocationAccuracy,
    public logger: NGXLogger,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public platform: Platform,
    public storage: Storage,
    public tagService: TagService,
    public userService: UserService,
    public vibration: Vibration) { }

  ngOnInit() {
    this.detectLocation();
    this.timer = setTimeout(() => {
      if (this.authenticationService.checkLoginStatus()) {
        this.checkCommonNotification();
        this.listenCommonNotification();
      }
    }, 500);
    // Restaurant voucher section
    this.listenSearchRequest();
    this.listenUserOptions();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
  }

  private detectLocation() {
    if (this.platform.is('android') && this.platform.is('cordova')) {
      this.turnOnGPS();
    } else {
      this.getLocation();
    }
  }

  private getLocation() {
    const options = {
      timeout: 3000,
      enableHighAccuracy: true,
    };
    this.geolocation.getCurrentPosition(options).then(res => {
      const co = res.coords;
      this.setUpLocationNearbySearch(co.longitude, co.latitude);
    }).catch(error => {
      if (this.platform.is('android')) {
        this.checkLocationPermission();
      } else {
        this.getSavedUserNearbySearch();
      }
    });
  }

  private turnOnGPS() {
    this.locationAccuracy.canRequest().then(canRequest => {
      if (canRequest) {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_BALANCED_POWER_ACCURACY).then(success => {
          this.getLocation();
        }, error => this.getSavedUserNearbySearch());
      } else {
        this.checkLocationPermission();
      }
    }, error => this.getSavedUserNearbySearch());
  }

  private checkLocationPermission() {
    this.diagnostic.isNetworkLocationAvailable().then(available => {
      this.diagnostic.requestLocationAuthorization().then(status => {
        const permission = this.diagnostic.permissionStatus;
        switch (status) {
          case permission.NOT_REQUESTED: this.getSavedUserNearbySearch(); break;
          case permission.GRANTED: this.turnOnGPS(); break;
          case permission.DENIED: this.getSavedUserNearbySearch(); break;
          case permission.DENIED_ALWAYS: this.getSavedUserNearbySearch(); break;
        }
      }, error => this.getSavedUserNearbySearch());
    }, error => this.getSavedUserNearbySearch());
  }

  private fakeJBLocation() {
    this.setUpLocationNearbySearch(103.7414, 1.4927); // JB City
  }

  private getSavedUserNearbySearch() {
    this.storage.get(this.coordinateKey).then(val => {
      if (val) {
        this.setUpLocationNearbySearch(val.longitude, val.latitude);
      } else {
        this.fakeJBLocation();
      }
    }, err => this.fakeJBLocation());
  }

  private setUpLocationNearbySearch(long, lat) {
    // Update user coordinates
    this.userLongitude = long;
    this.userLatitude = lat;
    this.setUpNearbySearch(this.needRefreshNearby);
    this.needRefreshNearby = false;
    this.getCitiesLocation();
    // Update user coordinate
    this.storage.set(this.coordinateKey, {
      longitude: long,
      latitude: lat
    });
  }

  private getCitiesLocation() {
    this.tagService.getCitiesList().pipe(untilDestroyed(this)).subscribe(val => {
      this.calculateClosestCity(val[0].cities);
    });
  }

  private checkCommonNotification() {
    this.userService.getNotificationCount('F').pipe(untilDestroyed(this)).subscribe(val => {
      if (val[0].count > 0) {
        this.vibration.vibrate([100, 100, 100]);
        this.hasNotifications = true;
      }
      this.hasNotifications = false;
      this.commonService.presentToast('');
    });
  }

  private listenCommonNotification() {
    this.dataService.currentCommonNoti.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        if (val.hasNotification) {
          this.vibration.vibrate([100, 100, 100]);
        }
        this.hasNotifications = val.hasNotification;
        this.commonService.presentToast('');
      }
    });
  }

  private calculateClosestCity(list) {
    // Calculate eeach city distance from user
    this.citiesList = list;
    this.distanceList = this.citiesList.map(val => {
      val.distance = this.distance(this.userLatitude, this.userLongitude, val.location.latitude, val.location.longitude, 'K');
      return val;
    });

    // Check if only one city to compare and assign to list
    this.closestCity = (this.citiesList.length === 1) ? this.citiesList[0] : lo_minBy(list, 'distance');

    // Check if the closest location detected same as previous
    this.storage.get(this.closestCityKey).then(val => {
      if (val) {
        const previousCity = val;
        if (previousCity._id === this.closestCity._id) {
          this.saveClosestCity(previousCity);
          return;
        } else {
          // Prompt user if want to change location
          const alert = this.alertCtrl.create({
            title: 'Change location?',
            subTitle: `Do you want to change from ${previousCity.city} to ${this.closestCity.city}?`,
            buttons: [
              {
                text: 'Nope',
                role: 'cancel',
                handler: () => {
                  this.saveClosestCity(previousCity, true);
                }
              },
              {
                text: 'Sure',
                handler: () => {
                  this.saveClosestCity(this.closestCity);
                }
              }
            ]
          });
          alert.present();
        }
      } else {
        // Save closest city if no previous closest city
        this.saveClosestCity(this.closestCity);
      }
    });
  }

  private setUpNearbySearch(refresh) {
    this.dataService.changeUserOptions({
      nearby: true,
      refresh: refresh
    });
  }

  private saveClosestCity(closestCity, searchNew?) {
    // Store the closest city in cache for future access
    this.storage.set(this.closestCityKey, closestCity);

    // Start searching that city
    if (searchNew) {
      this.dataService.changeSearchTrigger({
        type: 'city',
        id: closestCity._id
      });
      this.isFilterOn = false;
      this.isSearchOn = false;
    }
  }

  private distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 === lat2) && (lon1 === lon2)) {
      return 0;
    }
    const radLat1 = Math.PI * lat1 / 180;
    const radLat2 = Math.PI * lat2 / 180;
    const theta = lon1 - lon2;
    const radTheta = Math.PI * theta / 180;
    let dist = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
    if (dist > 1) { dist = 1; }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === 'K') { dist = dist * 1.609344; }
    if (unit === 'N') { dist = dist * 0.8684; }
    return dist;
  }

  // Restaurant voucher section
  doRefresh(refresher) {
    this.refresher = refresher;
    this.needRefreshNearby = true;
    if (this.isSearchOn || this.isFilterOn) {
      this.setUpNearbySearch(false);
      this.refresher.complete();
      this.isSearchOn = false;
      this.isFilterOn = false;
      return;
    }
    this.getSavedUserNearbySearch();
  }

  loadMore(infiniteScroll) {
    if (!this.needInfiniteScroll) {
      return;
    }
    this.infiniteScroll = infiniteScroll;
    // Cleaner code
    const ic = this.infiniteContent;
    const pSize = this.pageSize;
    const pNum = this.pageNum;
    if (ic.searchNearby) {
      this.searchNearby(this.userLongitude, this.userLatitude, pSize, pNum, false, true);
    } else if (ic.searchBatch) {
      this.searchBatch(ic.result, pSize, pNum, true);
    } else if (ic.searchOne) {
      this.searchOne(ic.type, ic.id, pSize, pNum, true);
    } else if (ic.searchFilter) {
      this.searchFilter(ic, pSize, pNum, true);
    }
  }

  // From search page
  private listenSearchRequest() {
    this.dataService.currentSearchTrigger.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        // Reset list before assignment
        this.restaurantVouchers = [];
        this.pageNum = 1;
        const pSize = this.pageSize;
        this.isSearchOn = true;
        this.isFilterOn = false;
        if (val.result) {
          this.searchBatch(val.result, pSize, 1);
        } else {
          this.searchOne(val.type, val.id, pSize, 1);
          if (val.type === 'city') {
            this.isSearchOn = false;
          }
        }
      }
    });
  }

  // From filter component
  private listenUserOptions() {
    this.dataService.currentUserOptions.pipe(untilDestroyed(this)).subscribe(options => {
      if (lo_isEmpty(options)) {
        return;
      }
      // Reset list before assignment
      this.restaurantVouchers = [];
      // Cleaner code
      const op = options;
      const pSize = this.pageSize;
      this.pageNum = 1;

      // Check to change filter icon
      if (op.cityModel || op.nearby) {
        this.isFilterOn = false;
        this.isSearchOn = false;
      } else if (!lo_isEmpty(op)) {
        this.isFilterOn = true;
        this.isSearchOn = false;
      }

      // Default nearby search
      if (op.nearby) {
        this.searchNearby(this.userLongitude, this.userLatitude, pSize, 1, op.refresh);
      } else if (op.arrangeModel || op.voucherModel || op.priceRange || op.paxRange) {
        this.searchFilter(op, pSize, 1);
      } else if (op.resTypeModel) {
        switch (op.resTypeModel) {
          case 'top': this.searchOne('top', '', pSize, 1); break;
          case 'HL':
          case 'PL': this.searchOne('restriction', op.resTypeModel, pSize, 1); break;
          case 'vegetarian': this.searchOne('vegetarian', true, pSize, 1); break;
          default: this.searchOne('resType', op.resTypeModel, pSize, 1); break;
        }
      } else if (op.foodTypeModel) {
        this.searchOne('foodType', op.foodTypeModel, pSize, 1);
      } else if (op.cityModel) {
        this.searchOne('city', op.cityModel, pSize, 1);
      } else if (op.areaModel) {
        switch (op.locationType) {
          case 'all': this.searchOne('area', op.areaModel, pSize, 1); break;
          case 'street': this.searchOne('street', op.locationModel, pSize, 1); break;
          case 'place': this.searchOne('place', op.locationModel, pSize, 1); break;
        }
      }
    });
  }

  private searchNearby(long, lat, pSize, pNum, refresh?, infinite?) {
    this.infiniteContent = {
      searchBatch: false,
      searchOne: false,
      searchFilter: false,
      searchNearby: true,
    };
    this.tagService.getNearbySearchResult(long, lat, pSize, pNum, refresh).pipe(untilDestroyed(this)).subscribe(val => {
      this.processList(val, infinite, refresh);
    }, error => this.handleError(error));
  }

  private searchFilter(op, pSize, pNum, infinite?) {
    const object = {
      arrange: op.arrangeModel,
      voucherType: op.voucherModel,
      priceRange: op.priceRange,
      paxRange: op.paxRange
    };
    this.infiniteContent = {
      searchBatch: false,
      searchOne: false,
      searchFilter: true,
      result: object
    };
    this.tagService.getSearchResultFilter(object, pSize, pNum).pipe(untilDestroyed(this)).subscribe(val => {
      this.processList(val, infinite);
    }, error => this.handleError(error));
  }

  private searchBatch(result, pSize, pNum, infinite?) {
    this.infiniteContent = {
      searchBatch: true,
      searchOne: false,
      searchFilter: false,
      searchNearby: false,
      result: result
    };
    this.tagService.getSearchResultBatch(result, pSize, pNum).pipe(untilDestroyed(this)).subscribe(val => {
      this.processList(val, infinite);
    }, error => this.handleError(error));
  }

  private searchOne(type, id, pSize, pNum, infinite?) {
    this.infiniteContent = {
      searchBatch: false,
      searchOne: true,
      searchFilter: false,
      searchNearby: false,
      type: type,
      id: id
    };
    this.tagService.getSearchResult(type, id, pSize, pNum, this.userLongitude, this.userLatitude).pipe(untilDestroyed(this)).subscribe(val => {
      this.processList(val, infinite);
    }, error => this.handleError(error));
  }

  private handleError(error) {
    this.logger.error(error);
    this.commonService.presentToast('Server is not responding');
    if (this.refresher) { this.refresher.complete(); }
  }

  private processList(data, infinite?, refresh?) {
    if (data.length) {
      // Make every list drop down able
      data.map(val => { val.toggleStatus = false; });

      // Controlling the tools
      if (refresh) {
        if (this.refresher) { this.refresher.complete(); }
        if (this.pageNum === 1) { return this.pageNum++; } // To take the second data
        this.pageNum = 1;
        this.restaurantVouchers = [];
      } else if (infinite) {
        if (this.infiniteScroll) { this.infiniteScroll.complete(); }
      }

      // Combining list
      this.restaurantVouchers = [...this.restaurantVouchers, ...data];

      // Trigger DOM update
      this.commonService.presentToast('');

      // Check if list finished
      if (data.length < this.pageSize) {
        this.pageNum = 1;
        this.needInfiniteScroll = false;
      } else {
        this.pageNum++;
        this.needInfiniteScroll = true;
        this.checkIfNeedNextList(data);
      }
    } else {
      this.needInfiniteScroll = false;
      if (this.pageNum !== 1) {
        if (infinite && this.infiniteScroll) { this.infiniteScroll.complete(); }
        return;
      }
      this.pageNum = 1;
      this.isFilterOn = false;
      this.isSearchOn = false;
      this.setUpNearbySearch(false);
      this.commonService.presentToast('No result found :(', 1000);
    }
  }

  private checkIfNeedNextList(list) {
    if (this.pageNum - 1 !== 1 && screen.height > 568) {
      return;
    }
    let noVoucher = 0;
    list.map(val => noVoucher = (val.vouchers.length === 0) ? noVoucher + 1 : 0);
    if (noVoucher === this.pageSize) {
      this.searchNearby(this.userLongitude, this.userLatitude, this.pageSize, this.pageNum, false, true);
    }
  }

  // Navigation
  presentSearch() {
    if (this.isSearchOn) {
      this.setUpNearbySearch(false);
      this.isSearchOn = false;
      return;
    }
    this.needSpinner = true;
    this.navCtrl.parent.parent.push('SearchPage', {
      closestCity: this.closestCity
    });
    this.needSpinner = false;
  }

  presentFilter() {
    if (this.isFilterOn) {
      this.setUpNearbySearch(false);
      this.isFilterOn = false;
      return;
    }
    this.needSpinner = true;
    this.modalCtrl.create('FilterResultComponent', {
      closestCity: this.closestCity
    }).present();
    this.needSpinner = false;
  }

  presentMenu() {
    const activePage = this.navCtrl.getActive().instance;
    const modal = this.modalCtrl.create('MenuPopOverComponent', {
      activePage: activePage,
      hasNotifications: this.hasNotifications
    });
    this.needSpinner = true;
    modal.present();
    modal.onDidDismiss(data => {
      if (data && data.hasNotifications === false) {
        this.hasNotifications = false;
      }
    });
    this.needSpinner = false;
  }

  presentLocation() {
    const modal = this.modalCtrl.create('LocationPopOverComponent');
    this.needSpinner = true;
    modal.present();
    modal.onDidDismiss(data => {
      this.closestCity = data.closestCity || this.closestCity;
    });
    this.needSpinner = false;
  }
}
