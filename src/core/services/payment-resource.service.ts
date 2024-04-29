import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ErrorDetails} from "../models/error-details";
import {environment} from "../../environments/environment";
import {PeachPaymentInitialResponseModel} from "../models/peach-payment-initial-response.model";

@Injectable({
  providedIn: 'root'
})
export class PaymentResourceService {
  private readonly _resourceUrl: string = environment.serverApiUrl;
  constructor(
    private readonly _http: HttpClient
  ) {}

  public async getCheckoutId(): Promise<PeachPaymentInitialResponseModel> {
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
  
      const response = await this._http.get<PeachPaymentInitialResponseModel>(this._resourceUrl + '/payments/initial', options).toPromise();
      // Check if response is undefined
      if (!response) {
        throw new Error('No data received from server');
      }
  
      return response;
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
