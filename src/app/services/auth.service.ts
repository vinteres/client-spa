import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_DATA = 'user_data'

  loggedInSubject$: Subject<any> = new Subject()
  logoutSubject$: Subject<any> = new Subject()

  constructor(private http: HttpClient) { }

  public isLoggedIn(): boolean {
    return this.getLoggedUser() !== null
  }

  public login(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.api_url + 'login', data)
        .subscribe((resp: any) => {
          if (resp.loggedIn) {
            this.addUserToStorage(resp)
          }
          this.emitUserLoggedInEvent()

          resolve(resp);
        }, error => {
          reject(error);
        });
    });
  }

  public create(data: any) {
    return this.http.post(environment.api_url + 'sign-up', data);
  }

  public logout() {
    return new Promise((resolve, reject) => {
      this.http.post(environment.api_url + 'logout', {}, this.addAuthTokenIfHas())
        .subscribe(resp => {
          this.removeUserFromStorage()
          this.logoutSubject$.next()

          resolve(true)
        }, error => {
          if (!error.ok && 401 === error.status) {
            // user already logged out
            this.removeUserFromStorage()
            this.logoutSubject$.next()
            resolve(true)

            return
          }

          reject(error)
        })
    });
  }

  removeUserFromStorage() {
    localStorage.removeItem(this.USER_DATA);
  }

  addUserToStorage(data: any) {
    localStorage.setItem(this.USER_DATA, JSON.stringify(data));
  }

  public getLoggedUser() {
    try {
      return JSON.parse(localStorage.getItem(this.USER_DATA))
    } catch(e) {
      return null
    }
  }

  private addAuthTokenIfHas() {
    const headers = {}

    const user = this.getLoggedUser();
    if (user && user.token) {
      headers['X-Auth-Token'] = user.token
    }

    return { headers }
  }

  private emitUserLoggedInEvent() {
    if (!this.isLoggedIn()) return

    this.loggedInSubject$.next(this.getLoggedUser())
  }
}
