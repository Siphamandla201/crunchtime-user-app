import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
@Injectable({
  providedIn: 'root',
})
export class IonLoaderService {
  constructor(public loadingController: LoadingController) {}
  // Auto hide show loader
  autoLoader() {
    this.loadingController
      .create({
        message: 'Please wait ...',
        duration: 3000,
      })
      .then((response) => {
        response.present();
        response.onDidDismiss().then((response) => {
          console.log('Loader dismissed', response);
        });
      });
  }

  autoLoaderBanking() {
    this.loadingController
      .create({
        message: 'Please wait ...',
        duration: 15000,
      })
      .then((response) => {
        response.present();
        response.onDidDismiss().then((response) => {
          console.log('Loader dismissed', response);
        });
      });
  }
}
