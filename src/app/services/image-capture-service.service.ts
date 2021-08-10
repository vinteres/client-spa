import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageCaptureServiceService {
  canStartSubject$: Subject<boolean> = new Subject();

  constructor() { }
}
