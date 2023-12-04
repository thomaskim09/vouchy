import lo_isEmpty from 'lodash/isEmpty';
import { AuthenticationService } from '../../../providers/authentication/authentication.service';
import { CommonService } from '../../../providers/common/common.service';
import { Component, Input, SecurityContext } from '@angular/core';
import { DataService } from '../../../providers/data-service/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { RestaurantService } from '../../../providers/restaurant/restaurant.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { format, parse, isAfter } from 'date-fns';

@Component({
  selector: 'reservation-button',
  templateUrl: 'reservation-button.html'
})
export class ReservationButtonComponent {

  @Input('reservationButton') input: any;

  selectedDate: any;
  form: FormGroup;

  // Controller
  needSpinner: boolean = false;
  buttonClicked: boolean = false;

  constructor(
    public authenticationService: AuthenticationService,
    public commonService: CommonService,
    public dataService: DataService,
    public navCtrl: NavController,
    public restaurantService: RestaurantService,
    public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.listenToReservationForm();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  listenToReservationForm() {
    this.dataService.currentReservation.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        if (val.selectedDate) {
          this.selectedDate = val.selectedDate;
        }
        if (val.form) {
          this.form = val.form;
        }
      }
    });
  }

  createNewReservation() {
    if (!this.selectedDate) {
      this.commonService.presentToast('Please pick a date :)');
      return;
    }
    if (!this.form.valid) {
      this.commonService.presentToast('Please insert your reservation info correctly :)');
      return;
    }
    if (!this.authenticationService.checkLoginStatus()) {
      this.navCtrl.push('LoginPage');
      return;
    }
    // Check time first
    const fv = this.form.value;
    const date = format(this.selectedDate, 'yyyy-MM-dd');
    const dateTime = parse(`${date} ${fv.myTime}`, 'yyyy-MM-dd HH:mm', new Date());
    if (isAfter(new Date(), dateTime)) {
      this.commonService.presentToast('Please make sure your date time is after current time :)');
      return;
    }
    // Send reservation
    this.needSpinner = true;
    const currentUser = this.authenticationService.currentUserValue;
    const reservation = {
      restaurantId: this.input.restaurantId,
      restaurantName: this.input.restaurantName,
      userId: currentUser._id,
      userToken: currentUser.deviceToken,
      username: currentUser.username,
      name: this.sanitizer.sanitize(SecurityContext.HTML, fv.nameInput),
      contact: this.sanitizer.sanitize(SecurityContext.HTML, fv.contactInput),
      dateTime: dateTime,
      pax: fv.myPax,
      remark: this.sanitizer.sanitize(SecurityContext.HTML, fv.remarkInput),
      extraRemark: fv.extraRemark
    };
    this.restaurantService.createReservation(reservation).pipe(untilDestroyed(this)).subscribe(val => {
      this.buttonClicked = true;
      this.needSpinner = false;
      this.navCtrl.push('ReservationStatusPage', {
        status: 'PD',
        restaurantId: this.input.restaurantId,
        restaurantName: this.input.restaurantName,
        notificationId: val.notificationId,
        reservation: reservation,
        view: this.navCtrl.getActive().instance
      });
    });
  }
}
