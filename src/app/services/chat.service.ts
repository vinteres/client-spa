import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { WebsocketService } from './websocket.service'

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private activeUserId: string

  chatMessageSubject$: Subject<any> = new Subject()

  constructor(private websocketService: WebsocketService) {
    websocketService.websocketMessageSubject$
      .subscribe((data) => {
        if ('msg' !== data.type) { return }

        this.chatMessageSubject$.next(data)
      })
  }

  send({ text, chatId }) {
    const data = {
      type: 'msg',
      text,
      chatId
    }

    this.websocketService.send(data)
  }

  seeMessage(chatId) {
    const data = {
      type: 'see_msg',
      chatId
    }

    this.websocketService.send(data)
  }

  getActiveUserId() {
    return this.activeUserId
  }

  setActiveUserId(activeUserId: string|null) {
    this.activeUserId = activeUserId
  }
}
