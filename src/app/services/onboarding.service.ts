import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CHttp } from './chttp.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor(private http: CHttp) { }

  setAccountInfo(settings) {
    return this.http.post(environment.api_url + 'onboarding/account-info', settings)
  }

  setProfileInfo(settings) {
    return this.http.post(environment.api_url + 'onboarding/profile-info', settings)
  }

  setInterests(settings) {
    return this.http.post(environment.api_url + 'onboarding/interests', settings)
  }

  getStep() {
    return this.http.get(environment.api_url + 'onboarding/step')
  }

  getQuiz() {
    return this.http.get(environment.api_url + 'onboarding/quiz')
  }

  setQuiz(quiz) {
    return this.http.post(environment.api_url + 'onboarding/quiz', quiz)
  }
}
