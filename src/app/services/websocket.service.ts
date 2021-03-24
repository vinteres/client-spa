import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private websocket: WebSocket
  websocketMessageSubject$: Subject<any> = new Subject()
  websocketOpenSubject$: Subject<any> = new Subject()

  constructor(private authService: AuthService) {
    (<any>window).ws_close = this.close.bind(this);
    (<any>window).ws_open = this.connect.bind(this);

    this.connect()

    this.authService.logoutSubject$
      .subscribe(() => {
        this.close()
      })

    setInterval(() => {
      if (!this.websocket || this.websocket.readyState === WebSocket.CLOSED) {
        this.connect()
      }
    }, 5000)
  }

  send(data) {
    this.websocket.send(JSON.stringify(data))
  }

  close() {
    if (this.websocket && this.websocket.readyState !== WebSocket.CLOSED) {
      this.websocket.close()
    }
  }

  private connect() {
    if (!this.authService.isLoggedIn()) return

    this.websocket = new WebSocket(environment.ws_url + `?x-auth-token=${this.authService.getLoggedUser().token}`)
    this.websocket.onopen = (event) => {
      this.websocketOpenSubject$.next()
    }
    this.websocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.websocketMessageSubject$.next(data)
    }
  }
}
