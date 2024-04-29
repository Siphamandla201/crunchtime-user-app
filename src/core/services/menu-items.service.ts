import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IMenuItemsModel} from "../models/menu-items.model";
import {ErrorDetails} from "../models/error-details";
import {PartialEntityModel} from "../models/partial-entity.model";
import {IInstructionsModel} from "../models/instructions.model";
import { OrderItemsModel } from '../models/order-items.model';
import { Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';

@Injectable({
  providedIn: 'root'
})
export class MenuItemsService {
  private readonly _resourceUrl: string = environment.serverApiUrl;
  constructor(
    private readonly _http: HttpClient,
  ) {}

  public getAllMenuItems(id: number): Observable<Array<IMenuItemsModel>> {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
      if(!authToken) {
        throw new Error('JWT Token not found in local storage')
      }
      // const options = {
      //   headers: new HttpHeaders({
      //     Authorization: authToken
      //   })
      // };

      return this
        ._http
        .get<Array<IMenuItemsModel>>(this._resourceUrl + '/establishments/' + id + '/menu-items')
    } catch (error: any) {
      if (error && error instanceof ProgressEvent) {
        throw new ErrorDetails('A connection could not be established. Please contact an administrator.',
          'Contact Administrator');
      }
      throw new ErrorDetails(error.error.detail, error.error.title || error.error.detail,
        error.error.status, error.error.timeStamp);
    }
  }

  public async getAllCategoryMenuItems(id: any): Promise<Array<IMenuItemsModel>> {
    try {
      const response = await this._http.get<Array<IMenuItemsModel>>(this._resourceUrl + '/category/' + id + '/menu-items')
        .toPromise();
      if (!Array.isArray(response)) {
      // Handle the case where response is not an array (e.g., single object)
      throw new Error('Response is not an array');
    }

      return plainToClass(IMenuItemsModel, response)
    } catch (error: any) {
      if (error && error instanceof ProgressEvent) {
        throw new ErrorDetails('A connection could not be established. Please contact an administrator.',
          'Contact Administrator');
      }
      throw new ErrorDetails(error.error.detail, error.error.title || error.error.detail,
        error.error.status, error.error.timeStamp);
    }
  }

  public getAllCategoryMenuItemsNew(id: any): Observable<Array<IMenuItemsModel>> {
    try {
      return this
        ._http
        .get<Array<IMenuItemsModel>>(this._resourceUrl + '/category/' + id + '/menu-items')
    } catch (error: any) {
      if (error && error instanceof ProgressEvent) {
        throw new ErrorDetails('A connection could not be established. Please contact an administrator.',
          'Contact Administrator');
      }
      throw new ErrorDetails(error.error.detail, error.error.title || error.error.detail,
        error.error.status, error.error.timeStamp);
    }
  }

  public async addFoodItemToCart(id: number, addonfor: any, increment: any) {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
      if(!authToken) {
        throw new Error('JWT Token not found in local storage')
      }
      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };
       return this._http.put<OrderItemsModel>(this._resourceUrl + '/order/'+ id +'/selected/' + addonfor +'/'+ increment, null, options);
    } catch(e) {
      console.warn(e)

      throw e
    }
  }

  public async addInstructions(id: number, instructions: IInstructionsModel) {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
      if(!authToken) {
        throw new Error('JWT Token not found in local storage')
      }
      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };
      return await this._http.post<PartialEntityModel>(this._resourceUrl + '/order/'+ id +'/instructions', instructions, options).toPromise();
    } catch(e) {
      console.warn(e)

      throw e
    }
  }

  public async removeFoodItemFromCart(id: number) {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
      if(!authToken) {
        throw new Error('JWT Token not found in local storage')
      }
      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };
      return this._http.put<any>(this._resourceUrl + '/order/'+ id +'/remove', null, options);
    } catch(e) {
      console.warn(e)

      throw e
    }
  }
}
