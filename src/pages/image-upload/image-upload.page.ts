import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import { ImageCroppedEvent, LoadedImage, base64ToFile} from 'ngx-image-cropper';
import {AlertController, NavController} from '@ionic/angular';
import { Router } from '@angular/router';
import { AccountResourceService } from 'src/core/services/account-resource.service';
@Component({
  selector: 'image-upload-page',
  templateUrl: './image-upload.page.html',
  styleUrls: ['./image-upload.page.scss'],
})
export class ImageUploadPage implements OnInit {
  public loadingRequest: boolean = false;
  public formData = new FormData();
  public saving: boolean = false;
  public loading = true;
  private file: File | undefined;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  cancel(){
    this.modalcontroller.dismiss()
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.loading = false
  }

  // imageCropped(e: ImageCroppedEvent) {
  //   console.log('the event : ' , e)
  //   // Convert the Blob to a base64-encoded string
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     this.croppedImage = reader.result as string;
  //   };
  //   reader.readAsDataURL(e.blob)
  // }

  imageLoaded(event: any) {
    console.log('Image loaded:', event);
  }

  cropperReady() {
    console.log('Cropper ready');
  }

  loadImageFailed() {
      // show message
  }
  constructor(
    private readonly alertController: AlertController,
    private readonly accountResourceService: AccountResourceService,
    private readonly navCtrl: NavController,
    private readonly modalcontroller: ModalController
  ) {}

  ngOnInit() {
    this.handleUpload();
  }

  public handleUpload(): void {
    console.log('handled clicked');
    let element: HTMLInputElement = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    // element.value = null
    element.click();
  }

  public onFileChange(fileChangeEvent: { target: { files: (File | undefined)[]; }; }): void {
    this.file = fileChangeEvent.target.files[0];
  }

  public moveBackOnTap(): void {
    this.navCtrl.back();
  }

  public async uploadImage(): Promise<void> {
    try {
      if (this.croppedImage === undefined || this.croppedImage === null) {
        await this.showAlert('Please Upload a Logo.', 'Error');
        return;
      }

      this.formData.append('Content-Type', 'multipart/form-data');
      // this.formData.append('file', base64ToFile(this.croppedImage));

      this.saving = true;
      this.loading = true;

      await this.accountResourceService.uploadProfilePicture(this.formData);
      await this.showAlert('Image Successfully Uploaded.', 'Success');

      this.formData.delete('file');
      this.loading = false;
    } catch (error: any) {
      console.error(error.message);
    }
  }

  public async showAlert(msg: string, header: string): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert',
      header,
      message: msg,
      buttons: [
        {
          text: 'OK',
          cssClass: 'btn-primary',
        },
      ],
    });

    await alert.present();
  }

  public onRequestCompleted(): void {
    this.saving = false;
    this.loadingRequest = false;
  }
}


