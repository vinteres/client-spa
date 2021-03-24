import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { CHttp } from 'src/app/services/chttp.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'messages-page',
  templateUrl: './messages-page.component.html',
  styleUrls: ['./messages-page.component.sass']
})
export class MessagesPageComponent implements OnInit {
  users: any = []
  loading: boolean
  activeUserId

  private wsSubscription: Subscription
  private websocketSubscription: Subscription
  private chatChangeSubscription: Subscription
  private routeSubscription: Subscription

  constructor(
    private http: CHttp,
    private authService: AuthService,
    private chatService: ChatService,
    private websocketService: WebsocketService,
    private notificationsService: NotificationsService,
    private router: Router
  ) {
    this.chatChangeSubscription = this.chatService.chatChangeSubject$
      .subscribe(userId => {
        this.activeUserId = userId
      })

    this.routeSubscription = router.events
      .subscribe((val) => {
        if (!(val instanceof NavigationEnd)) return
        if ('/chat' !== val.url) return

        this.activeUserId = null
      })

    this.websocketSubscription = chatService.chatMessageSubject$
      .subscribe(msg => {
        const user = this.users.find(item => item.chat_id === msg.chatId)
        if (user) {
          user.lastMessageAt = msg.created_at

          if (msg.user_id !== authService.getLoggedUser().id &&
              window.location.pathname !== `/chat/user/${msg.user_id}`
          ) {
            if (!user.notSeenCount) {
              user.notSeenCount = 0
            }

            user.notSeenCount++
          }

          this.users = this.sortMembers(this.users)
        }
        if (msg.user_id === authService.getLoggedUser().id) {
          return
        }
        if (0 !== this.users.filter(user => user.id === msg.user_id).length) {
          return
        }

        this.users.unshift({
          id: msg.user_id,
          chat_id: msg.chatId,
          name: msg.user_name
        })
      })

    this.wsSubscription = this.websocketService.websocketMessageSubject$
      .subscribe((data) => {
        if ('notifs_count' === data.type || 'see_msg' === data.type) {
          for (const user of this.users) {
            user.notSeenCount = data.msg[user.chat_id] || 0
          }
        }
      })

    this.loading = true
    this.http.get(environment.api_url + 'chats')
      .subscribe(chatPeople => {
        this.users = this.sortMembers(chatPeople)
        this.loading = false
      })
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.wsSubscription.unsubscribe()
    this.websocketSubscription.unsubscribe()
    this.chatChangeSubscription.unsubscribe()
    this.routeSubscription.unsubscribe()
  }

  changeUser(user) {
    this.activeUserId = user.id

    return this.router.navigate([`/chat/user/${user.id}`])
  }

  private sortMembers(members) {
    return members.sort((a, b) => (a.lastMessageAt > b.lastMessageAt ? -1 : 1))
  }
}
