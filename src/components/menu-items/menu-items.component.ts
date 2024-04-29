import {Component, Input, OnInit} from '@angular/core';
import {MenuItemsService} from "../../core/services/menu-items.service";
import {Router} from "@angular/router";
import {AlertController, ModalController} from "@ionic/angular";
import {IMenuItemsModel} from "../../core/models/menu-items.model";
import {UserRetrievalModel} from "../../core/models/user-retrieval.model";
import {AccountResourceService} from "../../core/services/account-resource.service";
import { AddToCart } from 'src/core/store/actions/cart.action';
import { Select, Store } from '@ngxs/store';
import { MenuItemsState } from 'src/core/store/states/menuItems.state';
import { Observable } from 'rxjs';
import { SingleMunuItemComponent } from '../single-munu-item/single-munu-item.component';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss'],
})
export class MenuItemsComponent implements OnInit {
  @Input()
  public categoryId!: number;
  public menuItems!: Array<IMenuItemsModel>;
  public user: UserRetrievalModel | undefined;
  @Select(MenuItemsState.getSelectedCategory)
  public selectedCategory!: Observable<any>;
  @Select(MenuItemsState.getSelectedMenuItem)
  public selectedMenuItem!: Observable<any>;
  public menuItemSelected: any
  public categorySelected: any
  

  constructor(
    private readonly _menuItemService: MenuItemsService,
    private readonly _accountResourceService: AccountResourceService,
    private readonly _router: Router,
    private readonly _alertController: AlertController,
    private readonly _store: Store,
    public modalController: ModalController
  ) { }

  async ngOnInit() {
    let id = this.categoryId;
    try {
      this.menuItems = await this._menuItemService.getAllCategoryMenuItems(id)
      this._accountResourceService.getUserDetails().subscribe((user: UserRetrievalModel) => {
        this.user = user;
      });
    } catch (error) {
      console.warn(error)
    }

  }

  public async addItemCart(id: any, establishmentId: number, price: number): Promise<void> {
    try {
      const token = localStorage.getItem('jwtToken');
      if (token === null){
        await this.notLoggedIn('Please register or login to continue.');
      } else if(this.user?.latitude === '' || this.user?.longitude === ''){
        await this.alertMessage('Please enter your location before continuing.');
      } else{
        this._store.dispatch(new AddToCart(id, 0, false))
        // this._menuItemService.addFoodItemToCart(id).catch(error => {
        //   if(error.statusCode === 400){
        //     console.warn('status code' + error.statusCode)
        //     console.warn('code' + error.status)
        //     this.alertMessage(error.message);
        //   }
        // });
        localStorage.setItem('establishmentId', establishmentId.toString());
        localStorage.setItem('itemPrice', price.toString());
      }

    } catch (e) {
      console.warn('Error in addItemCart: ', e);
    }
  }

  public async setItemAndCategory(itemId: any, catId: any){
    console.log(itemId, catId);
    
    // this._store.dispatch(new SetSelectedMenuItem(parseInt(itemId), catId))
    // this.selectedCategory.subscribe(result => {
    //   this.categorySelected = result
    // })
    // this.selectedMenuItem.subscribe(result => {
    //   this.menuItemSelected = result
    // })
    // this.presentMenuItem()
  }

  async presentMenuItem() {
    const modal = await this.modalController.create({
      component: SingleMunuItemComponent,
      cssClass: '.form-content-account',
      componentProps: {
        'menuItem': this.menuItemSelected,
        'category': this.categorySelected
      }
    });
    return await modal.present();
  }

  public async alertMessage(msg: string): Promise<void> {
    const alert = await this._alertController.create({
      cssClass: 'custom-alert',
      header: 'Error',
      message: msg,
      buttons: [
        {
          text: 'Select Location',
          cssClass: 'btn-primary',
          handler: async () => {
            await this._router.navigate(['/location-selection']);
          }
        }
      ]
    });

    await alert.present();
  }

  public async notLoggedIn(description: string): Promise<void> {
    const alert = await this._alertController.create({
      cssClass: 'custom-alert',
      header: 'No Access',
      message: description,
      buttons: [
        'Cancel',
        {
          text: 'OK',
          cssClass: 'btn-primary',
          handler: async () => {
            await this._router.navigate(['/welcome']);
          }
        }
      ]
    });

    await alert.present();
  }

}
