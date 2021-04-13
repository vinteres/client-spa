import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpClient, HttpHandler } from '@angular/common/http'
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root'
})
export class CHttp extends HttpClient {
  constructor(
    handler: HttpHandler,
    private authService: AuthService
  ) {
    super(handler)
  }

  get(url: string, options?: any): any {
    return super.get(url, this.addAuthTokenIfHas(options))
    .pipe(
      catchError(this.handleError)
    )
  }

  post(url: string, body: any = {}, options?: any): any {
    return super.post(url, body, this.addAuthTokenIfHas(options))
  }

  delete(url: string, options?: any): any {
    return super.delete(url, this.addAuthTokenIfHas(options))
      .pipe(
        catchError(this.handleError)
      )
  }

  private addAuthTokenIfHas(headers?: any) {
    headers = headers || {}

    const user = this.authService.getLoggedUser()
    if (user && user.token) {
      headers['X-Auth-Token'] = user.token
    }

    return { headers }
  }

  private handleError(error: any) {
    const errorStatus = error.status
    if ('string' === typeof error) {
      try {
        error = JSON.parse(error)
      } catch (ex) {
        error = {}
      }
    }
    if (401 === errorStatus) {
      localStorage.removeItem('user_data')
      window.location.href = '/login'
    } else {
      try {
        error = JSON.parse(error._body)
        error.status = errorStatus
      } catch (ex) { }
    }
    console.error(JSON.stringify(error))

    return Observable.throw(error)
  }
}

export function customHttpFactory(httpHandler: HttpHandler, authService: AuthService) {
  return new CHttp(httpHandler, authService)
}

export let customHttpProvider = {
  provide: CHttp,
  useFactory: customHttpFactory,
  deps: [HttpHandler, AuthService]
}
