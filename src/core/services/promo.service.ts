import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { PartialEntityModel } from "../models/partial-entity.model";
import { plainToClass } from "class-transformer";
import { ErrorDetails } from '../models/error-details';
import { PromoRetrievalModel } from '../models/promo-retrieval.model';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
  })
export class PromoService {
    private readonly _resourceUrl: string = environment.serverApiUrl;

    public constructor(
        private readonly _http: HttpClient,
    ) {}

    public getAllActivated(): Observable<PromoRetrievalModel[]> {
        try {
            return this
                ._http.get<PromoRetrievalModel[]>(this._resourceUrl + '/promo');
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