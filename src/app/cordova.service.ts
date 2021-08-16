import { Injectable } from '@angular/core';

const _window: () => any = () => window;

@Injectable({
  providedIn: 'root'
})
export class CordovaService {

  constructor() { }

  get onCordova(): Boolean {
    return !!_window().cordova;
  }

  getImgPath(image) {
    if (!this.onCordova) return image;

    return `.${image}`;
  }

  getImgPath2(image) {
    if (!this.onCordova) return image;
    if (image.startsWith('/')) return this.getImgPath(image);

    return image;
  }
}
