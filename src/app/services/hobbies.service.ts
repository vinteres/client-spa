import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CHttp } from './chttp.service';

@Injectable({
  providedIn: 'root'
})
export class HobbiesService {
  hobbies: any;
  activities: any;

  constructor(private http: CHttp) { }

  getAll() {
    return new Promise((resolve) => {
      if (this.hobbies) { return resolve(this.hobbies); }

      this.http.get(environment.api_url + 'hobbies')
        .subscribe(hobbies => {
          this.hobbies = hobbies;

          resolve(hobbies);
        });
    });
  }

  find(search: string) {
    search = search.toLowerCase();

    return this.getAll()
      .then((hobbies: any) => {
        return hobbies.filter(hobbie => {
          for (const s of hobbie.name.split(' ')) {
            if (s.toLowerCase().startsWith(search)) { return true; }
          }

          return false;
        });
      });
  }

  getAllActivities() {
    return new Promise((resolve) => {
      if (this.activities) { return resolve(this.activities); }

      this.http.get(environment.api_url + 'activities')
        .subscribe(activities => {
          this.activities = activities;

          resolve(activities);
        });
    });
  }

  findActivities(search: string) {
    search = search.toLowerCase();

    return this.getAll()
      .then((activities: any) => {
        return activities.filter(hobbie => {
          for (const s of hobbie.name.split(' ')) {
            if (s.toLowerCase().startsWith(search)) { return true; }
          }

          return false;
        });
      });
  }

  saveHobbies(hobbies) {
    return this.http.post(environment.api_url + 'hobbies/user', { hobbies });
  }

  saveActivities(activities) {
    return this.http.post(environment.api_url + 'activities/user', { activities });
  }
}
