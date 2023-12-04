import { Component } from '@angular/core';
import { DataService } from '../../../providers/data-service/data.service';
import { IonicPage, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TagService } from '../../../providers/tag/tag.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'location-pop-over',
  templateUrl: 'location-pop-over.html'
})
export class LocationPopOverComponent {

  citiesList: any = [];

  closestCityKey: string = 'Vouchy_Closest_City';

  constructor(
    public dataService: DataService,
    public storage: Storage,
    public tagService: TagService,
    public viewCtrl: ViewController) { }

  ngOnInit() {
    this.getCities();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private getCities() {
    this.tagService.getCitiesList().pipe(untilDestroyed(this)).subscribe(val => {
      this.citiesList = val[0].cities;
    });
  }

  changeCity(id) {
    const closestCity = this.citiesList.filter(val => val._id === id);

    this.storage.get(this.closestCityKey).then(val => {
      if (val) {
        const previousCity = val;
        if (previousCity._id === closestCity[0]._id) {
          this.close(undefined);
        } else {
          this.saveClosestCity(closestCity[0]);
        }
      } else {
        this.saveClosestCity(closestCity[0]);
      }
    });
  }

  private saveClosestCity(closestCity) {
    // Store the closest city in cache for future access
    this.storage.set(this.closestCityKey, closestCity);

    // Start searching that city
    this.dataService.changeSearchTrigger({
      type: 'city',
      id: closestCity._id
    });

    this.close(closestCity);
  }

  close(closestCity) {
    this.viewCtrl.dismiss({
      closestCity: closestCity
    });
  }
}
