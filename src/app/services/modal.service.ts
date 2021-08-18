import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CHttp } from './chttp.service';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  actionSubject$: Subject<{ action: 'open' | 'close', modal: string, params?: {} }> = new Subject();
  uploadProfileImageModalSubject$: Subject<boolean> = new Subject();

  constructor(
    private http: CHttp
  ) { }

  hasProfileImage() {
    localStorage.getItem('prof_img');

    if (!localStorage.getItem('prof_img')) {
      return new Promise((resolve, reject) => {
        this.http.get(environment.api_url + 'users/has-profile-img')
          .subscribe(({ hasProfileImage }) => {
            if (hasProfileImage) localStorage.setItem('prof_img', '1');

            resolve(hasProfileImage)
          }, (error) => {
            reject(error);
          });
      });
    }

    return Promise.resolve(true);
  }
}
