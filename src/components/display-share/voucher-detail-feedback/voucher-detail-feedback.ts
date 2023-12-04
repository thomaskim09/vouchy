import { Component, Input } from '@angular/core';
import { DataService } from '../../../providers/data-service/data.service';
import { DisplayPage } from '../../../pages/display/display';
import { GalleryModal } from 'ionic-gallery-modal';
import { NavController, ModalController } from 'ionic-angular';
import { RestaurantPage } from '../../../pages/restaurant/restaurant';
import { RestaurantService } from '../../../providers/restaurant/restaurant.service';
import { format, parseISO } from 'date-fns';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'voucher-detail-feedback',
  templateUrl: 'voucher-detail-feedback.html'
})
export class VoucherDetailFeedbackComponent {

  @Input('feedback') feedback: any;

  view: any;
  feedbackList: any = [];
  defaultImage: string = `../../../assets/imgs/profile-image-0.png`;

  inRestaurantPage: boolean = false;
  inDisplayPage: boolean = false;

  constructor(
    public dataService: DataService,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public restaurantProvider: RestaurantService) { }

  ngOnInit() {
    this.view = this.navCtrl.getActive().instance;
    this.inRestaurantPage = this.view instanceof RestaurantPage ? true : false;
    this.inDisplayPage = this.view instanceof DisplayPage ? true : false;
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  ngOnChanges() {
    if (this.feedback) {
      this.setUpFeedbackList();
    }
  }

  private setUpFeedbackList() {
    const type = this.feedback.type === 'voucher' ? 'voucherId' : 'restaurantId';
    this.restaurantProvider.getFeedbacks(type, this.feedback.id, this.feedback.pageSize, this.feedback.pageNum).pipe(untilDestroyed(this)).subscribe(val => {
      if (val.length) {
        val = this.formatTime(val);
        this.processResult(val);
      }
    });
  }

  private formatTime(val) {
    return val.map(val2 => {
      val2.feedbackTime = format(parseISO(val2.feedbackTime), 'dd-MM-yyyy');
      return val2;
    });
  }

  private processResult(val) {
    this.feedbackList = [...this.feedbackList, ...val];

    // Notify display page
    if (this.inDisplayPage) {
      if (this.feedback.infiniteScroll) {
        this.feedback.infiniteScroll.complete();
      }
      if (val.length < this.feedback.pageSize) {
        this.dataService.changeInfiniteTrigger({
          needInfiniteScroll: false,
          pageNum: 1
        });
      } else {
        const pageNum = this.feedback.pageNum + 1;
        this.dataService.changeInfiniteTrigger({
          needInfiniteScroll: true,
          pageNum: pageNum
        });
      }
    }
  }

  checkIfLine(index, length) {
    return (index + 1 === length && length <= 1) ? false : true;
  }

  goToDisplay() {
    if (this.inRestaurantPage) {
      this.navCtrl.push('DisplayPage', {
        type: 'feedback',
        restaurantId: this.feedback.id
      });
    } else {
      this.navCtrl.parent.parent.push('DisplayPage', {
        type: 'feedback',
        voucherId: this.feedback.id
      });
    }
  }

  presentImage(category, index) {
    const photos = category.photos.map(o => ({ url: o }));
    this.modalCtrl.create(GalleryModal, {
      photos: photos,
      initialSlide: index
    }).present();
  }
}
