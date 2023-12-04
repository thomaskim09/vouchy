import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { CommonService } from '../../providers/common/common.service';
import { Component } from '@angular/core';
import { DataService } from '../../providers/data-service/data.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { GalleryModal } from 'ionic-gallery-modal';
import { IonicPage, NavController, NavParams, ModalController, AlertController, Platform } from 'ionic-angular';
import { RestaurantService } from '../../providers/restaurant/restaurant.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html'
})
export class FeedbackPage {

  form: FormGroup;
  photos: any = [];
  restaurantId: string;
  ticketId: string;
  voucherId: string;
  voucherName: string;

  image: any;

  // Controller
  canFeedback: boolean = false;
  needSpinner: boolean = false;

  constructor(
    public alertCtrl: AlertController,
    public authenticationService: AuthenticationService,
    public commonService: CommonService,
    public dataService: DataService,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public restaurantService: RestaurantService,
    public platform: Platform) { }

  ngOnInit() {
    this.form = this.formControl();
    this.restaurantId = this.navParams.get('restaurantId');
    this.ticketId = this.navParams.get('ticketId');
    this.voucherId = this.navParams.get('voucherId');
    this.voucherName = this.navParams.get('voucherName');
    this.checkIfFeedbackBefore();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private formControl() {
    return this.formBuilder.group({
      rating: ['', Validators.required],
      content: ['', Validators.required],
      photos: [''],
    });
  }

  private checkIfFeedbackBefore() {
    this.restaurantService.checkFeedback(this.ticketId).pipe(untilDestroyed(this)).subscribe(val => {
      this.canFeedback = val.canFeedback;

      if (!this.canFeedback) {
        const alert = this.alertCtrl.create({
          title: 'Please refresh',
          subTitle: 'You have sent feedback before, please refresh list',
          enableBackdropDismiss: false,
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.back();
              }
            }]
        });
        alert.present();
      }
    });
  }

  presentImagePicker() {
    const modal = this.modalCtrl.create('ImagePickerPage');
    modal.onDidDismiss(data => {
      if (data) {
        this.photos.push(data);
        this.image = data;
        this.form.controls.photos.setValue(this.photos);
      }
    });
    modal.present();
  }

  removePicture(i) {
    this.photos.splice(i, 1);
  }

  presentImage(index) {
    const photos = this.photos.map(o => ({ url: o }));
    this.modalCtrl.create(GalleryModal, {
      photos: photos,
      initialSlide: index
    }).present();
  }

  sendFeedback() {
    if (!this.canFeedback) {
      this.commonService.presentToast('Feedback cannot be modify once sent, please refresh :)');
      return;
    }
    if (this.form.valid) {
      const alert = this.alertCtrl.create({
        title: 'Confirm to send feedback?',
        subTitle: 'The content could not be edited afterward.',
        buttons: [
          {
            text: 'Back',
            role: 'cancel'
          },
          {
            text: 'Confirm',
            handler: () => {
              this.needSpinner = true;
              const fv = this.form.value;
              const currentUser = this.authenticationService.currentUserValue;
              const userId = currentUser._id;
              const username = currentUser.username;
              const object = {
                rating: Number(fv.rating),
                content: fv.content,
                photos: this.photos,
                restaurantId: this.restaurantId,
                ticketId: this.ticketId,
                voucherId: this.voucherId,
                voucherName: this.voucherName,
                userId: userId,
                username: username
              };
              this.restaurantService.createFeedbacks(object).pipe(untilDestroyed(this)).subscribe(val => {
                this.commonService.presentToast('Thanks for the feedback :)');
                this.back();
                this.needSpinner = false;
              });
            }
          }]
      });
      alert.present();
    }
  }

  cancelFeedback() {
    if (!this.canFeedback) {
      this.commonService.presentToast('Feedback cannot be modify once sent, please refresh :)');
      return;
    }
    const alert = this.alertCtrl.create({
      title: 'Cancel feedback?',
      subTitle: 'Productive feedback will let the restaurant serve you better, are you sure about not giving a feedback?',
      buttons: [
        {
          text: 'Back',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.restaurantService.cancelFeedback(this.ticketId).pipe(untilDestroyed(this)).subscribe(val => {
              this.commonService.presentToast('Feedback Cancelled');
              this.back();
            });
          }
        }]
    });
    alert.present();
  }

  back() {
    this.navCtrl.pop();
  }
}
