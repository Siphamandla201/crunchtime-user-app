import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertController, NavController } from "@ionic/angular";
import { CommonAlertService } from "../../core/services/common-alert.service";
import { AccountResourceService } from "../../core/services/account-resource.service";
import { IAccountUpdateModel } from "../../core/models/account-update.model";
import { UserRetrievalModel } from "../../core/models/user-retrieval.model";
import { JwtService } from "../../core/services/jwt.service";
import { ModalController } from '@ionic/angular';
import { AccountDetailsComponent } from "../../components/account-details/account-details.component";
import { ActionSheetController } from '@ionic/angular';
import { ImageUploadPage } from '../image-upload/image-upload.page';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  public modalOpen: boolean = false;
  public user!: UserRetrievalModel;
  public form!: FormGroup;
  public loadingRequest: boolean = false;
  public saving: boolean = false;
  public name!: string;
  public token: string | null = localStorage.getItem('jwtToken');
  result!: string;

    public constructor(
      private readonly _formBuilder: FormBuilder,
      private readonly _router: Router,
      private readonly _alertController: AlertController,
      private readonly _commonAlertService: CommonAlertService,
      private readonly _accountResourceService: AccountResourceService,
      private readonly _jwtService: JwtService,
      private readonly _navCtrl: NavController,
      public modalController: ModalController,
      public actionSheetController: ActionSheetController,
    ) { }
  // public async ngOnInit(): Promise<void> {
  //   this._accountResourceService.getUserDetails().then(async () => {
  //     this.user = await this._accountResourceService.getUserDetails()
  //   }).catch(err => {
  //     this.user = null;
  //   });
  //   this.user = await this._accountResourceService.getUserDetails()
  //   console.log(this.user)
  //   let name = this.user.fullName.split(" ");
    
  //   for (let i = 0; i < name.length; i++) {
  //     name[i] = name[i][0].toUpperCase() + name[i].substring(1);

  //   }

  //   this.name = name.join(" ")

  // }

  public async ngOnInit(): Promise<void> {
    this._accountResourceService.getUserDetails().subscribe(
      (user: UserRetrievalModel) => {
        // Handle the retrieved user details
        this.user = user;
        this.processUserDetails(user);
      },
      (error: any) => {
        // Handle errors
        console.error('Error fetching user details:', error);
        // this.user = null;
      }
    );
  }

  private processUserDetails(user: UserRetrievalModel): void {
    if (user) {
      let name = user.fullName.split(" ");
      for (let i = 0; i < name.length; i++) {
        name[i] = name[i][0].toUpperCase() + name[i].substring(1);
      }
      this.name = name.join(" ");
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AccountDetailsComponent,
      cssClass: '.form-content-account',
      componentProps: {
        'fullName': this.user.fullName,
        'emailAddress': this.user.emailAddress,
        'phoneNumber': this.user.phoneNumber
      }
    });
    return await modal.present();
  }

  public async logOut() {
    this._jwtService.logout()
    await this._router.navigate(['/login']);
  }

  public async openModal() {
    this.modalOpen = true
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
        firstName: this.form.value.firstName,
        surname: this.form.value.surname,
        phoneNumber: this.form.value.phoneNumber.trim(),
        emailAddress: this.form.value.emailAddress.trim(),
        password: this.form.value.password
      };

      await this._accountResourceService.update(model);
      await this.successAlert('You have successfully updated your profile.')
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
          }
        }
      ]
    });

    await alert.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Update Profile',
      buttons: [
        {
          text: 'Upload',
          data: {
            action: 'Upload',
          },
          cssClass: 'upload-btn',
          handler: () => {
            this.presentUploadModal();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });
  
    await actionSheet.present();
  
    const result = await actionSheet.onDidDismiss();
    this.result = JSON.stringify(result, null, 2);
  }

  goToPaymentOptions(){
    this._router.navigate(['/payment-options'])
  }


  async presentUploadModal() {
    const modal = await this.modalController.create({
      component: ImageUploadPage,
    });

    modal.onDidDismiss()
  .then(async () => {
    const user = await this._accountResourceService.getUserDetails().toPromise();
    if (user) {
      this.user = user; // Assign the retrieved user to this.user
    } else {
      console.error('Error fetching user details:');
    }
});


   await modal.present();
  }
}
