import {Component, Input, OnInit} from '@angular/core';
import {IMenuItemsModel} from "../../core/models/menu-items.model";
import {MenuItemsService} from "../../core/services/menu-items.service";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-establishment-menu-items',
  templateUrl: './establishment-menu-items.component.html',
  styleUrls: ['./establishment-menu-items.component.scss'],
})
export class EstablishmentMenuItemsComponent implements OnInit {
  @Input()
  public id!: number;
  public menuItems: Array<IMenuItemsModel> | undefined;

  constructor(
    private readonly _menuItemService: MenuItemsService,
    private readonly _router: Router,
    private readonly _alertController: AlertController
  ) { }

  async ngOnInit() {
    let id = this.id;

  }

  public async addItemCart(id: any, establishmentId: number, price: number): Promise<void> {
    try {
      localStorage.setItem('establishmentId', establishmentId.toString());
      localStorage.setItem('itemPrice', price.toString());
    } catch (e) {
      console.warn('Error in addItemCart: ', e);
    }
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
          }
        }
      ]
    });

    await alert.present();
  }

  public async menuDescription(description: any, menuItemName: any): Promise<void> {
    const alert = await this._alertController.create({
      cssClass: 'custom-alert',
      header: menuItemName,
      message: description,
      buttons: [
        {
          text: 'OK',
          cssClass: 'btn-primary',
          handler: async () => {
          }
        }
      ]
    });

    await alert.present();
  }

}
