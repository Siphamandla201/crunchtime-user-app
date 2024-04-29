import { Component } from '@angular/core';
import { OtpService } from "../../core/services/otp.service";
import { ActivatedRoute, Router } from "@angular/router";
import {NavController} from "@ionic/angular";
import { JwtService } from 'src/core/services/jwt.service';
import { IAuthenticateModel } from 'src/core/models/authenticate.model';
import { AuthenticateResourceService } from 'src/core/services/authenticate-resource.service';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddressesRetrieval } from 'src/core/models/addresses-retrieval.model';
import { GetAddresses } from 'src/core/store/actions/addresses.action';
import { AddressesState } from 'src/core/store/states/addresses.state';
import { AccountResourceService } from 'src/core/services/account-resource.service';
import { OrderService } from 'src/core/services/order.service';
import { UserRetrievalModel } from 'src/core/models/user-retrieval.model';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage {
  public otpSettings = {
    length: 6,
    numbersOnly: true,
    timer: 120,
    timerType: 1
  }
  public otpPin!: string;
  public emailAddress: string;
  public username: string;
  public password: string;
  
  @Select(AddressesState.getAddresses)
  public addresses!: Observable<AddressesRetrieval[]>;

  public constructor (
    private readonly _navCtrl: NavController,
    private readonly _optService: OtpService,
    private readonly _router: Router,
    private readonly _activeRoute: ActivatedRoute,
    private readonly _jwtService: JwtService,
    private readonly _authenticateService: AuthenticateResourceService,
    private readonly _store: Store,
    private readonly _orderService: OrderService,
    private readonly _accountResourceService: AccountResourceService,
  ) {
    const emailAddressParam = this._activeRoute.snapshot.paramMap.get('emailAddress');
    this.emailAddress = emailAddressParam ? emailAddressParam : '';

    const usernameParam =  this._activeRoute.snapshot.paramMap.get('username');
    this.username = usernameParam ? usernameParam : '';

    const passwordParam = this._activeRoute.snapshot.paramMap.get('password');
    this.password = passwordParam  ? passwordParam : '';
  }

  public async confirmOtp(): Promise<void> {
    try {
      const verifyOtp = await this._optService.verifyOtpRequest(this.otpPin, this.emailAddress.trim());
      
      if (verifyOtp) {
        await this._optService.activateAccount(this.emailAddress.trim());
        const model: IAuthenticateModel = {username: this.username, password: this.password}
        const jwtToken = await this._authenticateService.authenticate(model)
        localStorage.setItem('jwtToken', jwtToken.idToken)
        await this._jwtService.login(model, jwtToken, true)
  
        this._accountResourceService.getUserDetails().subscribe(async (user: UserRetrievalModel) => {
          if (user && user.orderProgress === true) {
            const delivery = await this._orderService.getDeliveryDetails();
            if (delivery.deliveryStatus === 'AVAILABLE' || delivery.deliveryStatus === 'PICK_UP') {
              await this._router.navigate(['/checkout']);
            } else if (delivery.deliveryStatus === 'ASSIGNED_TO_ME') {
              await this._router.navigate(['/location-tracking-page']);
            } else if (
              delivery.orderStatus === 'IN_PROGRESS' ||
              delivery.orderStatus === 'PAID' ||
              delivery.orderStatus === 'CONFIRMED'
            ) {
              await this._router.navigate(['/checkout']);
            } else if (
              localStorage.getItem('jwtToken') !== null &&
              user.id == null &&
              delivery.id === null
            ) {
              await this._router.navigate(['/home']);
            }
          } else {
            this._store.dispatch(new GetAddresses()).subscribe(() => {
              this.addresses.subscribe(async result => {
                if (result.length >= 1) {
                  const address = result.filter(addre => addre.selected == true)
  
                  if (address[0].latitude != null && address[0].longitude != null && address[0].label != 'Current Location') {
                    localStorage.setItem("userLat", address[0].latitude.toString())
                    localStorage.setItem("userLong", address[0].longitude.toString())
                    localStorage.setItem("userAddress", address[0].address)
                    await this._router.navigate(['/home']);
                  }
                } else {
                  await this._router.navigate(['/location-selection']);
                }
              })
            })
          }
        });
      }
    } catch (error) {
      console.warn(error);
    }
  }
  

  public async verifyOtp(OtpService : any): Promise<void> {
    this.otpPin = OtpService;
  }

  public async requestOtpAgainOnTap(): Promise<void> {
    try {
      await this._optService.sendOtpRequest(this.emailAddress.trim());
    } catch (e) {
      console.warn(e);
    }
  }

  public moveBackOnTap(): void {
    this._navCtrl.back();
  }

}
