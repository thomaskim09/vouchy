import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AdsService } from '../../../providers/ads/ads.service';

@Component({
  selector: 'ads-slide',
  templateUrl: 'ads-slide.html'
})
export class AdsSlideComponent {

  voucherSlides = [];

  constructor(
    public adsService: AdsService,
    public navCtrl: NavController) { }

  ngOnInit() {
    this.setUpAds();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  setUpAds() {
    this.adsService.getVouchersAds().pipe(untilDestroyed(this)).subscribe(val => {
      this.voucherSlides = val;
    });
  }

  selectRestaurant(restaurantId) {
    if (restaurantId) {
      this.navCtrl.parent.parent.push('RestaurantPage', {
        restaurantId: restaurantId,
      });
    }
  }

  checkSlideNumber() {
    return this.voucherSlides.length === 1 ? false : true;
  }
}
