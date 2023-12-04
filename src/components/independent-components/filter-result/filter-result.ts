import * as _ from 'lodash';
import { Component } from '@angular/core';
import { DataService } from '../../../providers/data-service/data.service';
import { IonicPage, ViewController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { TagService } from '../../../providers/tag/tag.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'filter-result',
  templateUrl: 'filter-result.html'
})
export class FilterResultComponent {

  // NavParams
  closestCity: any;

  // Lists to populate selections
  baseList: any;
  basePostcodesList: any;
  areaList: any;
  combinePSList: any;
  restaurantTypeList: any;
  foodTypeList: any;
  areaOn: boolean = true;

  // Value from DOM
  filterTitleModel: any = 'Vouchers';
  // Areas property
  areaModel: any = 'allAreas';
  locationModel: any = '';
  // Categories property
  categoryTitleModel: any = 'resType';
  resTypeModel: any = 'allResTypes';
  foodTypeModel: any = 'allFoodTypes';
  // Voucher property
  arrangeModel: any;
  voucherModel: any;
  paxIndicator: any = '';
  voucherTypeDisabledStatus: boolean = false;
  priceRange: any = 0;
  paxRange: any = 0;

  constructor(
    public dataService: DataService,
    public navParams: NavParams,
    public tagService: TagService,
    public viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.closestCity = this.navParams.get('closestCity');
    this.setUpFilterList();
    this.listenToUserOption();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpFilterList() {
    this.tagService.getFilterComponentList(this.closestCity._id).pipe(untilDestroyed(this)).subscribe(val => {
      const baseResTypeList = val[0][0].details.restaurantTypes;
      const baseFoodTypeList = val[0][0].details.foodTypes;
      const basePostcodesList = val[1][0].cities;

      this.basePostcodesList = basePostcodesList;
      this.areaList = this.groupList(this.processArea(basePostcodesList));
      this.restaurantTypeList = this.groupList(baseResTypeList);
      this.foodTypeList = this.groupList(baseFoodTypeList);
    });
  }

  private listenToUserOption() {
    this.dataService.currentUserOptions.pipe(untilDestroyed(this)).subscribe(val => {
      if (_.every(val, o => (o === undefined || o === 0))) {
        this.areaModel = 'allAreas';
        this.locationModel = '';
        this.categoryTitleModel = 'resType';
        this.resTypeModel = 'allResTypes';
        this.foodTypeModel = 'allFoodTypes';
      } else {
        this.areaModel = val.areaModel;
        this.locationModel = val.locationModel;
        this.categoryTitleModel = 'resType';
        this.resTypeModel = val.resTypeModel;
        this.foodTypeModel = val.foodTypeModel;
        this.arrangeModel = val.arrangeModel;
        this.voucherModel = val.voucherModel;
        this.priceRange = val.priceRange;
        this.paxRange = val.paxRange;
      }
      this.voucherTypeChanged();
    });
  }

  private groupList(list) {
    const newSet = new Set(list);
    const newList = Array.from(newSet);
    const newSortedList = newList.sort();
    const allDivision = _(newSortedList)
      .groupBy(o => o.name[0].toUpperCase())
      .map((contents, letter) => ({ letter, contents }))
      .value();
    return allDivision;
  }

  private processArea(postcodesList) {
    const result = postcodesList[0].postcodes.map(val => {
      const areaOptions = val.areas.map(val2 => ({
        _id: val2._id,
        name: val2.area
      }));
      return areaOptions;
    });
    return result[0];
  }

  turnOnArea() {
    this.areaOn = true;
  }

  chooseArea(areaName) {
    if (areaName === 'allAreas') {
      this.defaultNearbySearch();
      this.close();
    } else {
      this.basePostcodesList[0].postcodes.map(val => {
        val.areas.map(val2 => {
          if (val2.area === areaName) {
            const streetList = val2.streets.map(val3 => ({
              _id: val3._id,
              name: val3.street,
              type: 'street'
            }));
            const placeList = val2.places.map(val3 => ({
              _id: val3._id,
              name: val3.place,
              type: 'place'
            }));
            const combine = streetList.concat(placeList);
            this.combinePSList = this.groupList(combine);
          }
        });
      });
      this.areaOn = false;
    }
  }

  voucherTypeChanged() {
    if (this.voucherModel === 'cash' || this.voucherModel === 'quantity') {
      this.paxIndicator = '(Set Voucher Only)';
      this.voucherTypeDisabledStatus = true;
      this.paxRange = undefined;
    } else {
      this.voucherTypeDisabledStatus = false;
      this.paxIndicator = '';
    }
  }

  priceRangeIndicator(priceRange) {
    if (priceRange === 0 || priceRange === undefined) {
      return 'None';
    } else if (priceRange !== 0 && priceRange < 200) {
      return `< RM ${priceRange}`;
    } else if (priceRange === 200) {
      return `> RM ${priceRange}`;
    }
  }

  paxRangeIndicator(paxRange) {
    if (paxRange === 0 || paxRange === undefined) {
      return 'None';
    } else if (paxRange !== 0 && paxRange < 10) {
      return `< ${paxRange} Pax`;
    } else if (paxRange === 10) {
      return `> ${paxRange} Pax`;
    }
  }

  chooseLocation(type) {
    this.dataService.changeUserOptions({
      areaModel: this.areaModel,
      locationModel: this.locationModel,
      locationType: type
    });
    this.close();
  }

  chooseResType() {
    if (this.resTypeModel === 'allResTypes') {
      this.defaultNearbySearch();
    } else {
      this.dataService.changeUserOptions({
        resTypeModel: this.resTypeModel,
      });
    }
    this.close();
  }

  chooseFoodType() {
    if (this.foodTypeModel === 'allFoodTypes') {
      this.defaultNearbySearch();
    } else {
      this.dataService.changeUserOptions({
        foodTypeModel: this.foodTypeModel,
      });
    }
    this.close();
  }

  filterClicked() {
    if (!this.arrangeModel && !this.voucherModel && !this.priceRange && !this.paxRange) {
      this.defaultNearbySearch();
    } else {
      this.dataService.changeUserOptions({
        arrangeModel: this.arrangeModel,
        voucherModel: this.voucherModel,
        priceRange: this.zero(this.priceRange),
        paxRange: this.zero(this.paxRange)
      });
    }
    this.close();
  }

  private zero(value) {
    return value === 0 ? undefined : value;
  }

  private defaultNearbySearch() {
    this.dataService.changeUserOptions({
      nearby: true,
      refresh: false,
    });
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
