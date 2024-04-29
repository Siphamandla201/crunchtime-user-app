import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DriverLocationModel} from "../models/driver-location.model";
import { DriverDetailsRetrievalModel } from '../models/driver-details-retrieval.model';

@Injectable({
  providedIn: 'root'
})
export class DriverResourceService {
  private readonly _resourceUrl: string = environment.serverApiUrl + '/driver';

  public constructor(
    private readonly _http: HttpClient,
  ) {}

  public async getDriverLocation(id: number) {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
      if(!authToken) {
        throw new Error('JWT token not found in local storage.');
      }
      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };
      return await this._http.get<DriverLocationModel>(this._resourceUrl + '/location/' + id, options).toPromise();
    } catch(e) {
      console.warn(e)
      throw e
    }
  }

  public async getDriversOnline() {
    try {
      // const authToken: string = localStorage.getItem('jwtToken');
      // const options = {
      //   headers: new HttpHeaders({
      //     Authorization: authToken
      //   })
      // };
      return await this._http.get<DriverDetailsRetrievalModel[]>(this._resourceUrl + '/online').toPromise();
    } catch(e) {
      console.warn(e)
      throw e
    }
  }
}
