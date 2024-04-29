import { Injectable } from '@angular/core';
import {AlertController, ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class CommonAlertService {
  public constructor(private readonly _alertController: AlertController, private readonly _toastController: ToastController) {}

  public async invalidFormToaster(): Promise<void> {
    const toast = await this._toastController.create({
      message: 'Invalid Form: Please ensure that all required fields are entered.',
      duration: 2000,
      position: 'top'
    });

    await toast.present();
  }

  public async toaster(msg: string): Promise<void> {
    const toast = await this._toastController.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });

    await toast.present();
  }

  public async invalidFormPopup(): Promise<void> {
    const alert = await this._alertController.create({
      cssClass: 'custom-alert',
      header: 'Invalid Form',
      message: 'Please ensure that all required fields are entered.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'btn-primary'
        }
      ]
    });

    await alert.present();
  }

  public async popup(title: string, msg: string): Promise<void> {
    const alert = await this._alertController.create({
      cssClass: 'custom-alert',
      header: title || 'Notification',
      message: msg,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'btn-primary'
        }
      ]
    });

    await alert.present();
  }
}
