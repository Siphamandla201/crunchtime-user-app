import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorDetails } from '../models/error-details';
import { FoodTypesRetrievalModel } from '../models/food-types-retrieval.model';

@Injectable({
  providedIn: 'root'
})
export class FoodTypesService {
  private readonly _resourceUrl: string = environment.serverApiUrl;
  constructor(
    private readonly _http: HttpClient
  ) {}

  public getFoodTypes(): Observable<FoodTypesRetrievalModel[]> {
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
    return this._http.get<FoodTypesRetrievalModel[]>(this._resourceUrl + '/food-types',options);
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
