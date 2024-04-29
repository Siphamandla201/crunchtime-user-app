import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Addresses} from "../models/addresses.model";
import {ErrorDetails} from "../models/error-details";
import {PartialEntityModel} from "../models/partial-entity.model";
import {IInstructionsModel} from "../models/instructions.model";
import { AddressesRetrieval } from '../models/addresses-retrieval.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {
  private readonly _resourceUrl: string = environment.serverApiUrl;
  constructor(
    private readonly _http: HttpClient,
  ) {}

  public getAddresses(): Observable<Array<AddressesRetrieval>> {
    try {
      const authToken: string | null= localStorage.getItem('jwtToken');
      if (!authToken) {
        throw new Error('JWT token not found in local storage.');
      }
      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };

      return this
        ._http
        .get<Array<AddressesRetrieval>>(this._resourceUrl + '/addresses',options)
    } catch (error: any) {
      if (error && error instanceof ProgressEvent) {
        throw new ErrorDetails('A connection could not be established. Please contact an administrator.',
          'Contact Administrator', '', undefined);
      }
      throw new ErrorDetails(error.error.detail, error.error.title || error.error.detail,
        error.error.status, error.error.timeStamp);
    }
  }

  public async addAddress(address: Addresses) {
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
        return this._http.post<AddressesRetrieval[]>(this._resourceUrl + '/add/address', address, options).toPromise();
    } catch (e) {
        console.warn(e);
        throw e; // Re-throw the error to propagate it further
    }
  }

}


  // public async removeAddress(id: number) {
  //   try {
  //     const authToken: string = localStorage.getItem('jwtToken');
  //     const options = {
  //       headers: new HttpHeaders({
  //         Authorization: authToken
  //       })
  //     };
  //     return this._http.put<any>(this._resourceUrl + '/order/'+ id +'/remove', null, options);
  //   } catch(e) {
  //     console.warn(e)
  //   }
  // }

