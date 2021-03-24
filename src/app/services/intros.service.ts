import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CHttp } from './chttp.service';

@Injectable({
  providedIn: 'root'
})
export class IntrosService {

  constructor(private http: CHttp) { }

  getForUser(page: number) {
    return this.http.get(environment.api_url + 'intros-to?page=' + page)
  }

  getFromUser(page: number) {
    return this.http.get(environment.api_url + 'intros-from?page=' + page)
  }
l
  like(id: string) {
    return this.http.post(environment.api_url + `intros/${id}/like`)
  }

  sentMessage(intro, begginning) {
    let msg = begginning || 'Sent '

    if ('audio' === intro.type) {
      msg += 'an audio'
    } else {
      msg += `a ${intro.type}`
    }

    return `${msg} ${intro.timeAgo}`
  }
}
