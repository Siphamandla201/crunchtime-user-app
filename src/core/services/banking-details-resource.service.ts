import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PartialEntityModel} from "../models/partial-entity.model";
import {plainToClass} from "class-transformer";
import {ErrorDetails} from "../models/error-details";
import {ICreateBankingDetailsModel} from "../models/i-create-banking-details.model";
import { PeachPaymentResponseModel } from '../models/peachpayment-response.model';
import { BankingRetrievalModel } from '../models/banking-details-retrieval.model';

@Injectable({
  providedIn: 'root'
})
export class BankingDetailsResourceService {
  private readonly _resourceUrl: string = environment.serverApiUrl;

  public constructor(
    private readonly _http: HttpClient
  ) {}

  public async addBankingDetails(bankingDetailsModel: ICreateBankingDetailsModel): Promise<PeachPaymentResponseModel> {
    try {
      const authToken: string | null= localStorage.getItem('jwtToken');
      if (authToken === null) {
        throw new Error('JWT token not found in local storage.');
      }
      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };
      const response = await this._http.post<ICreateBankingDetailsModel>(this._resourceUrl + '/banking-details/add', bankingDetailsModel, options).toPromise();
      console.log(response)
      return plainToClass(PeachPaymentResponseModel, response);
    } catch (error: any) {
      console.log(error)
      if (error && error.error instanceof ProgressEvent) {
        throw new ErrorDetails('A connection could not be established. Please contact an administrator.');
      }
      throw plainToClass(ErrorDetails, error.error);
    }
  }

  public async editBankingDetails(bankingDetailsModel: ICreateBankingDetailsModel): Promise<PartialEntityModel> {
    try {
      const response = await this._http.put<ICreateBankingDetailsModel>(this._resourceUrl, bankingDetailsModel).toPromise();
      return plainToClass(PartialEntityModel, response);
    } catch (error: any) {
      if (error && error.error instanceof ProgressEvent) {
        throw new ErrorDetails('A connection could not be established. Please contact an administrator.');
      }
      throw plainToClass(ErrorDetails, error.error);
    }
  }

  public async getBankingDetails(): Promise<BankingRetrievalModel> {
    try {
      const authToken: string | null= localStorage.getItem('jwtToken');
      if (authToken === null) {
        throw new Error('JWT token not found in local storage.');
      }
      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };
      const response = await this._http.get<BankingRetrievalModel>(this._resourceUrl + "/banking-details", options).toPromise()
      if (!response) {
        throw new Error('Authentication failed.'); // Throw an error if the response is falsy
      }
      return response
    } catch (error: any) {
      if (error && error.error instanceof ProgressEvent) {
        throw new ErrorDetails('A connection could not be established. Please contact an administrator.');
      }
      throw plainToClass(ErrorDetails, error.error);
    }
  }

  public async getAllBankingDetails(): Promise<Array<BankingRetrievalModel>> {
    try {
      const authToken: string | null= localStorage.getItem('jwtToken');
      if (authToken === null) {
        throw new Error('JWT token not found in local storage.');
      }
      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };
      const response = await this._http.get<Array<BankingRetrievalModel>>(this._resourceUrl + "/banking-details/all", options).toPromise()
      if (!response) {
        throw new Error('Authentication failed.'); // Throw an error if the response is falsy
      }
      return response;
    } catch (error:any) {
      if (error && error.error instanceof ProgressEvent) {
        throw new ErrorDetails('A connection could not be established. Please contact an administrator.');
      }
      throw plainToClass(ErrorDetails, error.error);
    }
  }

  public async setSelectedBankingDetails(id: number): Promise<void> {
    try {
      const authToken: string | null= localStorage.getItem('jwtToken');
      if (authToken === null) {
        throw new Error('JWT token not found in local storage.');
      }
      console.log(authToken)
      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      }

      return await this._http.put<void>(this._resourceUrl + "/banking-details/selected/" + id, null, options).toPromise()
    } catch (error: any) {
      if (error && error.error instanceof ProgressEvent) {
        throw new ErrorDetails('A connection could not be established. Please contact an administrator.');
      }
      throw plainToClass(ErrorDetails, error.error);
    }
  }
}
