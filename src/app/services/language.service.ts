import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private supportedLanguage = [
    { code: 'en', label: 'English' },
    { code: 'bg', label: 'Български' },
  ];

  langChangeSubject$: Subject<any> = new Subject();

  constructor() { }

  getCurrentLang() {
    return localStorage.getItem('lang') || 'bg';
  }

  getSupportedLanguages() {
    return this.supportedLanguage;
  }
}
