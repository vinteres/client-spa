import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CHttp } from './chttp.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  countSubject$: Subject<{type: 'msg' | 'notif' | 'intro', count: number }> = new Subject();

  constructor(private http: CHttp) { }

  getAll() {
    return this.http.get(environment.api_url + 'notifications');
  }

  getCount() {
    return this.http.get(environment.api_url + 'notifications_count');
  }

  public playSound() {
    const audioFile = 'assets/notification.ogg';
    const audio = new Audio(audioFile);
    audio.play();
  }
}
