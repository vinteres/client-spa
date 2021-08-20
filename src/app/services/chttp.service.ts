import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';
import { CordovaService } from '../cordova.service';

@Injectable({
  providedIn: 'root'
})
export class CHttp extends HttpClient {
  constructor(
    handler: HttpHandler,
    private authService: AuthService,
    private cordovaService: CordovaService
  ) {
    super(handler);
  }

  get(url: string, options?: any): any {
    return super.get(url, this.modifyHeaders(options))
    .pipe(
      catchError((err) => this.handleError(err))
    );
  }

  post(url: string, body: any = {}, options?: any): any {
    return super.post(url, body, this.modifyHeaders(options));
  }

  delete(url: string, options?: any): any {
    return super.delete(url, this.modifyHeaders(options))
      .pipe(
        catchError((err) => this.handleError(err))
      );
  }

  private modifyHeaders(headers?: any) {
    headers = headers || {};

    this.addAuthTokenIfHas(headers);
    headers['X-On-Mobile'] = this.cordovaService.onCordova ? 'true' : 'false';

    return { headers };
  }

  private addAuthTokenIfHas(headers: any) {
    const user = this.authService.getLoggedUser();
    if (user?.token) {
      headers['X-Auth-Token'] = user.token;
    }
  }

  private handleError(error: any) {
    const errorStatus = error.status;
    if ('string' === typeof error) {
      try {
        error = JSON.parse(error);
      } catch (ex) {
        error = {};
      }
    }
    if (401 === errorStatus) {
      localStorage.removeItem('user_data');
      window.location.href = this.cordovaService.onCordova ? '#/login' : '/login';
    } else {
      try {
        error = JSON.parse(error._body);
        error.status = errorStatus;
      } catch (ex) { }
    }

    return throwError(error);
  }
}

export function customHttpFactory(
  httpHandler: HttpHandler,
  authService: AuthService,
  cordovaService: CordovaService
) {
  return new CHttp(httpHandler, authService, cordovaService);
}

export let customHttpProvider = {
  provide: CHttp,
  useFactory: customHttpFactory,
  deps: [HttpHandler, AuthService, CordovaService]
};
