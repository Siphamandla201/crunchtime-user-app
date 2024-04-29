import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, IonRouterOutlet, ModalController, Platform } from '@ionic/angular';
import { Select, Selector, Store } from '@ngxs/store';
import { interval, Observable, Subscription } from 'rxjs';
import { DriverDetailsRetrievalModel } from 'src/core/models/driver-details-retrieval.model';
import { IEstablishmentRetrievalModel } from 'src/core/models/establishment-retrieval.model';
import { FavouritesRetrievalModel } from 'src/core/models/favourites-retrieval.model';
import { IMenuItemsModel } from 'src/core/models/menu-items.model';
import { OrderItemsModel } from 'src/core/models/order-items.model';
import { AccountResourceService } from 'src/core/services/account-resource.service';
import { DriverResourceService } from 'src/core/services/driver-resource.service';
import { AddToCart, GetCartItems } from 'src/core/store/actions/cart.action';
import { AddFavourite, DeleteFavourite } from 'src/core/store/actions/favourites.action';
import { SetSelectedAddOns } from 'src/core/store/actions/menuItems.action';
import { CartState } from 'src/core/store/states/cart.state';
import { EstablishmentState } from 'src/core/store/states/establishments.state';
import { FavouriteState } from 'src/core/store/states/favourites.state';
import { MenuItemsState } from 'src/core/store/states/menuItems.state';
import { UserRetrievalModel } from '../../core/models/user-retrieval.model';

@Component({
  selector: 'app-single-munu-item',
  templateUrl: './single-munu-item.component.html',
  styleUrls: ['./single-munu-item.component.scss'],
})
export class SingleMunuItemComponent implements OnInit {
  @Select(MenuItemsState.getSelectedAddOns)
  public selectedAddons!: Observable<IMenuItemsModel[]>;
  @Select(CartState.getCartItems)
  public cartItems!: Observable<OrderItemsModel[]>;
  @Select(FavouriteState.getFavourites)
  public favourites!: Observable<FavouritesRetrievalModel[]>;
  @Select(EstablishmentState.getSelectedEstablishment)
  public establishment!: Observable<IEstablishmentRetrievalModel>;
  @ViewChild("header2")
  header!: HTMLElement;
  public addons: any[] = [];
  public groupAddons: any[] = [];
  public totalPrice!: number;
  public form: FormGroup;
  public driversOnline!: Array<DriverDetailsRetrievalModel>;
  public quantityToAdd: number = 1;
  public token: string = localStorage.getItem('jwtToken') as string;
  private subscription!: Subscription;
  
  @Input()
  public category: any;
  @Input()
  public menuItem: any;
  
  @Output()
  public dismissed: EventEmitter<any> = new EventEmitter<any>();
  user!: import("../../core/models/user-retrieval.model").UserRetrievalModel;
  constructor(
    public element: ElementRef, 
    public renderer: Renderer2,
    public modalController: ModalController,
    private _store: Store,
    private _fb: FormBuilder,
    private readonly _driverService: DriverResourceService,
    private readonly _alertController: AlertController,
    private readonly _accountResourceService: AccountResourceService,
    private readonly platform: Platform,
    private readonly _router: Router,
    private readonly routerOutlet: IonRouterOutlet
    ) {
      this.form = this._fb.group({})
      

      this.platform.backButton.subscribeWithPriority(10, async ()=> {
        console.log("Button Pressed")
        if(await this.modalController.getTop()) {
          const modal = await this.modalController.getTop()
          if (modal) {
            console.log("monkey")
            return;
          } else {
            console.log("hi MNSDISDINSDISNDISNDISDN")
          }
        } else {
          console.log("HIYYYYYYYYYYYYYYYYAAAAAAAAAAAAAAAAAAA!@(!)@I!@*(!@128127812")
        }

        return;
      })
     }

     async ngOnInit() {
      this.createControls(this.menuItem.groupAddons);
      this.createControls(this.menuItem.addons);
      
      // Using subscribe instead of then for getUserDetails()
      this._accountResourceService.getUserDetails().subscribe((res: UserRetrievalModel) => {
          this.user = res;
      }, (err: any) => {
          console.log(err);
          this.user = null!;
      });
  
      try {
          this.driversOnline = await this._driverService.getDriversOnline() || []; // Providing a default value if driversOnline is undefined
      } catch (error) {
          console.log(error);
          this.driversOnline = []; // Providing a default value in case of error
      }
  
      this.totalPrice = this.menuItem.foodPrice;
      console.log('whats going on here', this.category);
      console.log(this.groupAddons);
      console.log(this.addons);
  
      // Checking if favourited is not null before accessing its properties
      this.favourites.subscribe(result => {
          result.forEach(item => {
              let favourited = document.querySelector('#favourited');
              if (favourited && item.itemId == this.menuItem.id) { // Checking if favourited is not null
                  favourited.classList.add('show');
                  favourited.classList.remove('dontShow');
              }
          });
      });
  
      this.platform.backButton.subscribeWithPriority(10, async () => {
          console.log("Button Pressed");
          if (await this.modalController.getTop()) {
              const modal = await this.modalController.getTop();
              if (modal) {
                  console.log("EISH");
                  return;
              } else {
                  console.log("OOFF");
              }
          } else {
              console.log("HIYAAA");
          }
  
          return;
      });
  }
  

