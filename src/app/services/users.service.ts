import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CHttp } from './chttp.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  setImagesSubject$: Subject<boolean> = new Subject();

  public readonly LOOKING_FOR_TYPES = {
    1: 'Friends',
    2: 'Long-term dating',
    4: 'Short-term dating',
    8: 'Hookups'
  };

  public readonly ZODIAC_SIGNS = [
    {
      label: 'Aries',
      value: 'aries'
    },
    {
      label: 'Taurus',
      value: 'taurus'
    },
    {
      label: 'Gemini',
      value: 'gemini'
    },
    {
      label: 'Cancer',
      value: 'cancer'
    },
    {
      label: 'Leo',
      value: 'leo'
    },
    {
      label: 'Virgo',
      value: 'virgo'
    },
    {
      label: 'Libra',
      value: 'libra'
    },
    {
      label: 'Scorpio',
      value: 'scorpio'
    },
    {
      label: 'Sagittarius',
      value: 'sagittarius'
    },
    {
      label: 'Capricorn',
      value: 'capricorn'
    },
    {
      label: 'Aquarius',
      value: 'aquarius'
    },
    {
      label: 'Pisces',
      value: 'pisces'
    },
  ];

  constructor(private http: CHttp) { }

  getById(id: string) {
    return this.http.get(environment.api_url + `user/${id}`);
  }

  getUsers(page, payload) {
    const q = { page, ...payload };

    return this.http.get(environment.api_url + 'users?' + Object.keys(q).filter(k => q[k]).map(k => `${k}=${q[k]}`).join('&'));
  }

  getMatches() {
    return this.http.get(environment.api_url + 'matches');
  }

  getViews() {
    return this.http.get(environment.api_url + 'views');
  }

  getCompatibilities() {
    return this.http.get(environment.api_url + 'compatibilities');
  }

  getCompatibilityCount() {
    return this.http.get(environment.api_url + 'compatibility-count');
  }

  getSettings() {
    return this.http.get(environment.api_url + 'settings');
  }

  setSettings(settings) {
    return this.http.post(environment.api_url + 'settings', settings);
  }

  setAccountSettings(settings) {
    return this.http.post(environment.api_url + 'account-settings', settings);
  }

  setProfileSettings(settings) {
    return this.http.post(environment.api_url + 'profile-settings', settings);
  }

  changePassword(password, newPassword) {
    return this.http.post(environment.api_url + 'settings/change-password', { password, newPassword });
  }

  unmatch(userId) {
    return this.http.post(environment.api_url + `users/${userId}/unmatch`);
  }

  deactivate(password) {
    return this.http.post(environment.api_url + 'settings/deactivate', { password });
  }

  emailExists(email) {
    return this.http.get(environment.api_url + 'email-exist?email=' + email);
  }

  getSearchPref() {
    return this.http.get(environment.api_url + 'search-preferences');
  }

  setSearchPref(settings) {
    return this.http.post(environment.api_url + 'search-preferences', settings);
  }

  calculateAge(birthday: string) {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);

    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}
