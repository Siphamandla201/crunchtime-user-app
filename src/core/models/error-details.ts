import {HttpStatusCode} from "@angular/common/http";

export class ErrorDetails {
  public title: string;
  public status: HttpStatusCode;
  public detail: string;
  public timestamp: Date;
  public developerMessage: string;

  public constructor(title: string, message?: string, developerMessage?: string, status?: HttpStatusCode) {
    this.title = title;
    this.status = status || HttpStatusCode.InternalServerError;
    this.detail = message || '';
    this.timestamp = new Date();
    this.developerMessage = developerMessage || ''
  }
}
