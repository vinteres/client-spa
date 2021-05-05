import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { CHttp } from './chttp.service'

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: CHttp) { }

  getById(id: string) {
    return this.http.get(environment.api_url + `user/${id}`)
  }

  getUsers(page) {
    return this.http.get(environment.api_url + 'users?page=' + page)
  }

  getMatches() {
    return this.http.get(environment.api_url + 'matches')
  }

  getViews() {
    return this.http.get(environment.api_url + 'views')
  }

  getCompatabilities() {
    return this.http.get(environment.api_url + 'compatabilities')
  }

  getCompatabilityCount() {
    return this.http.get(environment.api_url + 'compatability-count')
  }

  getSettings() {
    return this.http.get(environment.api_url + 'settings')
  }

  setSettings(settings) {
    return this.http.post(environment.api_url + 'settings', settings)
  }

  setAccountSettings(settings) {
    return this.http.post(environment.api_url + 'account-settings', settings)
  }

  setProfileSettings(settings) {
    return this.http.post(environment.api_url + 'profile-settings', settings)
  }

  changePassword(password, newPassword) {
    return this.http.post(environment.api_url + 'settings/change-password', { password, newPassword })
  }

  unmatch(userId) {
    return this.http.post(environment.api_url + `users/${userId}/unmatch`)
  }

  deactivate(password) {
    return this.http.post(environment.api_url + 'settings/deactivate', { password })
  }

  emailExists(email) {
    return this.http.get(environment.api_url + 'email-exist?email=' + email)
  }

  getSearchPref() {
    return this.http.get(environment.api_url + 'search-preferences')
  }

  setSearchPref(settings) {
    return this.http.post(environment.api_url + 'search-preferences', settings)
  }
}
