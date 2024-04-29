import { AccountResourceService } from '../../core/services/account-resource.service';
import { Address } from 'src/core/models/address.model';
import { AddressesRetrieval } from 'src/core/models/addresses-retrieval.model';
import { AddressesState } from 'src/core/store/states/addresses.state';
import {
  AlertController,
  ModalController,
  Platform,
  ToastController,
} from '@ionic/angular';
// import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { CategoryResourceService } from '../../core/services/category-resource.service';
import { CategoryRetrievalModel } from '../../core/models/category-retrieval.model';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrentlyUnavailableComponent } from 'src/components/currently-unavailable/currently-unavailable.component';
import { DistanceCalculatorResourceService } from '../../core/services/distance-calculator-resource.service';
import { DriverDetailsRetrievalModel } from '../../core/models/driver-details-retrieval.model';
import { DriverResourceService } from '../../core/services/driver-resource.service';
import { EstablishmentService } from '../../core/services/establishment.service';
import { EstablishmentState } from '../../core/store/states/establishments.state';
import { EstablishmentNearYouState } from '../../core/store/states/establishmentsNearYou.state';
import { FavouritesRetrievalModel } from '../../core/models/favourites-retrieval.model';
import { FavouriteState } from '../../core/store/states/favourites.state';
// import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { FormControl } from '@angular/forms';
import {
  GetEstablishments,
  SetSelectedEstablishment,
  GetEstablishmentCategories,
  GetEstablishmentMenuItems,
} from '../../core/store/actions/establishments.action';
import {
  GetNearYouEstablishments,
  SetEstablishmentsNearYou,
} from '../../core/store/actions/establishmentsNearYou.action';
import { IEstablishmentRetrievalModel } from '../../core/models/establishment-retrieval.model';
import { combineLatest, forkJoin, interval, of } from 'rxjs';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
// import { LocationOptionsPage } from '../location-options/location-options.page';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PushNotificationResourceService } from '../../core/services/push-notification-resource.service';
import { Select, Store } from '@ngxs/store';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Subscription, timer } from 'rxjs';
import { UserLocationModel } from '../../core/models/user-location.model';
import { UserRetrievalModel } from '../../core/models/user-retrieval.model';
import { PromoService } from 'src/core/services/promo.service';
import { PromoRetrievalModel } from 'src/core/models/promo-retrieval.model';
import { PromoState } from 'src/core/store/states/promo.state';
import {
  GetPromos,
  GetPromosEstablishments,
} from 'src/core/store/actions/promo.action';
import {
  exhaustMap,
  filter,
  map,
  switchMap,
  take,
  takeWhile,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { OrderService } from 'src/core/services/order.service';
import { ClearCart } from 'src/core/store/actions/cart.action';
import { DeliveryRetrievalModel } from 'src/core/models/delivery-retrieval.model';
import { NoDriversAvailableComponent } from 'src/components/no-drivers-available/no-drivers-available.component';
// import { MapsAPILoader } from '@agm/core';
// import {Device} from '@ionic-native/device/ngx'

// import { select, Store } from '@ngrx/store';
// import { invokeFavouritesAPI } from '../../core/store/actions/favourites.action';
// import { selectFavourites } from '../../core/store/selectors/favourite.selector';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @Select(FavouriteState.getFavourites)
  public favourites!: Observable<
    FavouritesRetrievalModel[]
  >;
  @Select(FavouriteState.getFavouriteEStablishments)
  public favouritEstablishments!: Observable<number[]>;
  @Select(EstablishmentState.getEstablishments)
  public establishments!: Observable<any[]>;
  @Select(EstablishmentNearYouState.getEstablishmentsNearYou)
  public establishmentsNearYou!: Observable<any[]>;
  @Select(EstablishmentState.getLoading)
  public loading!: Observable<boolean>;
  @Select(PromoState.getPromos)
  public promos!: Observable<
    PromoRetrievalModel[]
  >;
  @Select(PromoState.getEstPromos)
  public promoEstablishments!: Observable<
    number[]
  >;
  @Select(AddressesState.getAddresses)
  public addresses!: Observable<AddressesRetrieval>;
  @Select(AddressesState.getSelectedAddress)
  public selectedAddress!: Observable<AddressesRetrieval>;
  public nearYouArray!: any[];
  public searchInput: string = '';
  public searchControl!: FormControl;
  public searching: boolean = false;
  public userAddress: any;

  public driversOnline!: Array<DriverDetailsRetrievalModel>;
  // public establishments: Array<IEstablishmentRetrievalModel>
  public categories!: Array<CategoryRetrievalModel>;
  // public establishmentsNearYou: Array<IEstablishmentRetrievalModel>
  public categoriesNearYou!: Array<CategoryRetrievalModel>;
  public user!: UserRetrievalModel;
  public showSplash = true; // <-- show animation
  public events: unknown;
  public from!: number;
  public to!: number;
  hasPermission!: boolean;
  public inPerimeter: number = 0;
  searchText: any;
  public timeNow!: string;
  // public promos: Observable<PromoRetrievalModel[]>
  public favouriteStores: any[] = [];
  public promoStores: any[] = [];
  private subscription!: Subscription;
  private items: any[];
  lat!: number;
  lng!: number;
  geoCoder: any;
  zoom!: number;
  address!: Address;
  searchTerm: any;
  public theLoader: boolean = true;
  isModalOpen = false;
  foodTypeFilter!: string;
  delivery!: DeliveryRetrievalModel;
  orderStatus!: string;
  orderProgress = localStorage.getItem('orderProgress') || 'false';
  orderEstablishmentName = localStorage.getItem('orderEstablishmentName') || '';
  orderOrderNumber = localStorage.getItem('orderOrderNumber') || '';
  subscriptions!: Subscription;
  public establishmentIdsNearYou = [];
  UnavailableModalPresented: boolean = false;
  UnavailableaModalDriverPresent: boolean = false;
  sortedEstablishments = [];
  public sortedEstablishmentsFinal = [];
  checkingPerimeter!: boolean;
  fcm: any;
  statusBar: any;
  splashScreen: any;
  backgroundMode: any;
  localNotifications: any;
  mapsAPILoader: any;

  public async setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  public constructor(
    private store: Store,
    // private readonly splashScreen: SplashScreen,
    // private readonly statusBar: StatusBar,
    // private readonly localNotifications: LocalNotifications,
    public readonly modalController: ModalController,
    // private readonly backgroundMode: BackgroundMode,
    private readonly platform: Platform,
    private readonly alertCtrl: AlertController,
    // private fcm: FCM,
    private readonly pushNotificationResourceService: PushNotificationResourceService,
    private readonly _accountResourceService: AccountResourceService,
    private readonly distanceCalculatorResourceService: DistanceCalculatorResourceService,
    private readonly _alertController: AlertController,
    private readonly _establishmentService: EstablishmentService,
    private readonly _promoService: PromoService,
    private readonly _driverService: DriverResourceService,
    private readonly _router: Router,
    private readonly _categoryService: CategoryResourceService,
    private readonly cdr: ChangeDetectorRef,
    private readonly _orderService: OrderService,
    private readonly _store: Store,
    // private mapsAPILoader: MapsAPILoader // private readonly _device: Device
  ) // private store: Store
  {
    this.items = [
      { backgroundColor: '#FF9F06', backgroundColor2: '#FFE1B4' },
      { backgroundColor: '#01c76c', backgroundColor2: '#00b783' },
    ];
    this.platform.ready().then(async () => {
      if (!this.platform.is('cordova')) {
        return;
      }

      // this.hasPermission = await this.fcm.requestPushPermission();

      await this.getToken();

      this.fcm.onTokenRefresh().subscribe(async (token: string) => {
        alert(token)
        if (this.platform.is('android')) {
          await this.pushNotificationResourceService.saveToken(
            token,
            'android'
          );
        }

        if (this.platform.is('ios')) {
          await this.pushNotificationResourceService.saveToken(token, 'ios');
          let userMarker = localStorage.getItem('userMarkerLabel');
          let userlat = localStorage.getItem('userLat');
          let userLong = localStorage.getItem('userLong');

          const model: UserLocationModel = {
            address: userMarker,
            latitude: userlat,
            longitude: userLong,
          };
          await this._accountResourceService.setLocation(model);
          localStorage.removeItem('userMarkerLabel');
          localStorage.removeItem('userLat');
          localStorage.removeItem('userLong');
        }
      });

      this.fcm.onNotification().subscribe(async (data: any) => {
        await this.notificationSetup(data);
      });

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      timer(3000).subscribe(() => (this.showSplash = false)); // <-- hide animation after 3s
    });

    this.backgroundMode.enable();
    this.backgroundMode.on('enable').subscribe(() => {});

    // @ts-ignore
    this.localNotifications.requestPermission().then((permission) => {
      this.localNotifications.on('click').subscribe((res: { data: { mydata: any; }; id: any; title: string; text: string; }) => {
        const msg = res.data ? res.data.mydata : '';
        this.localNotifications.schedule({
          id: res?.id,
          text: msg,
          title: res?.title,
          foreground: true,
          lockscreen: true,
          vibrate: true,
        });
        this.showAlertNotification(res.title, res.text, msg);
      });
    });
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(event, 'IN');
        if (event.url === '/home' || this._router.url === '/home') {
          this.subscription = this.platform.backButton.subscribeWithPriority(
            0,
            () => {
              console.log(navigator);
              navigator['app'].exitApp();
              console.log('it works');
            }
          );
        } else {
          this.subscription.unsubscribe();
        }
      }
    });
  }

  async ngOnInit() {
    this.delivery = await this._orderService.getDeliveryDetails();
    this.orderEstablishmentName = this.delivery.establishmentName;
    this.orderOrderNumber = this.delivery.orderNumber;
    // this.theLoader = true;

    console.log(this._router.url);
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // console.log(event, 'IN');
        if (event.url === '/home' || this._router.url === '/home') {
          this.subscription = this.platform.backButton.subscribeWithPriority(
            0,
            () => {
              // console.log(navigator);
              navigator['app'].exitApp();
              // console.log('it works');
            }
          );
        } else {
          this.subscription.unsubscribe();
        }
      }
    });

    // this.user = await this._accountResourceService.getUserDetails();

    this._accountResourceService
      .getUserDetails()
      .then(async (res: UserRetrievalModel) => {
        this.user = res;
        this.orderProgress = this.user.orderProgress ? 'true' : 'false';
      })
      .catch((err: any) => {
        // console.log(err);
        this.user = null;
        this.orderProgress = 'false';
      });
    this.store.dispatch(new GetEstablishments()).subscribe(() => {
      this.establishments
        .pipe(
          withLatestFrom(this.loading),
          filter(
            ([establishments, loading]) => !loading && establishments.length > 0
          ),
          take(1)
        )
        .subscribe(([establishments]) => {
          establishments.forEach((establishment, i) => {
            // do something with each establishment
            // console.log(establishment);
            this.store
              .dispatch(new GetEstablishmentCategories(establishment?.id))
              .subscribe(() => {
                this.store
                  .dispatch(new GetEstablishmentMenuItems(establishment?.id))
                  .subscribe((result) => {
                    // console.log(establishments, i);
                    if (i == establishments.length - 1) {
                      this.theLoader = false;
                    }
                  });
              });
          });
        });
    });
    this.store.dispatch(new GetNearYouEstablishments());
    this.store.dispatch(new GetPromos());


    let addressString = this.user
      ? this.user?.address
      : localStorage.getItem('userMarkerLabel');
    let splitAddress = addressString.split(',');
    let streetName = splitAddress[0].trim();
    this.userAddress = streetName;


    combineLatest([this.establishments, this.promos]).subscribe(
      ([establishments, promos]) => {
        const promoTypes = promos.map((promo) =>
          promo.promoType.replace(/_/g, ' ')
        );
        console.log(promoTypes);

        establishments.forEach((establishment) => {
          const matchingPromo = promos.find(
            (promo) => promo.establishmentId === establishment.id
          );
          console.log('Matching Promo:', matchingPromo);

          if (matchingPromo) {
            const existingPromoStore = this.promoStores.find(
              (ps) => ps.id === establishment.id
            );

            console.log('Existing Promo Store:', existingPromoStore);

            const promoIndex = promos.indexOf(matchingPromo);
            console.log('Promo Index:', promoIndex);

            const establishmentName = establishment.establishmentName
              .split(' ')
              .map((word: string | any[]) => word[0].toUpperCase() + word.slice(1))
              .join(' ');

            if (existingPromoStore) {
              console.log(
                `Duplicate establishment id ${establishment.id} found in promoStores array`
              );
            } else {
              this.promoStores.push({
                id: establishment.id,
                promoId: matchingPromo.id,
                promoType: promoTypes[promoIndex],
                establishmentName: establishmentName,
                limitingPrice: matchingPromo.limitingPrice,
                discountAmount: matchingPromo.discountAmount,
                discountPercentage: matchingPromo.discountPercentage,
              });
            }
          } else {
            console.log(
              `No matching promo found for establishment id ${establishment.id}`
            );
          }
        });
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );

    this.establishments.subscribe((result) => {
      this.favouritEstablishments.subscribe((result2) => {
        result.forEach((establishment) => {
          result2.forEach((favourite) => {
            if (establishment.id == favourite) {
              if (this.favouriteStores.length) {
                let append = true;
                this.favouriteStores.forEach((favouriteStore) => {
                  if (favouriteStore.id == establishment.id) {
                    append = false;
                  }
                });
                if (append) {
                  this.favouriteStores.push(establishment);
                }
              } else {
                this.favouriteStores.push(establishment);
              }
            }
          });
        });
      });
    });
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // console.log(event);
        if (event.url === '/home') {
          this.subscription = this.platform.backButton.subscribeWithPriority(
            0,
            () => {
              console.log(navigator);
              navigator['app'].exitApp();
            }
          );
        } else {
          this.subscription.unsubscribe();
        }
      }
    });
  }
  // favourites$ = this.store.pipe(select(selectFavourites));

  // ngOnInit(): void {
  //   this.store.dispatch(invokeFavouritesAPI());
  // }

  public async getToken(): Promise<void> {
    let token;

    if (this.platform.is('android')) {
      token = await this.fcm.getToken();
      await this.pushNotificationResourceService.saveToken(token, 'android');
    }

    if (this.platform.is('ios')) {
      token = await this.fcm.getToken();
      await this.pushNotificationResourceService.saveToken(token, 'ios');
    }
  }

  public showAlertNotification(headerMsg: string, sub: string, msg: string) {
    this.alertCtrl
      .create({
        header: headerMsg,
        subHeader: sub,
        message: msg,
        buttons: ['Ok'],
      })
      .then((alert) => alert.present());
  }

  public async ionViewDidEnter(): Promise<void> {
    this.establishments.subscribe((establishments) => {
      if (
        this.sortedEstablishments.length < 3 ||
        !('menuItems' in establishments[0]) ||
        this.checkingPerimeter
      ) {
        this.theLoader = true;
      } else {
        this.theLoader = false;
      }
    });
    this._accountResourceService
      .getUserDetails()
      .then(async (res: UserRetrievalModel) => {
        this.user = res;
        this.orderProgress = this.user.orderProgress ? 'true' : 'false';
      })
      .catch((err: any) => {
        console.log(err);
        this.user = null;
        this.orderProgress = 'false';
      });
    console.log(this.establishments);
    this.establishments
      .pipe(
        withLatestFrom(this.loading),
        filter(
          ([establishments, loading]) => !loading && establishments.length > 0
        ),
        take(1)
      )
      .subscribe(([establishments]) => {
        if (!establishments.length) {
          this.ngOnInit();
        }
        if (!('menuItems' in establishments[0])) {
          establishments.forEach((establishment, i) => {
            // do something with each establishment
            // console.log(establishment);
            this.store
              .dispatch(new GetEstablishmentCategories(establishment?.id))
              .subscribe(() => {
                this.store
                  .dispatch(new GetEstablishmentMenuItems(establishment?.id))
                  .subscribe((result) => {
                    console.log(establishments, i);
                    if (i == establishments.length - 1) {
                      this.theLoader = false;
                    }
                  });
              });
          });
        }
      });
    combineLatest([this.establishments, this.selectedAddress])
      .pipe(
        map(([establishments, selectedAddress]) => {
          // Calculate distance and add it as a property to each establishment
          establishments.forEach((est) => {
            const checkpoint = {
              lat: Number(est.latitude),
              lng: Number(est.longitude),
            };
            const centerPoint = {
              lat: Number(selectedAddress?.latitude),
              lng: Number(selectedAddress?.longitude),
            };
            const distance = this.distanceCalculatorResourceService.getDistance(
              checkpoint.lat,
              checkpoint.lng,
              centerPoint.lat,
              centerPoint.lng
            );
            // const distance2 =  this.000distanceCalculatorResourceService.getDistance2(est.address, selectedAddress.address)
            this.mapsAPILoader.load().then(() => {
              const origin = new google.maps.LatLng(
                parseFloat(est.latitude),
                parseFloat(est.longitude)
              );
              const destination = selectedAddress
                ? new google.maps.LatLng(
                    parseFloat(selectedAddress.latitude),
                    parseFloat(selectedAddress.longitude)
                  )
                : new google.maps.LatLng(
                    parseFloat(localStorage.getItem('userLat')),
                    parseFloat(localStorage.getItem('userLong'))
                  );
              const service = new google.maps.DirectionsService();
              service.route(
                {
                  origin: origin,
                  destination: destination,
                  travelMode: google.maps.TravelMode.DRIVING,
                },
                (response, status) => {
                  if (status === 'OK') {
                    // console.log(response.routes[0].legs[0].distance.text.split(" "))
                    est.distance = parseInt(
                      response.routes[0].legs[0].distance.text.split(' ')[0]
                    );
                  }
                }
              );
            });
            // est.distance = distance;
          });

          // Sort establishments based on distance
          return establishments.slice().sort((a, b) => a.distance - b.distance);
        })
      )
      .subscribe((sortedEstablishments) => {
        // Update this.establishments with the sorted data
        this.sortedEstablishments = sortedEstablishments;
        this.checkInPerimeter();
      });

    // console.log(this.sortedEstablishments)

    // console.log(this.theLoader);
    // await this.checkDriversOnline()
    this.delivery = await this._orderService.getDeliveryDetails();
    // this.UnavailableModalPresented = false;
    if (this.orderProgress == 'true') {
      this.subscriptions = interval(500)
        .pipe(
          takeWhile(
            () =>
              this.delivery.orderStatus !== 'DELIVERED' &&
              this.delivery.deliveryStatus !== 'COMPLETE'
          ),
          switchMap(async () => {
            this.delivery = await this._orderService.getDeliveryDetails();
            this.orderStatus = this.delivery.orderStatus;

            if (this.delivery.orderStatus === 'READY_FOR_PICK_UP') {
              return interval(500).pipe(
                takeWhile(() => this.delivery.deliveryStatus !== 'ON_ROUTE'),
                switchMap(async () => {
                  await this._router.navigate(['/location-tracking-page']);
                  return this._orderService.getDeliveryDetails();
                })
              );
            }
            //  else if (this.delivery.deliveryStatus === 'ON_ROUTE') {
            //   await this._router.navigate(['/location-tracking-page']);
            //   return this._orderService.getDeliveryDetails();
            // }
            else if (this.delivery.orderStatus === 'USER_PICK_UP_READY') {
              return interval(500).pipe(
                takeWhile(() => this.delivery.deliveryStatus !== 'COLLECTED'),
                tap(async () => {
                  await this._orderService.orderCollectedStatus();
                  this.delivery = await this._orderService.getCollectDetails();
                }),
                filter(() => this.delivery.deliveryStatus !== 'COLLECTED')
              );
            } else {
              if (this.delivery.deliveryStatus === 'COLLECTED') {
                await this.setOpen(false);
                await this._orderService.orderCollectedStatus();
                this._store.dispatch(new ClearCart());
                await this._router.navigate(['/home']);
              }
              if (this.delivery.deliveryStatus === null) {
                this.subscriptions.unsubscribe();
              }
              return of();
            }
          })
        )
        .subscribe(
          () => {},
          () => {},
          async () => {
            this.subscriptions.unsubscribe();
          }
        );

      if (
        this.delivery.deliveryStatus === 'COMPLETE' ||
        this.delivery.deliveryStatus === 'DELIVERED'
      ) {
        this.subscriptions.unsubscribe();
      }
    }


    if (this.user) {
      localStorage.setItem('userId', this.user.id.toString());
    }

    try {
      this.driversOnline = await this._driverService.getDriversOnline();

      this._accountResourceService.getUserDetails().then((result: UserRetrievalModel) => {
        localStorage.setItem('userFullName', result.fullName);
        localStorage.setItem('userEmail', result.emailAddress);
        localStorage.setItem('userPromoUsed', result.promoUsed ? 'T' : 'F');
        this.user = result;
        this.orderProgress = this.user.orderProgress ? 'true' : 'false';
      });

      this.categories = await this._categoryService.getAll();
    } catch (error) {
      console.warn(error);
    }

    if (!this.driversOnline.length) {
      let checkDrivers = interval(100).subscribe(async () => {
        this.driversOnline = await this._driverService.getDriversOnline();
        if (this.driversOnline.length) {
          checkDrivers.unsubscribe();
        }
      });
    }

    // console.log(this._promoService.getAllActivated());
  }

  public checkInPerimeter() {
    this.checkingPerimeter = true;
    if (this.user) {
      let addressString = this.user
        ? this.user?.address
        : localStorage.getItem('userMarkerLabel');
      let splitAddress = addressString.split(',');
      let streetName = splitAddress[0].trim();
      this.userAddress = streetName;
    } else {
      let splitAddress = this.user
        ? this.user?.address
        : localStorage.getItem('userMarkerLabel');
      this.userAddress = splitAddress;
    }

    this.UnavailableModalPresented = false;
    // console.log(this.selectedAddress);
    // console.log(this.user, this.userAddress);
    // this.addresses.subscribe((res) => {
    //   console.log(res);
    // });

    // this.selectedAddress = this.address
    if (this.user) {
      this.selectedAddress.subscribe((result) => {
        // console.log(result);
        // this.establishments.subscribe( (res) => {
        let establishments = [];

        this.sortedEstablishments.forEach((establishment, i) => {
          // console.log(establishment);
          // console.log('does this show');

          let checkpoint = {
            lat: Number(establishment.latitude),
            lng: Number(establishment.longitude),
          };
          // console.log('what about this');

          const centerPoint = {
            lat:
              result?.latitude === null ? Number(result?.latitude) : -33.9908,
            lng:
              result?.longitude === null ? Number(result?.longitude) : 18.4654,
          };

          // console.log(centerPoint, checkpoint);
          let inPerimeter = 0;

          // inPerimeter = await this.distanceCalculatorResourceService.getDistance2(establishment.address,this.user.address)

          // console.log(inPerimeter);
          this.mapsAPILoader.load().then(() => {
            this.establishmentIdsNearYou = [];
            this.sortedEstablishmentsFinal = [];
            const origin = new google.maps.LatLng(
              parseFloat(result.latitude),
              parseFloat(result.longitude)
            );
            const destination = new google.maps.LatLng(
              parseFloat(establishment.latitude),
              parseFloat(establishment.longitude)
            );
            const service = new google.maps.DirectionsService();
            service.route(
              {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
              },
              async (response, status) => {
                if (status === 'OK') {
                  console.log(
                    parseInt(
                      response.routes[0].legs[0].distance.text.split(' ')[0]
                    ),
                    establishment.establishmentName
                  );
                  this.inPerimeter = parseInt(
                    response.routes[0].legs[0].distance.text.split(' ')[0]
                  );
                  console.log(
                    this.inPerimeter,
                    establishment.establishmentName
                  );
                  if (result) {
                    if (result.address == 'Current Location') {
                      this.userAddress = localStorage.getItem('userAddress');
                    } else {
                      this.userAddress = result.address;
                    }
                  }

                  if (
                    this.inPerimeter < 4 &&
                    (!this.establishmentIdsNearYou.filter(
                      (est) => est.id == establishment.id
                    ).length ||
                      !this.establishmentIdsNearYou.length)
                  ) {
                    this.establishmentIdsNearYou.push(establishment);
                    console.log(
                      'establishmentsINperimeter',
                      this.establishmentIdsNearYou,
                      this.theLoader
                    );
                  } else if (
                    this.inPerimeter > 4 &&
                    this.establishmentIdsNearYou.filter(
                      (est) => est.id == establishment.id
                    ).length
                  ) {
                    this.establishmentIdsNearYou =
                      this.establishmentIdsNearYou.filter(
                        (est) => est.id != establishment.id
                      );
                  }

                  if (
                    this.inPerimeter < 16 &&
                    (!this.sortedEstablishmentsFinal.filter(
                      (est) => est.id == establishment.id
                    ).length ||
                      !this.sortedEstablishmentsFinal.length)
                  ) {
                    this.sortedEstablishmentsFinal.push(establishment);
                  } else if (
                    this.inPerimeter >= 16 &&
                    this.sortedEstablishmentsFinal.filter(
                      (est) => est.id == establishment.id
                    ).length
                  ) {
                    this.sortedEstablishmentsFinal =
                      this.sortedEstablishmentsFinal.filter(
                        (est) => est.id != establishment.id
                      );
                  }

                  if (
                    i === this.sortedEstablishments?.length - 1 &&
                    !this.sortedEstablishmentsFinal.length &&
                    !this.UnavailableModalPresented
                  ) {
                    // console.log(res);
                    this.checkingPerimeter = false;
                    !this.UnavailableModalPresented
                      ? await this.presentUnavailableModal()
                      : console.log('not working');

                    this.UnavailableModalPresented = true;
                  } else if (i === this.sortedEstablishments?.length - 1) {
                    this.checkingPerimeter = false;
                  }
                }
              }
            );
          });

          console.log(this.inPerimeter);
        });
        // });
      });
    } else {
      this.selectedAddress.subscribe((result) => {
        console.log(result);
        // this.establishments.subscribe( (res) => {
        let establishments = [];

        this.sortedEstablishments.forEach((establishment, i) => {
          console.log(establishment);
          console.log('does this show');

          let checkpoint = {
            lat: Number(establishment.latitude),
            lng: Number(establishment.longitude),
          };
          console.log('what about this');

          const centerPoint = {
            lat:
              result?.latitude === null ? Number(result?.latitude) : -33.9908,
            lng:
              result?.longitude === null ? Number(result?.longitude) : 18.4654,
          };

          console.log(centerPoint, checkpoint);
          let inPerimeter = 0;

          // inPerimeter = await this.distanceCalculatorResourceService.getDistance2(establishment.address,this.user.address)

          console.log(inPerimeter);
          this.mapsAPILoader.load().then(() => {
            this.establishmentIdsNearYou = [];
            this.sortedEstablishmentsFinal = [];
            const origin = new google.maps.LatLng(
              parseFloat(result.latitude),
              parseFloat(result.longitude)
            );
            const destination = new google.maps.LatLng(
              parseFloat(establishment.latitude),
              parseFloat(establishment.longitude)
            );
            const service = new google.maps.DirectionsService();
            service.route(
              {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
              },
              async (response, status) => {
                if (status === 'OK') {
                  console.log(
                    parseInt(
                      response.routes[0].legs[0].distance.text.split(' ')[0]
                    )
                  );
                  this.inPerimeter = parseInt(
                    response.routes[0].legs[0].distance.text.split(' ')[0]
                  );
                  console.log(this.inPerimeter);
                  if (result) {
                    if (result.address == 'Current Location') {
                      this.userAddress = localStorage.getItem('userAddress');
                    } else {
                      this.userAddress = result.address;
                    }
                  }

                  if (
                    this.inPerimeter < 4 &&
                    (!this.establishmentIdsNearYou.filter(
                      (est) => est.id == establishment.id
                    ).length ||
                      !this.establishmentIdsNearYou.length)
                  ) {
                    this.establishmentIdsNearYou.push(establishment);
                    console.log(
                      'establishmentsINperimeter',
                      this.establishmentIdsNearYou,
                      this.theLoader
                    );
                  } else if (
                    this.inPerimeter > 4 &&
                    this.establishmentIdsNearYou.filter(
                      (est) => est.id == establishment.id
                    ).length
                  ) {
                    this.establishmentIdsNearYou =
                      this.establishmentIdsNearYou.filter(
                        (est) => est.id != establishment.id
                      );
                  }

                  if (
                    this.inPerimeter < 16 &&
                    (!this.sortedEstablishmentsFinal.filter(
                      (est) => est.id == establishment.id
                    ).length ||
                      !this.sortedEstablishmentsFinal.length)
                  ) {
                    this.sortedEstablishmentsFinal.push(establishment);
                  } else if (
                    this.inPerimeter >= 16 &&
                    this.sortedEstablishmentsFinal.filter(
                      (est) => est.id == establishment.id
                    ).length
                  ) {
                    this.sortedEstablishmentsFinal =
                      this.sortedEstablishmentsFinal.filter(
                        (est) => est.id != establishment.id
                      );
                  }

                  if (
                    i === this.sortedEstablishments?.length - 1 &&
                    !this.sortedEstablishmentsFinal.length &&
                    !this.UnavailableModalPresented
                  ) {
                    // console.log(res);
                    !this.UnavailableModalPresented
                      ? await this.presentUnavailableModal()
                      : console.log('not working');

                    this.UnavailableModalPresented = true;
                  } else if (i === this.sortedEstablishments?.length - 1) {
                    this.theLoader = false;
                  }
                }
              }
            );
          });

          console.log(this.inPerimeter);
        });
        // });
      });

      console.log(this.sortedEstablishments, 'OPDAPOSKDPAS');
      console.log(this.sortedEstablishmentsFinal, '111111woo1mwom');
    }
    
  }

  public async checkDriversOnline() {
    console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
    this.UnavailableaModalDriverPresent = false;

    this.driversOnline = await this._driverService.getDriversOnline();

    if (this.driversOnline.length < 1) {
      !this.UnavailableaModalDriverPresent
        ? await this.presentDriversNotAvailable()
        : console.log('this no work mahn');
      this.UnavailableaModalDriverPresent = true;
    }
  }

  async presentUnavailableModal() {
    this.UnavailableModalPresented = true;
    const modal = await this.modalController.create({
      component: CurrentlyUnavailableComponent,
      cssClass: '.form-content-account',
      componentProps: {
        location: this.userAddress,
      },
    });
    return await modal.present();
  }

  async presentDriversNotAvailable() {
    this.UnavailableaModalDriverPresent = true;
    const modal = await this.modalController.create({
      component: NoDriversAvailableComponent,
      cssClass: '.form-content-account',
      componentProps: {
        location: this.userAddress,
      },
    });
  }

  public async seeEstablishmentMenu(
    establishmentName: string,
    id: string | number,
    establishmentLogo: string,
    estLat: string,
    estLong: string
  ): Promise<void> {
    this.setOpen(false).then(() => {
      this.store.dispatch(new SetSelectedEstablishment(id)).subscribe((res) => {
        if (res) {
          this._router.navigate(['/restaurant/details']);
        } else {
        }
      });
    });
    localStorage.setItem('establishmentName', establishmentName);
    localStorage.setItem('establishmentId', id);
    localStorage.setItem('establishmentLogo', establishmentLogo);
    localStorage.setItem('estLat', estLat);
    localStorage.setItem('estLong', estLong);
  }

  public async alertMessage(msg: string): Promise<void> {
    const alert = await this._alertController.create({
      cssClass: 'custom-alert',
      header: 'Error',
      message: msg,
      buttons: [
        {
          text: 'OK',
          cssClass: 'btn-primary',
          handler: async () => {
            await this._router.navigate(['/checkout']);
          },
        },
      ],
    });

    await alert.present();
  }

  public async openLocationModal() {
    const modal = await this.modalController.create({
      component: LocationOptionsPage,
      cssClass: 'small-modal',
    });

    modal.onDidDismiss().then(() => {
      this.userAddress = localStorage.getItem('userAddress');
      this.ionViewDidEnter();
      // Here's your selected user!
    });
    return await modal.present();
  }

  public getTimeToPlace(establishmentLat: string, establishmentLong: string) {
    const lat = this.user ? Number(this.user?.latitude) : -33.9908;
    const lon = this.user ? Number(this.user?.longitude) : 18.4529;
    let distance = this.distanceCalculatorResourceService.getDistance(
      Number(establishmentLat),
      Number(establishmentLong),
      lat,
      lon
    );
    const time = Number(distance) / 40;
    return Math.round(time * 60);
  }

  // @ts-ignore
  private async notificationSetup(data) {
    if (data.wasTapped) {
      await this.showAlertNotification(data.title, '', data.body);
      this.localNotifications.schedule({
        id: data.id,
        text: data.body,
        title: data.title,
        foreground: true,
        lockscreen: true,
      });
    } else {
      await this.showAlertNotification(data.title, '', data.body);
      this.localNotifications.schedule({
        id: data.id,
        text: data.body,
        title: data.title,
        foreground: true,
        lockscreen: true,
      });
    }
  }

  getTimeNow() {
    this.timeNow =
      (new Date().getHours() < 10 ? '0' : '') +
      (new Date().getHours() > 12
        ? new Date().getHours() - 12
        : new Date().getHours()) +
      ':' +
      (new Date().getMinutes() < 10 ? '0' : '') +
      new Date().getMinutes() +
      ':' +
      (new Date().getSeconds() < 10 ? '0' : '') +
      new Date().getSeconds() +
      (new Date().getHours() > 12 ? 'PM' : 'AM');
    console.log(this.timeNow);
  }

  // To go to the the establishment page through the promos at the top
  async handlePromo(promo: { establishmentId: number | null; }) {
    if (promo.establishmentId === null) {
    }
    //
    const establishment = await this._establishmentService.getEstablishment(
      promo.establishmentId
    );
    await this.seeEstablishmentMenu(
      establishment.establishmentName,
      promo.establishmentId,
      establishment.logo,
      establishment.latitude,
      establishment.longitude
    );
  }
  // To add the promo banner on the image
  public seePromo(establishmentId: number) {
    let res = false;

    // Checks if the promo establishment Id is equal to establishment Id argument
    this.promos.subscribe((result) => {
      result.forEach((promo) => {
        //  changes res value to true if condition matches

        if (promo.establishmentId === establishmentId) {
          res = true;
        }
      });
    });

    return res;
  }
  // function to display promo type on the mini banner on a restuarant
  getPromoType(establishmentId: any): string {
    const promoStore = this.promoStores.find((ps) => ps.id === establishmentId);
    // console.log(promoStore);
    // check if its null or undefined
    if (!promoStore) {
      return '';
    } else if (promoStore.promoType === '') {
      // checks promotype and changes the name on the banner to remove all underscores
      return '';
    } else if (
      promoStore.promoType === 'EST GEN' ||
      promoStore.promoType === 'GENERAL'
    ) {
      return 'PROMOTION';
    } else if (promoStore.promoType === 'TWO FOR ONE') {
      return 'Two For One';
    } else if (promoStore.promoType === 'BUY ONE GET ONE FREE') {
      return 'Buy 1 Get 1 Free';
    } else {
      // Handle other promo types here
      return '';
    }
  }

  setPromoText(promoId: any): string {
    // console.log(this.promoStores, promoId);
    const promoStore = this.promoStores.find((ps) => ps.promoId === promoId);
    // console.log(promoStore, this.promoStores);
    // console.log("OOPS", promoId)
    if (!promoStore) {
      return '';
    } else if (promoStore.promoType === '') {
      // checks promotype and changes the name on the banner to remove all underscores
      return '';
    } else if (
      promoStore.promoType === 'EST GEN' ||
      promoStore.promoType === 'GENERAL' ||
      promoStore.promoType === 'CAT GEN'
    ) {
      return `
      <img src="${promoStore.establishmentLogo}">
      <span class="promo-establishment">${promoStore.establishmentName}</span> has an offer for you. <br>
      <span class="promo-discount" style="font-weight: 500; font-size: 18px;">R${promoStore.discountAmount} OFF</span> your next order
      `;
    } else if (promoStore.promoType === 'TWO FOR_ONE') {
      return `
      <span class="promo-establishment">${promoStore.establishmentName}</span> has an offer for you. <br>
      Two For One special on their item
      `;
    } else if (promoStore.promoType === 'BUY ONE GET ONE FREE') {
      return `
      <span class="promo-establishment">${promoStore.establishmentName}</span> has an offer for you. <br>
      Buy 1 Get 1 Free special on their item
      `;
    } else {
      // Handle other promo types here
      return '';
    }
  }

  public async setCurrentAddress() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.getAddress(this.lat, this.lng);
      });
    }
  }

  private getAddress(latitude: number, longitude: number) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      async (results: { formatted_address: { toString: () => string; }; }[], status: string) => {
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 12;
            this.address = results[0];
            this.searchTerm = results[0].formatted_address.toString();
            localStorage.setItem('userLat', this.lat.toString());
            localStorage.setItem('userLong', this.lng.toString());
            localStorage.setItem(
              'userAddress',
              results[0].formatted_address.toString()
            );
            // this.setCoords({ lat: this.lat, lng: this.lng}, this.searchTerm)
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  public seeEst(est: { name: any; id: any; logo: any; latitude: any; longitude: any; }) {
    this.modalController.dismiss();
    this.seeEstablishmentMenu(
      est.name,
      est.id,
      est.logo,
      est.latitude,
      est.longitude
    );
  }

  public clearFoodTypeFilter() {
    this.foodTypeFilter = null;
  }

  public setFoodType(foodType: string) {
    this.foodTypeFilter = foodType;
    this.setOpen(false);
  }

  // function returns a boolean and checks whether a restaurant is online or offline

  public checkOnline(openingTime: string, closingTime: string): boolean {
    const now = new Date();
    const opening = this.parseTime(openingTime);
    const closing = this.parseTime(closingTime);

    return now >= opening && now <= closing;
  }

  public checkOnlineText(openingTime: string, closingTime: string): string {
    const now = new Date();
    const opening = this.parseTime(openingTime);
    const closing = this.parseTime(closingTime);
    let msg = '';

    if (now >= opening || now <= closing) {
      msg = 'Opens at: ' + openingTime;
    } else {
      msg = '';
    }
    return msg;
  }
  // taking a string and converting it to time and returning the time
  // used to change the openingTime and closingTime variables which are stored as strings
  public parseTime(timeString: string): Date {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours, 10));
    time.setMinutes(parseInt(minutes, 10));
    time.setSeconds(0);
    time.setMilliseconds(0);
    return time;
  }

  public async goToOrderStatus() {
    this.subscriptions.unsubscribe();
    await this._router.navigate(['/order-status']);
  }

  public getSuburb(address: string): string {
    let addressString = address;
    let splitAddress = addressString.split(',');
    let surburbName = splitAddress[1].trim();

    return surburbName.toUpperCase();
  }
}
