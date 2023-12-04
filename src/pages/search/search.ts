import * as Fuse from 'fuse.js';
import { CommonService } from '../../providers/common/common.service';
import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../providers/data-service/data.service';
import { Keyboard } from '@ionic-native/keyboard';
import { NavController, IonicPage, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TagService } from '../../providers/tag/tag.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AdsService } from './../../providers/ads/ads.service';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [Keyboard]
})
export class SearchPage {

  // NavParams
  closestCity: any;

  // HTML properties
  searchModel: any;

  // Basic properties
  filteredList: any = [];
  searchList: any = [];

  // To show native keyboard
  @ViewChild('input') searchInput;

  trendingSearches: any = [];
  historySearches: any = [];

  historySearchKey: string = 'Vouchy_History_Search';

  // Fuse properties
  options = {
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 16,
    minMatchCharLength: 1,
    keys: [
      'name'
    ]
  };

  // Controller
  timer: any;
  timer2: any;

  // Demo counter
  demoCounter: number = 0;

  constructor(
    public adsService: AdsService,
    public commonService: CommonService,
    public dataService: DataService,
    public keyboard: Keyboard,
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public tagService: TagService,
    public platform: Platform) { }

  ngOnInit() {
    this.closestCity = this.navParams.get('closestCity');
    this.setUpTrendingList();
    this.setUpHistoryList();
    this.setUpSearchList();
    this.showKeyboard();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
    clearTimeout(this.timer2);
  }

  private setUpTrendingList() {
    this.adsService.getSearchAds().pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.trendingSearches = val.tags;
      }
    });
  }

  private setUpHistoryList() {
    this.storage.get(this.historySearchKey).then(data => {
      if (data) {
        this.historySearches = data.reverse();
      }
    });
  }

  private showKeyboard() {
    if (!this.platform.is('cordova')) {
      return;
    }
    this.timer = setTimeout(() => {
      this.searchInput.setFocus();
      this.keyboard.show();
    }, 1000);
  }

  filterQuery(val) {
    const fuse = new Fuse(this.searchList, this.options);
    const results = fuse.search(val);

    const limitedResult = [];
    for (let i = 0; i < results.length; ++i) {
      limitedResult.push(results[i]);
      if (i > 6) { break; }
    }
    this.filteredList = limitedResult;
  }

  private setUpSearchList() {
    this.tagService.getSearchList().pipe(untilDestroyed(this)).subscribe(val => {
      this.processRestaurants(val.restaurantsList);
      this.processVoucher(val.vouchersList);

      this.tagService.getFilterComponentList(this.closestCity._id).pipe(untilDestroyed(this)).subscribe(val2 => {
        this.processArea(val2[1][0].cities);
        this.processStreetPlace(val2[1][0].cities);
        this.processResType(val2[0][0].details.restaurantTypes);
        this.processFoodType(val2[0][0].details.foodTypes);
      });
    });
  }

  private processResType(list) {
    list.map(val => this.pushSearchList(val._id, val.name, 'resType', 'custom-tag'));
  }

  private processFoodType(list) {
    list.map(val => this.pushSearchList(val._id, val.name, 'foodType', 'custom-tag'));
  }

  private processArea(postcodesList) {
    postcodesList[0].postcodes.map(val => {
      val.areas.map(val2 => this.pushSearchList(val2._id, val2.area, 'area', 'custom-location'));
    });
  }

  private processStreetPlace(postcodesList) {
    postcodesList[0].postcodes.map(val => {
      val.areas.map(val2 => {
        val2.places.map(val3 => this.pushSearchList(val3._id, val3.place, 'place', 'custom-landmark'));
        val2.streets.map(val3 => this.pushSearchList(val3._id, val3.street, 'street', 'custom-location'));
      });
    });
  }

  private processRestaurants(list) {
    list.map(val => this.pushSearchList(val._id, val.name, 'restaurant', 'custom-shop'));
  }

  private processVoucher(list) {
    list.map(val => this.pushSearchList(val._id, val.name, 'voucher', 'custom-ticket-outline'));
  }

  private pushSearchList(id, name, type, icon) {
    this.searchList.push({
      id: id,
      name: name,
      type: type,
      icon: icon
    });
  }

  searchOne(item) {
    const id = item.id;
    const name = item.name;
    const type = item.type;
    this.dataService.changeSearchTrigger({
      type: type,
      id: id
    });
    this.updateHistoryList(id, name, type);
    this.navCtrl.pop();
  }

  searchBatch() {
    if (this.filteredList.length === 0) {
      this.commonService.presentToast('Please search with matched keyword', 1500);
      return;
    }

    const limitQuery = [];
    for (let i = 0; i < this.filteredList.length; ++i) {
      limitQuery.push(this.filteredList[i]);
      if (i >= 2) { break; } // only take the first 3 results
    }

    const resType = [];
    const foodType = [];
    const area = [];
    const place = [];
    const street = [];
    const voucher = [];
    const restaurant = [];

    limitQuery.map(val => {
      switch (val.type) {
        case 'resType': resType.push(val.id); break;
        case 'foodType': foodType.push(val.id); break;
        case 'area': area.push(val.id); break;
        case 'place': place.push(val.id); break;
        case 'street': street.push(val.id); break;
        case 'restaurant': restaurant.push(val.id); break;
        case 'voucher': voucher.push(val.id); break;
      }
    });

    const result = {
      resType: resType,
      foodType: foodType,
      area: area,
      place: place,
      street: street,
      voucher: voucher,
      restaurant: restaurant,
    };

    for (const propName in result) {
      if (result[propName].length === 0) {
        delete result[propName];
      }
    }

    this.dataService.changeSearchTrigger({
      result: result
    });
    this.navCtrl.pop();
  }

  clearHistory() {
    this.storage.set(this.historySearchKey, []);
    this.historySearches = [];
    this.commonService.presentToast('History cleared', 1500);
  }

  private updateHistoryList(id, name, type) {
    this.timer2 = setTimeout(() => {
      let list = this.historySearches.reverse();
      if (list.length > 6) {
        list = list.splice(-1, 1);
      }
      const object = {
        id: id,
        name: name,
        type: type,
      };
      list = list.filter(val => val.id !== id);
      list.push(object);
      this.historySearches = list;
      this.storage.set(this.historySearchKey, this.historySearches);
    }, 500);
  }

  back() {
    this.navCtrl.pop();
  }

  goToDemoRestaurant() {
    this.demoCounter++;
    if (this.demoCounter === 10) {
      this.commonService.presentToast('This is a demo restaurant, please do not buy anything.');
      this.navCtrl.push('RestaurantPage', {
        restaurantId: '5d5d2cbf5a993b679208ea74'
      });
    }
  }
}
