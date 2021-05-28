import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CHttp } from './chttp.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: CHttp) { }

  report(userId) {
    return this.http.post(environment.api_url + 'report', { userId });
  }
}
