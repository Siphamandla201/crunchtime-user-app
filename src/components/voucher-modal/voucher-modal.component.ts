import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import {OrderService} from 'src/core/services/order.service'
import { FormBuilder, FormGroup } from '@angular/forms';
import { PromoVerifyModel } from 'src/core/models/promo-verify.model';

@Component({
  selector: 'app-voucher-modal',
  templateUrl: './voucher-modal.component.html',
  styleUrls: ['./voucher-modal.component.scss'],
})
export class VoucherModalComponent implements OnInit {

  @Input()
  public emailAddress!: string;
  
  @Input()
  public deliveryId!: string;

  public form!: FormGroup;

  constructor(private modalController: ModalController, private _orderService: OrderService, private formBuilder: FormBuilder, private readonly alertCtrl: AlertController) { }

  async ngOnInit() {
    this.form = this.formBuilder.group({
      promoCode: [""]
    })
    console.log(this.deliveryId)
  }

  closeModal() {
    this.modalController.dismiss()
  }

  async getDiscount() {
    try {
      const model: PromoVerifyModel = {
        promoCode: this.form.value.promoCode
      }
      await this._orderService.insertVoucherCode(this.emailAddress, model, this.deliveryId)
      await this.successAlert("Promo has successfully been set")
    } catch (error: any) {
      console.error(error);
      
      const modal = await this.alertCtrl.create({
        cssClass: "alert-error",
        message: error.detail,
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            cssClass: 'btn-primary',
            handler: async () => {
              window.location.reload();
            }
          }
        ]
      })
      await modal.present()
    }
  }

  public async successAlert(msg: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      cssClass: 'custom-alert',
      header: 'Success',
      message: msg,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'btn-primary',
          handler: async () => {
            window.location.reload();
          }
        }
      ]
    })
    await alert.present()
  }

}
