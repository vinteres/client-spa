import { Injectable } from '@angular/core'
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment'
import { CHttp } from './chttp.service'

@Injectable({
  providedIn: 'root'
})
export class IntrosService {
  modalSubject$: Subject<'open' | 'close'> = new Subject();
  likeSentSubject$: Subject<void> = new Subject();

  constructor(private http: CHttp) { }

  getForUser(page: number) {
    return this.http.get(environment.api_url + 'intros-to?page=' + page)
  }

  getFromUser(page: number) {
    return this.http.get(environment.api_url + 'intros-from?page=' + page)
  }

  like(id: string) {
    return this.http.post(environment.api_url + `intros/${id}/like`)
  }
}
