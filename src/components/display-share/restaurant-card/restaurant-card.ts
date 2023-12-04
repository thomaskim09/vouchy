import { AuthenticationService } from '../../../providers/authentication/authentication.service';
import { CommonService } from '../../../providers/common/common.service';
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { ToastController } from 'ionic-angular';
import { UserService } from '../../../providers/user/user.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'restaurant-card',
  templateUrl: 'restaurant-card.html'
})
export class RestaurantCardComponent {

  @Input('restaurantsList') restaurantsList: any;

  constructor(
    public authenticationService: AuthenticationService,
    public commonService: CommonService,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public userService: UserService) { }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  selectRestaurant(restaurantId, status) {
    if (status !== 'CL') {
      this.navCtrl.push('RestaurantPage', {
        restaurantId: restaurantId,
      });
    } else {
      const toast = this.toastCtrl.create({
        message: 'The shop has shut down, do you want to remove it from the list?',
        position: 'top',
        showCloseButton: true,
        closeButtonText: 'Remove'
      });
      let closedByTimeout = false;
      const timeoutHandle = setTimeout(() => { closedByTimeout = true; toast.dismiss(); }, 3500);
      toast.onDidDismiss(() => {
        if (closedByTimeout) { return; }
        clearTimeout(timeoutHandle);
        this.userService.removeFavourites(restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
          this.commonService.presentToast('Restaurant removed from list');
          this.authenticationService.addRemoveFavourite('remove', restaurantId);
        });
      });
      toast.present();
    }
  }

}
