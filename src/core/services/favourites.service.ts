import { Injectable } from '@angular/core';
import { environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { FavouritesRetrievalModel } from "../models/favourites-retrieval.model";
import { IMenuItemsModel } from "../models/menu-items.model";
import {ErrorDetails} from "../models/error-details";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {
  private readonly _resourceUrl: string = environment.serverApiUrl;
  constructor(
    private readonly _http: HttpClient
  ) {}

  public async addToFavourites(id: number) {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
      if (!authToken) {
        throw new Error('JWT token not found in local storage.');
      }
      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };

      return this._http.put<any>(this._resourceUrl + '/favourite/' + id + '/add', null, options)
    } catch(e) {
      console.warn(e)
      throw e
    }
  }

  public async removeFromFavourites(id: number) {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
      if (!authToken) {
        throw new Error('JWT token not found in local storage.');
      }
      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };

      return this._http.delete<any>(this._resourceUrl + '/favourite/' + id + '/remove', options);
    } catch(e) {
      console.warn(e)
      throw e
    }
  }

  public getFavourites(): Observable<FavouritesRetrievalModel[]> {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
      if (!authToken) {
        throw new Error('JWT token not found in local storage.');
      }
      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };
    return this._http.get<FavouritesRetrievalModel[]>(this._resourceUrl + '/favourites',options);
      } catch (error: any) {
        if (error && error instanceof ProgressEvent) {
          throw new ErrorDetails('A connection could not be established. Please contact an administrator.',
            'Contact Administrator', '', undefined);
        }
        throw new ErrorDetails(error.error.detail, error.error.title || error.error.detail,
          error.error.status, error.error.timeStamp);
      }
    }

}