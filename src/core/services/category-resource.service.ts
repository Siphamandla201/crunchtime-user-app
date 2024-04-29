import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ErrorDetails} from "../models/error-details";
import {environment} from "../../environments/environment";
import {CategoryRetrievalModel} from "../models/category-retrieval.model";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryResourceService {
  private readonly _resourceUrl: string = environment.serverApiUrl;
  constructor(
    private readonly _http: HttpClient,
  ) {}

  public async getAllCategories(id: any): Promise<Array<CategoryRetrievalModel>> {
    try {
      const response = await this._http.get<Array<CategoryRetrievalModel>>(this._resourceUrl + '/category/' + id + '/items').toPromise();

      // / Check if response is undefined
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

  public getAllCategoriesNew(id: any): Observable<Array<CategoryRetrievalModel>> {
    try {
      return this
        ._http
        .get<Array<CategoryRetrievalModel>>(this._resourceUrl + '/category/' + id + '/items')
    } catch (error: any) {
      if (error && error instanceof ProgressEvent) {
        throw new ErrorDetails('A connection could not be established. Please contact an administrator.',
          'Contact Administrator', '', undefined);
      }
      throw new ErrorDetails(error.error.detail, error.error.title || error.error.detail,
        error.error.status, error.error.timeStamp);
    }
  }

  public async getAll(): Promise<Array<CategoryRetrievalModel>> {
    try {
      // const authToken: string = localStorage.getItem('jwtToken');
      // const options = {
      //   headers: new HttpHeaders({
      //     Authorization: authToken
      //   })
      // };
      const res =  await this._http.get<Array<CategoryRetrievalModel>>(this._resourceUrl + '/category/items').toPromise();
      if (!res) {
        throw new Error('No data received from server');
      }

      return res;

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
