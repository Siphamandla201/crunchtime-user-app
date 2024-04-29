import {Component, NgZone, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {JwtService} from "../core/services/jwt.service";
import {MenuController, Platform} from "@ionic/angular";
import {AccountResourceService} from "../core/services/account-resource.service";
import {interval, Subscription} from "rxjs";
import {startWith} from "rxjs/operators";
import { Store} from '@ngxs/store';
import { GetFavourites } from '../core/store/actions/favourites.action';
import { GetEstablishments } from '../core/store/actions/establishments.action';
import { GetCartItems } from '../core/store/actions/cart.action';
import {GetPromos, GetPromosEstablishments} from "../core/store/actions/promo.action"
import { GetAddresses } from 'src/core/store/actions/addresses.action';
import { getFoodTypes } from 'src/core/store/actions/menuItems.action';
import { SocketIoService } from 'src/core/services/socket-io.service';

declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],

})

export class AppComponent implements OnInit{
  
  public fullName: string = '';
  public email: string = '';  
  private timeInterval!: Subscription;

  public constructor(
    private store: Store,
    private readonly platform: Platform,
    private readonly  menu: MenuController,
    private readonly _router: Router,
    private readonly _accountResourceService: AccountResourceService,
    private readonly _jwtService: JwtService,
    private zone: NgZone,
    private readonly socketIoService: SocketIoService,
  ) {
    platform.ready().then(() => {
      
      if(platform.is('android')) {

      window.handleOpenURL = (_url: string) => {

        }
      }
    })

    platform.resume.subscribe(() => {
      handleBranch()
    })

    const handleBranch = () => {
      if (!platform.is('capacitor')) {return}
      const Branch = window['Branch'];
      Branch.initSession().then(async (data: { [x: string]: any; }) => {
        if (data['+clicked_branch_link']) {
          // alert('Deep Link Data: ' + JSON.stringify(data))
          await this._router.navigate(['/home']);
        }
      })
    }
    // this.setupDeeplinks();

    this.platform.backButton.subscribeWithPriority(1, async () => {
      console.log("Button Pressed");

      return;
    })

  }

  async ngOnInit() {

    this.socketIoService.onItemsUpdated().subscribe(async (data: any) => {
      console.log('Message received:', JSON.parse(data) );
      // Handle the received message
    });

    this.initializeApp();
    this.timeInterval = interval(5000)
      .pipe(
        startWith(0),
      ).subscribe(async _res => {
        if (localStorage.getItem('userFullName') !== null) {
          this.fullName = localStorage.getItem('userFullName')!;
          this.email = localStorage.getItem('userEmail')!;
      } else {
          this.fullName = 'none';
          this.email = 'none';
      }
      

      });

      this.store
        .dispatch([
          new GetEstablishments(), 
          new GetCartItems(),
          new GetFavourites(),
          new GetPromos(),
          new GetPromosEstablishments(),
          new GetAddresses(),
          new getFoodTypes()
        ])
        .subscribe(
          () => {
            // they will never see me
          },
          error => {
            console.log(error);
          }
        );

  }
    async ionViewDidEnter() {
      await this.menu.swipeGesture(false, 'side-menu');
    }

  async ionViewDidLeave() {
    await this.menu.enable(true);
  }

  public async goToOrders() {
    await this._router.navigate(['/my-orders']);
    this.menu.close()
  }

  public async goToHome() {
    await this._router.navigate(['/home']);
    this.menu.close()
  }

  public async goToPayments() {
    await this._router.navigate(['/payment-options']);
    this.menu.close()
  }

  public async goToTandC() {
    await this._router.navigate(['/terms-and-conditions']);
    this.menu.close()
  }

  public async logOut() {
    this._jwtService.logout()
    await this._router.navigate(['/login']);
    this.menu.close()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      if (this.platform.is('ios')) {
        this.showAppTrackingTransparency();
        this.askTrackingPermission();
        this.readTrackingPermission();
      }
      
    });
  }

  askTrackingPermission() {
    if (this.platform.is('ios')) {
      const idfaPlugin = window.cordova.plugins.idfa;
      idfaPlugin.getInfo().then((info: { trackingLimited: any; idfa: any; aaid: any; trackingPermission: any; }) => {
        if (!info.trackingLimited) {
          return info.idfa || info.aaid;
        } else if (info.trackingPermission === idfaPlugin.TRACKING_PERMISSION_NOT_DETERMINED) {
          return idfaPlugin.requestPermission().then((result: any) => {
            if (result === idfaPlugin.TRACKING_PERMISSION_AUTHORIZED) {
              return idfaPlugin.getInfo().then((info: { idfa: any; aaid: any; }) => {
                return info.idfa || info.aaid
              })
            }
          })
        }
      })
      if (window.cordova) {
        window.cordova.exec(win, fail, 'idfa', "requestPermission", []);
      }
    }
    function win(_res: any) {
    }
    function fail(_res: any) {
    }
  }

  readTrackingPermission() {
    if (this.platform.is('ios')) {
      const idfaPlugin = window.cordova.plugins.idfa;
      idfaPlugin.getInfo().then((info: { trackingLimited: any; idfa: any; aaid: any; trackingPermission: any; }) => {
        if (!info.trackingLimited) {
          return info.idfa || info.aaid;
        } else if (info.trackingPermission === idfaPlugin.TRACKING_PERMISSION_NOT_DETERMINED) {
          return idfaPlugin.requestPermission().then((result: any) => {
            if (result === idfaPlugin.TRACKING_PERMISSION_AUTHORIZED) {
              return idfaPlugin.getInfo().then((info: { idfa: any; aaid: any; }) => {
                return info.idfa || info.aaid
              })
            }
          })
        }
      })
      if (window.cordova) {
        window.cordova.exec(win, fail, 'idfa', "getInfo", []);
      }
    }
    function win(_res: any) {
    }
    function fail(_res: any) {
    }
  }

  private showAppTrackingTransparency() {
    const idfaPlugin = window.cordova.plugins.idfa;
      idfaPlugin.getInfo().then((info: { trackingLimited: any; idfa: any; aaid: any; trackingPermission: any; }) => {
        if (!info.trackingLimited) {
          return info.idfa || info.aaid;
        } else if (info.trackingPermission === idfaPlugin.TRACKING_PERMISSION_NOT_DETERMINED) {
          return idfaPlugin.requestPermission().then((result: any) => {
            if (result === idfaPlugin.TRACKING_PERMISSION_AUTHORIZED) {
              return idfaPlugin.getInfo().then((info: { idfa: any; aaid: any; }) => {
                return info.idfa || info.aaid
              })
            }
          })
        }
      })

  }

}
