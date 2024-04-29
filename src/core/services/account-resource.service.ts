import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
// import {HttpClient, HttpHeaders} from '@angular/common/http';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
// import { JwtService } from './services';
import { JwtService } from './jwt.service';
import { handleError } from "../handlers/error.handler";
import { IAccountCreationModel } from "../models/account-creation.model";
import { PartialEntityModel } from "../models/partial-entity.model";
import { IAccountVerificationModel } from "../models/account-verification.model";
import { ErrorDetails } from '../models/error-details';
import {UserLocationModel} from "../models/user-location.model";
import {IAccountUpdateModel} from "../models/account-update.model";
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";
import {UserRetrievalModel} from "../models/user-retrieval.model";
import {IPasswordResetModel} from "../models/password-reset.model";

@Injectable({
  providedIn: 'root'
})
export class AccountResourceService {
  // uploadProfilePicture(formData: FormData) {
  //   throw new Error('Method not implemented.');
  // }
  private readonly _resourceUrl: string = environment.serverApiUrl + '/users';

  public constructor(
    private readonly _http: HttpClient,
    private readonly _jwtService: JwtService,
    private readonly _localStorage: LocalStorageService,
    private readonly _sessionStorage: SessionStorageService
  ) {}

  private isNetworkError(error: any): boolean {
    return error && error.error instanceof ProgressEvent;
  }

  public async register(registerUser: IAccountCreationModel): Promise<PartialEntityModel> {
    try {
      const response = await this._http.post<IAccountCreationModel>(this._resourceUrl, registerUser).toPromise();
      return plainToClass(PartialEntityModel, response);
    } catch (error) {
      if (this.isNetworkError(error)) {
        throw new ErrorDetails('A connection could not be established. Please contact an administrator.');
      }
      throw plainToClass(ErrorDetails, (error as any).error);
    }
  }

  public async update(registerUser: IAccountUpdateModel): Promise<PartialEntityModel> {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
      if (authToken === null) {
        throw new Error('JWT token not found in local storage.');
      }

      const headers = authToken
      ? new HttpHeaders({
          Authorization: authToken
        })
      : undefined;
    
    const options = headers ? { headers } : {};

      const response = await this._http.put<IAccountUpdateModel>(this._resourceUrl, registerUser, options).toPromise();
      return plainToClass(PartialEntityModel, response);
    } catch (error) {
      if (this.isNetworkError(error)) {
        throw new ErrorDetails('A connection could not be established. Please contact an administrator.');
      }
      throw plainToClass(ErrorDetails, (error as any).error);
    }
  }

  public async verify(model: IAccountVerificationModel): Promise<void> {
    try {
      this._jwtService.clearLocalStorage();
      return this._http.put<void>(`${this._resourceUrl}/verify`, model).toPromise();
    } catch (error) {
      catchError(handleError);
    }
  }

  public async requestForgotPassword(email: string): Promise<PartialEntityModel> {
    try {
      this._jwtService.clearLocalStorage();
      const response = this._http
        .put<PartialEntityModel>(`${this._resourceUrl}/forgot-password`, { emailAddress: email })
        .toPromise();
      return plainToClass(PartialEntityModel, response);
    } catch (error) {
      console.error(error);
      throw error
    }
  }

  public async setLocation(model: UserLocationModel): Promise<PartialEntityModel> {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
      if (authToken === null) {
        throw new Error('JWT token not found in local storage.');
      }

      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };
      const response = this._http.put<UserLocationModel>(`${this._resourceUrl}/location`,model, options)
        .toPromise();

        console.log(response)
      return plainToClass(PartialEntityModel, response);
    } catch (error) {
      console.error(error);
      throw error
    }
  }

  public async getUserLocation() {
      const authToken: string | null = localStorage.getItem('jwtToken');
      if (authToken === null) {
        throw new Error('JWT token not found in local storage.');
      }

      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };
      return await this._http.get<UserLocationModel>(this._resourceUrl + '/location', options).toPromise();
  }


  public getUserDetails(): Observable<UserRetrievalModel> {
    const authToken: string | null = localStorage.getItem('jwtToken');
    if (!authToken) {
      throw new Error('JWT token not found in local storage.');
    }

    const options = {
      headers: new HttpHeaders({
        Authorization: authToken
      })
    };

    return this._http.get<UserRetrievalModel>(`${this._resourceUrl}/details`, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    if (error && error instanceof ProgressEvent) {
      throw new ErrorDetails('A connection could not be established. Please contact an administrator.',
        'Contact Administrator');
    }
    
    throw new ErrorDetails(error.error.detail, error.error.title || error.error.detail,
      error.error.status, error.error.timeStamp);
  }

  
  public async resetPassword(passwordResetModel: IPasswordResetModel): Promise<PartialEntityModel> {
    try {
      const response = await this._http.post<IPasswordResetModel>(this._resourceUrl+ '/reset-password', passwordResetModel).toPromise();
      return plainToClass(PartialEntityModel, response);
    } catch (error) {
      if (this.isNetworkError(error)) {
        throw new ErrorDetails('A connection could not be established. Please contact an administrator.');
      }
      throw plainToClass(ErrorDetails, (error as any).error);
    }
  }

  public async sendDeleteRequest(email: string): Promise<any> {
    try {
      return this._http.put<string>(environment.serverApiUrl + '/delete/' + email, {}).toPromise()
    } catch (err) {
      console.warn('Error in sendDeleteRequest() ', err);
    }
  }

  public async uploadProfilePicture(formData: FormData): Promise<PartialEntityModel> {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
      if (authToken === null) {
        throw new Error('JWT token not found in local storage.');
      }
      const options = {
        'Content-Type': 'multipart/form-data',
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };
      const response = this._http
        .post<PartialEntityModel>(this._resourceUrl + '/image-upload/', formData, options)
        .toPromise();
      return plainToClass(PartialEntityModel, response);
    } catch (error) {
      console.error(error);
      throw error

    }
  }
}
