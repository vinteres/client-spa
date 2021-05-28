import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private messagesQueue: Array<string> = [];
  private websocket: WebSocket;
  websocketMessageSubject$: Subject<any> = new Subject();
  websocketOpenSubject$: Subject<any> = new Subject();

  constructor(private authService: AuthService) {
    (window as any).ws_close = this.close.bind(this);
    (window as any).ws_open = this.connect.bind(this);

    this.connect();

    this.authService.logoutSubject$
      .subscribe(() => {
        this.close();
      });

    setInterval(() => {
      if (!this.websocket || this.websocket.readyState === WebSocket.CLOSED) {
        this.connect();
      }
    }, 5000);
  }

  send(data) {
    const message = JSON.stringify(data);
    if (!this.isOpen()) {
      this.messagesQueue.push(message);

      return;
    }

    this.websocket.send(message);
  }

  close() {
    if (this.websocket && this.websocket.readyState !== WebSocket.CLOSED) {
      this.websocket.close();
    }
  }

  private connect() {
    if (!this.authService.isLoggedIn()) { return; }

    this.websocket = new WebSocket(environment.ws_url + `?x-auth-token=${this.authService.getLoggedUser().token}`);
    this.websocket.onopen = (event) => {
      while (0 < this.messagesQueue.length) {
        this.websocket.send(this.messagesQueue.shift());
      }

      this.websocketOpenSubject$.next();
    };
    this.websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.websocketMessageSubject$.next(data);
    };
  }

  private isOpen(): boolean {
    return this.websocket && this.websocket.readyState === WebSocket.OPEN;
  }
}
