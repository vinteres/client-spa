import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CHttp } from './chttp.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileQuestionService {

  constructor(private http: CHttp) { }

  getUserAnswers(userId) {
    return this.http.get(environment.api_url + `users/${userId}/profile-answers`);
  }

  saveAnswer(answer) {
    return this.http.post(environment.api_url + `users/profile-answer`, answer);
  }
}
