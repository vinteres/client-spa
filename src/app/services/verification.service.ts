import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CHttp } from './chttp.service';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  modalSubject$: Subject<'open' | 'close'> = new Subject();

  constructor(private http: CHttp) { }

  getStatus() {
    return this.http.get(environment.api_url + 'verification/status');
  }
}
