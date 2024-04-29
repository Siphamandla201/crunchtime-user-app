import { Injectable } from '@angular/core';
import { environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { IEstablishmentRetrievalModel } from "../models/establishment-retrieval.model";
import {ErrorDetails} from "../models/error-details";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {
  private readonly _resourceUrl: string = environment.serverApiUrl + '/establishments';

  constructor(
    private readonly _http: HttpClient,
  ) {}
  

  public getAllEstablishments(): Observable<IEstablishmentRetrievalModel[]> {
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

      return this
        ._http
        .get<IEstablishmentRetrievalModel[]>(this._resourceUrl)
    } catch (error: any) {
      if (error && error instanceof ProgressEvent) {
        throw new ErrorDetails('A connection could not be established. Please contact an administrator.',
          'Contact Administrator', '', undefined);
      }
      throw new ErrorDetails(error.error.detail, error.error.title || error.error.detail,
        error.error.status, error.error.timeStamp);
    }
  }

  public getAllEstablishmentsNearYou(): Observable<IEstablishmentRetrievalModel[]> {
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

      return this
        ._http
        .get<IEstablishmentRetrievalModel[]>(this._resourceUrl + '/near-you', options);
    } catch (error: any) {
      if (error && error instanceof ProgressEvent) {
        throw new ErrorDetails('A connection could not be established. Please contact an administrator.',
          'Contact Administrator', '', undefined);
      }
      throw new ErrorDetails(error.error.detail, error.error.title || error.error.detail,
        error.error.status, error.error.timeStamp);
    }
  }
  
  public async getEstablishment(id: number): Promise<IEstablishmentRetrievalModel> {
    try {
        const response = await this._http.get<IEstablishmentRetrievalModel>(this._resourceUrl + '/' + id + '/details').toPromise();

        // Check if response is undefined
        if (!response) {
            throw new Error('No data received from server');
        }

        return response;
    } catch (error: any) {
        if (error && error instanceof ProgressEvent) {
            throw new ErrorDetails('A connection could not be established. Please contact an administrator.', 'Contact Administrator', '', undefined);
        }
        throw new ErrorDetails(error.error.detail, error.error.title || error.error.detail, error.error.status, error.error.timeStamp);
    }
}

}
