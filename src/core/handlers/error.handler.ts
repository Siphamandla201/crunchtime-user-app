import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { ErrorDetails } from "../models/error-details";

export function handleError(error: HttpErrorResponse): Observable<never> {
  if (error && error.error instanceof ProgressEvent) {
    throw new ErrorDetails('Network Error', 'A connection could not be established. Please contact an administrator.');
  }
  return throwError(plainToClass(ErrorDetails, error.error));
}
