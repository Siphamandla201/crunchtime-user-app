import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRetrievalModel } from '../../core/models/user-retrieval.model';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { CommonAlertService } from 'src/core/services/common-alert.service';
import { AccountResourceService } from '../../core/services/account-resource.service';
import { IAccountUpdateModel } from '../../core/models/account-update.model';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { IonicModule } from '@ionic/angular'; // Import IonicModule

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
})
export class AccountDetailsComponent implements OnInit {
  @Input() public fullName!: string;
  @Input() public emailAddress!: string;
  @Input() public phoneNumber!: string;

  public user!: UserRetrievalModel;
  public form!: FormGroup;
  public loadingRequest!: boolean;
  public saving!: boolean;
  public name!: string;

  constructor(
    public modalController: ModalController,
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly _alertController: AlertController,
    private readonly _commonAlertService: CommonAlertService,
    private readonly _accountResourceService: AccountResourceService,
    private readonly _navCtrl: NavController
  ) {}

  async ngOnInit() {
    this.initializeFormBuilder();
    let name = this.fullName.split(' ');
    for (let i = 0; i < name.length; i++) {
      name[i] = name[i][0].toUpperCase() + name[i].substring(1);
    }

    this.name = name.join(' ');
  }

  public async initializeFormBuilder() {
    const firstName = this.fullName.split(' ');

    for (let i = 0; i < firstName.length; i++) {
      firstName[i] = firstName[i][0].toUpperCase() + firstName[i].substring(1);
    }

    this.form = this._formBuilder.group({
      fullName: [firstName.join(' '), Validators.compose([Validators.required])],
      emailAddress: [this.emailAddress, Validators.compose([Validators.required])],
      phoneNumber: [this.phoneNumber, Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  async presentConfrimation() {
    const modal = await this.modalController.create({
      component: ConfirmationModalComponent,
      cssClass: '.form-content-account',
      componentProps: {
        fullName: this.fullName,
        emailAddress: this.emailAddress,
        phoneNumber: this.phoneNumber,
      },
    });
    return await modal.present();
  }

  public async updateOnTap(): Promise<void> {
    this.loadingRequest = true;
    this.saving = true;

    if (!this.form.valid) {
      this.loadingRequest = false;
      await this._commonAlertService.invalidFormPopup();
      return;
    }

    try {
      const model: IAccountUpdateModel = {
        firstName: this.form.value.firstName.trim(),
        surname: this.form.value.surname.trim(),
        phoneNumber: this.form.value.phoneNumber.trim(),
        emailAddress: this.form.value.emailAddress.trim(),
        password: this.form.value.password,
      };

      await this._accountResourceService.update(model);
      await this.successAlert('You have successfully updated your profile.');
      this.onRequestCompleted();
    } catch (e) {
      this.onRequestCompleted();
      console.warn(e);
    }
  }

  public onRequestCompleted(): void {
    this.saving = false;
    this.loadingRequest = false;
  }

  public moveBackOnTap(): void {
    this._navCtrl.back();
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
            await this._router.navigate(['/']);
          },
        },
      ],
    });

    await alert.present();
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
