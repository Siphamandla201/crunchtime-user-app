import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonAlertService } from 'src/core/services/common-alert.service';
import { AuthenticateResourceService } from 'src/core/services/authenticate-resource.service';
import { JwtService } from 'src/core/services/jwt.service';
import { NavController } from '@ionic/angular';
import { PasswordValidator, UsernameValidator } from 'src/validators';
import { UserRetrievalModel } from '../../core/models/user-retrieval.model';
import { OrderService } from 'src/core/services/order.service';
import { AccountResourceService } from 'src/core/services/account-resource.service';
import { IonLoaderService } from 'src/core/services/ionloder.service';
import { Select, Store } from '@ngxs/store';
import { AddressesState } from 'src/core/store/states/addresses.state';
import { Observable } from 'rxjs';
import { AddressesRetrieval } from 'src/core/models/addresses-retrieval.model';
import { GetAddresses } from 'src/core/store/actions/addresses.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public user: UserRetrievalModel = new UserRetrievalModel;
  public form!: FormGroup;
  public loadingRequest: boolean = false;
  public saving: boolean = false;
  @Select(AddressesState.getAddresses)
  public addresses!: Observable<AddressesRetrieval[]>;
   loading: any;

  public constructor(   
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly _commonAlertService: CommonAlertService,
    private readonly _authenticateResourceService: AuthenticateResourceService,
    private readonly _jwtService: JwtService,
    private readonly _orderService: OrderService,
    private readonly _accountResourceService: AccountResourceService,
    private readonly _navCtrl: NavController,
    private readonly _loading: IonLoaderService,
    private readonly _store: Store
  ) {}

  public async ngOnInit(): Promise<void> {
    this.initializeFormBuilder();
  }

  public moveBackOnTap(): void {
    this._navCtrl.back();
  }

  public initializeFormBuilder() {
    this.form = this._formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(254),
          UsernameValidator.validUsername,
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
          PasswordValidator.validPassword,
        ],
      ],
    });
  }


  public async loginOnTap(): Promise<void> {
    this.loadingRequest = true;
    this.saving = true;

    if (!this.form || !this.form.valid) {
        this.loadingRequest = false;
        await this._commonAlertService.invalidFormPopup();
        this.saving = false
        return;
    }

    try {
        const jwtToken = await this._authenticateResourceService.authenticate(this.form.value);
        this._jwtService.login(this.form.value, jwtToken, true);
        this.onRequestCompleted();
        this._loading.autoLoader();
    } catch {
        await this._commonAlertService.popup(
            'Invalid Credentials',
            'The username or password is incorrect.'
        );
    }

    try {
        this._accountResourceService.getUserDetails().subscribe((user: UserRetrievalModel) => {
            if (user.orderProgress === true) {
                this.handleUserWithOrderInProgress();
            } else {
                this.handleUserWithoutOrderInProgress();
            }
        });
    } catch (e) {
        this.onRequestCompleted();
        console.warn(e);
    }
}

private async handleUserWithOrderInProgress(): Promise<void> {
    const delivery = await this._orderService.getDeliveryDetails();
    if (delivery.deliveryStatus === 'AVAILABLE' || delivery.deliveryStatus === 'PICK_UP') {
        await this._router.navigate(['/checkout']);
    } else if (delivery.deliveryStatus === 'ASSIGNED_TO_ME') {
        await this._router.navigate(['/location-tracking-page']);
    } else if (delivery.orderStatus === 'CONFIRMED') {
        await this._router.navigate(['/checkout']);
    } else if (delivery.orderStatus === 'IN_PROGRESS' || delivery.orderStatus === 'PAID') {
        await this._router.navigate(['/home']);
    } else if (localStorage.getItem('jwtToken') !== null && delivery.id === null) {
        await this._router.navigate(['/home']);
    }
}

private async handleUserWithoutOrderInProgress(): Promise<void> {
    this._store.dispatch(new GetAddresses()).subscribe(() => {
        this.addresses.subscribe(async (result: AddressesRetrieval[]) => {
            if (result.length >= 1) {
                const address = result.find(address => address.selected == true);
                if (address && address.latitude != null && address.longitude != null && address.label != 'Current Location') {
                    localStorage.setItem("userLat", address.latitude.toString());
                    localStorage.setItem("userLong", address.longitude.toString());
                    localStorage.setItem("userAddress", address.address);
                    await this._router.navigate(['/home']);
                }
            } else {
                await this._router.navigate(['/location-selection']);
            }
        })
    })
}



  public onRequestCompleted(): void {
    this.saving = false;
    this.loadingRequest = false;
  }

  public togglePassword(ele: { type: string }, eye: { name?: string }) {
    if (ele.type === 'password') {
      ele.type = 'text';
      if (eye.name) {
        eye.name = 'eye-outline';
      }
    } else {
      ele.type = 'password';
      if (eye.name) {
        eye.name = 'eye-off-outline';
      }
    }
  }
  
  
}
