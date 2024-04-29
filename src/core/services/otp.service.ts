import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { PartialEntityModel } from "../models/partial-entity.model";
import { plainToClass } from "class-transformer";

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private readonly _resourceUrl: string = environment.serverApiUrl + '/otp';

  public constructor(private readonly _http: HttpClient) {}

  public async sendOtpRequest(email: string): Promise<void> {
    try {
      await this._http.put<string>(this._resourceUrl + '/send/' + email, {}).toPromise();
    } catch (err) {
      console.warn('Error in sendOtpRequest() ', err);
    }

  }

  public async sendDeliveryOtpRequest(deliveryId: number): Promise<void> {
    try {
      await this._http.put<string>(this._resourceUrl + '/sendDeliveryOTP/' + deliveryId.toString(), {}).toPromise();
    } catch (err) {
      console.warn('Error in sendOtpRequest() ', err);
    }

  }
  
  public async activateAccount(id: string): Promise<void> {
    try {
      await this._http.put<string>(environment.serverApiUrl + '/users/' + id + '/activate', {}).toPromise();
    } catch (err) {
      console.warn('Error in sendOtpRequest() ', err);
    }
  }

  public async sendOtpForgetPasswordRequest(email: string): Promise<void> {
    try {
      await this._http.put<string>(this._resourceUrl + '/send/' + email + '/password-reset', {}).toPromise();
    } catch (err) {
      console.warn('Error in sendOtpRequest() ', err);
    }
  }


  public async verifyOtpRequest(pin: string, email: string): Promise<PartialEntityModel> {
    try {
      const response = await this._http.get<string>(this._resourceUrl + '/' + email + '/verify/' + pin, {}).toPromise();
      return plainToClass(PartialEntityModel, response);
    } catch (err) {
      console.warn('Error in verifyOtpRequest() ', err);
      throw err
    }
  }

}