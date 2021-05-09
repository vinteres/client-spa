import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  actionSubject$: Subject<{ action: 'open' | 'close', modal: string }> = new Subject();

  constructor() { }
}
