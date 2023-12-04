import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, Platform, LoadingController } from 'ionic-angular';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ViewController } from 'ionic-angular/navigation/view-controller';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-image-picker',
  templateUrl: 'image-picker.html'
})
export class ImagePickerPage {

  loader: any;

  constructor(
    public camera: Camera,
    public imageCompress: NgxImageCompressService,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public viewCtrl: ViewController) { }

  ngOnDestroy() {
    if (this.loader) {
      this.loader.dismiss();
    }
  }

  openCamera() {
    this.presentLoading();
    const options: CameraOptions = {
      quality: 30,
      targetWidth: 1000,
      targetHeight: 1000,
      allowEdit: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum: false,
    };
    this.camera.getPicture(options).then(imageData => {
      this.compressImage(imageData);
    }, error => {
      this.loader.dismiss();
    });
  }

  openGallery() {
    this.presentLoading();
    const options: CameraOptions = {
      quality: 30,
      targetWidth: 1000,
      targetHeight: 1000,
      allowEdit: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
    };
    this.camera.getPicture(options).then(imageData => {
      this.compressImage(imageData);
    }, error => this.loader.dismiss());
  }

  private presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loader.present();
  }

  private compressImage(imageData) {
    const converted = 'data:image/jpeg;base64,' + imageData;
    const counter = 0;
    this.compressData(converted, counter);
  }

  private compressData(data, counter) {
    counter++;
    if (this.imageCompress.byteCount(data) > 10000 && counter < 5) {
      this.imageCompress.compressFile(data, 1, 50, 50).then(result => {
        if (this.imageCompress.byteCount(result) > 10000 && counter < 5) {
          this.compressData(result, counter);
        } else {
          this.convertClose(result);
        }
      });
    } else {
      this.convertClose(data);
    }
  }

  private convertClose(result) {
    this.loader.dismiss();
    this.viewCtrl.dismiss(result);
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