  public createControls(controls: any[]){
    controls.forEach(control => {
      
      if(control.groupItems && !control.groupItems[0]?.chooseOne){
        control.groupItems.forEach((item: { addonRequired: any; foodName: any; }) => {
          const newFormControl = new FormControl()
          if(item.addonRequired){
            newFormControl.setValidators(Validators.required)
          }
          this.form.addControl(item.foodName, newFormControl)
          
        })
      }else if(control.groupItems && control.groupItems[0]?.chooseOne){
        const newFormControl = new FormControl()
        if(control.groupItems[0].addonRequired){
          newFormControl.setValidators(Validators.required)
        }
        this.form.addControl(control.addonName, newFormControl)
      }else{
        const newFormControl = new FormControl()
        if(control.addonRequired){
          newFormControl.setValidators(Validators.required)
        } 
  
        this.form.addControl(control.foodName, newFormControl)

      }

    })

    console.log('My form: ', this.form);
    
  }

  subOrderQuantityOnTap() {
    this.quantityToAdd -= 1
  }

  addOrderQuantityOnTap() {
    this.quantityToAdd += 1
  }

  //This function should update the price everytime an addon is selected
  public updatePrice(){
    // Reset the price to the menuItem price (minus all addons basically)
    this.totalPrice = this.menuItem.foodPrice
    // Get all values of selected items in form (ids of addons that were selected) by looping through the entries/inputs
    Object.entries(this.form.value).forEach(entry => {
      // Each input has a key and a value.
      // The key is the formControl Name.
      // If not selected (radio input in this case) then the value is null.
      const [key, value] = entry;
      console.log(key, value);
      // If it is selected, the value will be the id of the menuItem (or addon in this case)
      if(value){
        // Filter category data, get item with id that matches value and add item price to totalPrice
        this.totalPrice += this.category.data.filter((item: { id: {}; }) => item.id == value)[0].foodPrice;
      }
    })
  }

  public setAddon(id: number){
    (<HTMLInputElement>document.getElementById(id.toString())).checked = true
    this._store.dispatch(new SetSelectedAddOns(id))
    this.totalPrice = this.menuItem.foodPrice
    this.selectedAddons.subscribe(result => {
      result.forEach(item => {
        this.totalPrice += item.foodPrice
      })
    })
  }

  public onContentScroll(event: { detail: { scrollTop: number } }) {
    const ionHead2 = document.querySelector('.ionHead2') as HTMLElement | null;
    if (ionHead2) {
        if (event.detail.scrollTop <= 200) {
            ionHead2.style.opacity = '0';
        } else {
            ionHead2.style.opacity = '1';
        }
    }
}

async removeFavourite(id: number) {
    const favourited = document.querySelector('#favourited') as HTMLElement | null;
    if (favourited && !favourited.classList.contains('show')) {
        this.addFavourite(id);
    } else if (favourited) {
        this._store.dispatch(new DeleteFavourite(id));
        favourited.classList.remove('show');
        favourited.classList.add('dontShow');
    }
}


  async addFavourite(id: number){
    this._store.dispatch(new AddFavourite(id))
  }
  // public addToCart(){
  //   Object.entries(this.form.value).forEach(entry => {
  //     const [key, value] = entry;
  //     console.log(key, value);
  //   })
  // }

  public async addToCart(){
    if(this.user && !this.user.orderProgress){
      this._store.dispatch(new AddToCart(this.menuItem.id, 0, false)).subscribe( () => {
        let cartItemId: number | null = null;
        this.cartItems.subscribe(result => {
          let filteredResult = result.filter(item => item.itemId == this.menuItem.id)
          cartItemId = filteredResult[filteredResult.length -1].id
        })
        if(cartItemId){
          Object.entries(this.form.value).forEach(entry => {
            const [key, value] = entry;
            console.log(key, value);
            if(value){
              this._store.dispatch(new AddToCart(value, cartItemId!, false))
            }
          })
          cartItemId = null
        }
      })
    }
    
    if(this.user.orderProgress){
      await this.orderInProgressAlert()
    }
    this.dismissed.emit()
  }

  

  public async orderInProgressAlert(): Promise<void> {
    const alert = await this._alertController.create({
      cssClass: 'custom-alert',
      header: 'Order in Progress',
      message: 'You already have an order in progress.',
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

  dismiss() {
    const modalTop = this.modalController.getTop();

    
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  public  checkOnline(openingTime: any, closingTime: any): boolean {
    const now = new Date();
    const opening = this.parseTime(openingTime);
    const closing = this.parseTime(closingTime);

    return now >= opening && now <= closing;
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

}
