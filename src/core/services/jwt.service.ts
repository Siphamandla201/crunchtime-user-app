import { Injectable } from '@angular/core';
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import { RetrievalJwtTokenModel } from "../models/retrieval-jwt-token.model";
import { plainToClass } from "class-transformer";
import { IJwtTokenModel } from "../models/jwt-token.model";
import {IAuthenticateModel} from "../models/authenticate.model";

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  public constructor(
    private readonly _localStorage: LocalStorageService,
    private readonly _sessionStorage: SessionStorageService
  ) {}

  public login(model: IAuthenticateModel, json: IJwtTokenModel, rememberMe: boolean): void {
    this.clearLocalStorage();
    this.storeJwtJson(model, json, rememberMe);
    this.allowTabsTokenSharing(true);
  }

  public getJwtJsonToken(): string | null {
    return localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
  }

  public getJwtGuid(): string | null {
    const jsonToken = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
    if (!jsonToken) {
      throw new Error('JWT token not found in local storage.');
    }

    const retrievalJwtTokenModel = plainToClass(RetrievalJwtTokenModel, JSON.parse(jsonToken));

    return retrievalJwtTokenModel && retrievalJwtTokenModel.guid ? retrievalJwtTokenModel.guid : null;
  }

  public getJwtToken(): string | null {
    const jsonToken = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
    if (!jsonToken) {
      throw new Error('JWT token not found in local storage.');
    }

    const retrievalJwtTokenModel = plainToClass(RetrievalJwtTokenModel, jsonToken);

    return retrievalJwtTokenModel && retrievalJwtTokenModel.token ? retrievalJwtTokenModel.token : null;
  }

  public getProfileImage(): string | null {
    const jsonToken = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
      if (!jsonToken) {
      throw new Error('JWT token not found in local storage.');
    }

    const retrievalJwtTokenModel = plainToClass(RetrievalJwtTokenModel, JSON.parse(jsonToken));

    return retrievalJwtTokenModel && retrievalJwtTokenModel.profileImageUrl ? retrievalJwtTokenModel.profileImageUrl : null;
  }

  public logout(): void {
    this.clearLocalStorage();
  }

  public clearLocalStorage(): void {
    localStorage.removeItem('jwtToken');
    sessionStorage.removeItem('jwtToken');
    localStorage.removeItem('usersName');
    localStorage.removeItem('usersWord');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('orderProgress');
  }

  public allowTabsTokenSharing(allow: boolean): void {
    if (allow) {
      const session = this.getJwtJsonToken();
      if (session) {
        localStorage.setItem('jwtToken', session);
      }
    }
  }

  public isAuthenticated(): string | null {
    return localStorage.getItem('jwtToken');
  }

  private storeJwtJson(model: IAuthenticateModel, jwtToken: IJwtTokenModel, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem('jwtToken', 'Bearer ' + jwtToken.idToken);
      localStorage.setItem('usersName', model.username);
      localStorage.setItem('usersWord', model.password);
    } else {
      sessionStorage.setItem('jwtToken', 'Bearer ' + jwtToken.idToken);
    }
  }
}
