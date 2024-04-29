import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AccountResourceService } from '../../core/services/account-resource.service'
import {AlertController, NavController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent implements OnInit {
  @Input()
  public fullName!: string;
  @Input()
  public emailAddress!: string;
  @Input()
  public phoneNumber!: string;

  constructor(
    public modalController: ModalController,
    private readonly _alertController: AlertController,
    public _accountService: AccountResourceService,
    public _router: Router
  ) { }

  ngOnInit() {}

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  public async deleteAccount() {
    try{
      this._accountService.sendDeleteRequest(this.emailAddress).then(res => {
        this.successAlert(res.message)
      })
    }catch(error){
      console.log(error)
      this.errorAlert('Something went wrong')
    }
  }

  public async successAlert(msg: string): Promise<void> {
    const alert = await this._alertController.create({
      cssClass: 'custom-alert',
      header: 'Success',
      message: msg,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'btn-primary',
          handler: async () => {
            this.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }

  public async errorAlert(msg: string): Promise<void> {
    const alert = await this._alertController.create({
      cssClass: 'custom-alert',
      header: 'Error',
      message: msg,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'btn-primary',
        }
      ]
    });

    await alert.present();
  }

}
