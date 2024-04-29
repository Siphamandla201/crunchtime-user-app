import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
// import {CommonAlertService} from "../services/common-alert.service";
import { CommonAlertService } from '../services/common-alert.service';
import {ErrorDetails} from "../models/error-details";

@Injectable({
  providedIn: 'any'
})
export class ErrorHandlerInterceptor implements HttpInterceptor {
  public constructor(private readonly _commonAlertService: CommonAlertService) {}

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(
        () => {
          // Not applicable for a error interceptor.
        },
        (error: Error) => {
          if (error instanceof HttpErrorResponse) {
            if (error && error.error instanceof ProgressEvent) {
              throw new ErrorDetails(
                'Network Error',
                'A connection could not be established. Please contact an administrator.'
              );
              // const errorDetails = new ErrorDetails(
              //     'Network Error',
              //     'A connection could not be established. Please contact an administrator.'
              // );
              //
              // void this._commonAlertService.popup(errorDetails.title, errorDetails.detail);
              // throw errorDetails;
            }

            //specifically for lamda message error
            if (error.status && error.status === 403 && error.error && error.error.message) {
              void this._commonAlertService.popup('Authorization', error.error.message);
              return;
            }

            const errorDetails: ErrorDetails = plainToClass(ErrorDetails, error.error as Record<string, unknown>);
            void this._commonAlertService.popup(errorDetails.title, errorDetails.detail);
          }
        }
      )
    );
  }
}
