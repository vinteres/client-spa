import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private translate: TranslateService,
    private notifierService: NotifierService
  ) { }

  success(message) {
    this.translate.get(message)
      .subscribe(translatedText => this.notifierService.notify('success', translatedText));
  }

  error(message) {
    this.translate.get(message)
      .subscribe(translatedText => this.notifierService.notify('error', translatedText));
  }
}
