import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { ErrorDetails } from '../models/error-details';
import { OrderItemsModel } from '../models/order-items.model';
import { OrderHistoryRetrievalModel } from '../models/order-history-retrieval.model';
import { DriverDetailsRetrievalModel } from '../models/driver-details-retrieval.model';
import { TariffPaymentModel } from '../models/TariffPayment.model';
import { PartialEntityModel } from '../models/partial-entity.model';
import { DeliveryRetrievalModel } from '../models/delivery-retrieval.model';
import { plainToClass } from 'class-transformer';
import { Observable, throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { PromoVerifyModel } from '../models/promo-verify.model';
// import { error } from 'jquery';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly _resourceUrl: string = environment.serverApiUrl;
  constructor(private readonly _http: HttpClient) {}

  private handleError(error: any): Observable<never> {
    if (error instanceof ProgressEvent) {
      throw new ErrorDetails('A connection could not be established. Please contact an administrator.',
        'Contact Administrator', '', undefined); // Provide default values for null or undefined properties
    }
  
    // Handle nullability of error properties explicitly
    const detail = error && error.error && error.error.detail ? error.error.detail : '';
    const title = error && error.error && (error.error.title || error.error.detail) ? error.error.title || error.error.detail : '';
    const status = error && error.error && error.error.status ? error.error.status : null;
    const timeStamp = error && error.error && error.error.timeStamp ? error.error.timeStamp : null;
  
    throw new ErrorDetails(detail, title, status, timeStamp);
  } 

  public getSelectedItems(): Observable<OrderItemsModel[]> {
      const authToken: string | null = localStorage.getItem('jwtToken');
      if( !authToken) {
        throw new Error('JWT token not found in local storage.');
      }

      const options = {
        headers: new HttpHeaders({
          Authorization: authToken,
        }),
      };

      return this._http.get<OrderItemsModel[]>( this._resourceUrl + '/order-items', options)
      .pipe(
        catchError(this.handleError)
      );
    }

  public getProcessedItems(id: number): Observable<OrderItemsModel[]> {
      const authToken: string | null= localStorage.getItem('jwtToken');
      if( !authToken) {
        throw new Error('JWT token not found in local storage.');
      }

      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };

      return this._http.get<OrderItemsModel[]>(this._resourceUrl + '/establishments/' + id + '/orders', options)
        .pipe(catchError(this.handleError));
  }
  
  public async getOrderHistory(): Promise<OrderHistoryRetrievalModel[]> {
    const authToken: string | null = localStorage.getItem('jwtToken');
    if (!authToken) {
      return Promise.reject(new Error('JWT token not found in local storage.'));
    }
    
    const options = {
      headers: new HttpHeaders({
        Authorization: authToken,
      }),
    };
  
    const result = await this._http.get<OrderHistoryRetrievalModel[]>(`${this._resourceUrl}/my-orders`, options)
      .pipe(
        catchError((error: any) => {
          return throwError(error); // Re-throw the error to maintain consistency in return type
        })
      )
      .toPromise();
    if (result === undefined) {
      throw new Error('Failed to retrieve order history');
    }
    return result;
  }
  
  public async getDriverDetails(): Promise<DriverDetailsRetrievalModel> {
    const authToken: string | null = localStorage.getItem('jwtToken');
    if (!authToken) {
      return Promise.reject(new Error('JWT token not found in local storage.'));
    }

    const options = {
      headers: new HttpHeaders({
        Authorization: authToken,
      }),
    };

    const result = await this._http.get<DriverDetailsRetrievalModel>(`${this._resourceUrl}/my-driver`, options)
      .pipe(
        catchError((error: any) => {
          return throwError(error); // Re-throw the error to maintain consistency in return type
        })
      )
      .toPromise();
    if (result === undefined) {
      throw new Error('Failed to retrieve order history');
    }
    return result;
  }

  public async cancelOrder(): Promise<void> {
    const authToken: string | null = localStorage.getItem('jwtToken');
    if (!authToken) {
      throw new Error('JWT token not found in local storage.');
    }

    const options = {
      headers: new HttpHeaders({
        Authorization: authToken,
      }),
    };

    try {
      await this._http.put<void>(`${this._resourceUrl}/order/cancel`, null, options).toPromise();
    } catch (error) {
      console.warn(error);
      // You might want to handle the error here, depending on your requirements
    }
  }


  public async confirmOrder() {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
      if (!authToken) {
        return Promise.reject(new Error('JWT token not found in local storage.'));
      }

      const options = {
        headers: new HttpHeaders({
          Authorization: authToken,
        }),
      };
      return await this._http
        .put<void>(this._resourceUrl + '/order/confirm', null, options)
        .toPromise();
    } catch (e) {
      console.warn(e);
    }
  }

  public async orderPickUpStatus() {
    try {
      const authToken: string  | null = localStorage.getItem('jwtToken');
      if (!authToken) {
        return Promise.reject(new Error('JWT token not found in local storage.'));
      }
      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };
      return await this._http.put<void>(this._resourceUrl + '/order/pickupstatus', null, options).toPromise();
    } catch(e) {
      console.warn(e)
    }
  }

  public async orderDeliverStatus() {
    try {
      const authToken: string | null= localStorage.getItem('jwtToken');
      if (!authToken) {
        return Promise.reject(new Error('JWT token not found in local storage.'));
      }
      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };
      return await this._http.put<void>(this._resourceUrl + '/order/deliverstatus', null, options).toPromise();
    } catch(e) {
      console.warn(e)
    }
  }

  public async orderCollectedStatus() {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
      if (!authToken) {
        return Promise.reject(new Error('JWT token not found in local storage.'));
      }
      
      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };
      return await this._http.put<void>(this._resourceUrl + '/order/collectedstatus', null, options).toPromise();
    } catch(e) {
      console.warn(e)
    }
  }

  // public async orderPickUpStatus(id: number, orderStatus: string) {
  //   try {
  //     const authToken: string | null = localStorage.getItem('jwtToken');
  // if (!authToken) {
  //   return Promise.reject(new Error('JWT token not found in local storage.'));
  // }
  //     const options = {
  //       headers: new HttpHeaders({
  //         Authorization: authToken
  //       })
  //     };
  //     return await this._http.post<PartialEntityModel>(this._resourceUrl + '/order/'+ id +'/status', orderStatus, options).toPromise();
  //   } catch(e) {
  //     console.warn(e)
  //   }
  // }

  public async getPrice(distance: number, tipAmount: number, donation: number): Promise<TariffPaymentModel> {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
      if (!authToken) {
        return Promise.reject(new Error('JWT token not found in local storage.'));
      }

      const options = {
        headers: new HttpHeaders({
          Authorization: authToken,
        }),
      };

      const response = await this._http.put<TariffPaymentModel>(
        `${this._resourceUrl}/payments/${distance}/tariff/${tipAmount}/donation/${donation}`,
        null,
        options
      )
      .pipe(catchError((error: any) => { return throwError(error);}))
      .toPromise();

      if (response === undefined) {
        throw new Error('Failed to retrieve tariff payment model');
      }
  
      return response;
    } catch (e) {
      console.warn(e);
      throw e; 
    }
  }

  public async getPickupPrice(distance: number, donation: number): Promise<TariffPaymentModel> {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
      if (!authToken) {
        return Promise.reject(new Error('JWT token not found in local storage.'));
      }

      const options = {
        headers: new HttpHeaders({
          Authorization: authToken,
        }),
      };

      const response = await this._http.put<TariffPaymentModel>(
        `${this._resourceUrl}/payments/${distance}/donation/${donation}`,null, options
      ).toPromise();
  
      if (response === undefined) {
        throw new Error('Failed to retrieve tariff payment model');
      }
  
      return response;
    } catch (e) {
      console.warn(e);
      throw e; // Re-throw the error to maintain consistent error handling
    }
  }


  public async makePayment(): Promise<PartialEntityModel> {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
      if (!authToken) {
        throw new Error('JWT token not found in local storage.');
      }
  
      const options = {
        headers: new HttpHeaders({
          Authorization: authToken,
        }),
      };
  
      const response = await this._http.put<PartialEntityModel>(
        `${this._resourceUrl}/payments/pay-now`,
        null,
        options
      ).toPromise();
  
      return plainToClass(PartialEntityModel, response);
    } catch (error: any) {
      if (error instanceof ProgressEvent) {
        throw new ErrorDetails(
          'A connection could not be established. Please contact an administrator.',
          'Contact Administrator',
          '',
          undefined
        );
      }
      throw new ErrorDetails(
        error.error.detail,
        error.error.title || error.error.detail,
        error.error.status,
        error.error.timeStamp
      );
    }
  }
  
  public async getDeliveryDetails(): Promise<DeliveryRetrievalModel> {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
  if (!authToken) {
    return Promise.reject(new Error('JWT token not found in local storage.'));
  }

      const options = {
        headers: new HttpHeaders({
          Authorization: authToken,
        }),
      };

      const response = await this._http.get<DeliveryRetrievalModel>(this._resourceUrl + '/order/current-order',options)
        .toPromise();

      return plainToClass(DeliveryRetrievalModel, response);
    } catch (error: any) {
      if (error && error instanceof ProgressEvent) {
        throw new ErrorDetails(
          'A connection could not be established. Please contact an administrator.',
          'Contact Administrator',
          '',
          undefined
        );
      }
      throw new ErrorDetails(
        error.error.detail,
        error.error.title || error.error.detail,
        error.error.status,
        error.error.timeStamp
      );
    }
  }

  public async getCollectDetails(): Promise<DeliveryRetrievalModel> {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
    if (!authToken) {
      return Promise.reject(new Error('JWT token not found in local storage.'));
    }

    const options = {
      headers: new HttpHeaders({
        Authorization: authToken,
      }),
      };

      const response = await this._http.get<DeliveryRetrievalModel>(this._resourceUrl + '/order/current-order-collect',options)
        .toPromise();

      return plainToClass(DeliveryRetrievalModel, response)
    } catch (error: any) {
      if (error && error instanceof ProgressEvent) {
        throw new ErrorDetails(
          'A connection could not be established. Please contact an administrator.',
          'Contact Administrator',
          '',
          undefined
        );
      }
      throw new ErrorDetails(
        error.error.detail,
        error.error.title || error.error.detail,
        error.error.status,
        error.error.timeStamp
      );
    }
  }

  public async insertVoucherCode(
    emailAddress: string,
    promoCode: PromoVerifyModel,
    deliveryId: string
  ): Promise<PartialEntityModel> {
    try {
      const authToken: string | null = localStorage.getItem('jwtToken');
  if (!authToken) {
    return Promise.reject(new Error('JWT token not found in local storage.'));
  }

      const options = {
        headers: new HttpHeaders({
          Authorization: authToken,
        }),
      };
      console.log(promoCode);
      const response = await this._http
        .put<any>(
          this._resourceUrl +
            '/promo/' +
            emailAddress +
            '/verify/' +
            deliveryId,
          promoCode,
          options
        )
        .toPromise();
      console.log(response);
      return plainToClass(PartialEntityModel, response);
    } catch (error: any) {
      console.log(error);
      if (error && error instanceof ProgressEvent) {
        throw new ErrorDetails(
          'A connection could not be established. Please contact an administrator.',
          'Contact Administrator',
          '',
          undefined
        );
      }
      throw new ErrorDetails(
        error.error.detail,
        error.error.message || error.error.detail,
        error.error.status,
        error.error.timeStamp
      );
    }
  }
}
