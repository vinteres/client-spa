import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { CordovaService } from 'src/app/cordova.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { CHttp } from 'src/app/services/chttp.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'messages-page',
  templateUrl: './messages-page.component.html',
  styleUrls: ['./messages-page.component.scss']
})
export class MessagesPageComponent implements OnInit, OnDestroy {
  faMenuItem = faAlignJustify;
  users: any = [];
  loading: boolean;

  menuHidden: boolean;

  private wsSubscription: Subscription;
  private websocketSubscription: Subscription;

  constructor(
    private http: CHttp,
    private chatService: ChatService,
    private websocketService: WebsocketService,
    private router: Router,
    public cordovaService: CordovaService,
    authService: AuthService
  ) {
    this.websocketSubscription = chatService.chatMessageSubject$
      .subscribe(msg => {
        const user = this.users.find(item => item.chat_id === msg.chatId);
        if (user) {
          user.lastMessageAt = msg.created_at;

          if (!authService.isLoggedUser(msg.user_id) && msg.user_id !== this.getActiveUserId()) {
            if (!user.notSeenCount) {
              user.notSeenCount = 0;
            }

            user.notSeenCount++;
          }

          this.users = this.sortMembers(this.users);
        }
        if (msg.user_id === authService.getLoggedUser().id) {
          return;
        }
        if (0 !== this.users.filter(userItem => userItem.id === msg.user_id).length) {
          return;
        }

        this.users.unshift({
          id: msg.user_id,
          chat_id: msg.chatId,
          name: msg.user_name
        });
      });

    this.wsSubscription = this.websocketService.websocketMessageSubject$
      .subscribe((data) => {
        if ('notifs_count' === data.type || 'see_msg' === data.type) {
          for (const user of this.users) {
            user.notSeenCount = data.msg[user.chat_id] || 0;
          }
        }
      });

    this.loading = true;
    this.http.get(environment.api_url + 'chats')
      .subscribe(chatPeople => {
        this.users = this.sortMembers(chatPeople);
        this.loading = false;
      });
  }

  ngOnInit(): void {
  }

  showMenu(e) {
    e.stopPropagation();

    this.menuHidden = false;
  }

  ngOnDestroy() {
    this.wsSubscription.unsubscribe();
    this.websocketSubscription.unsubscribe();
  }

  changeUser(user) {
    return this.router.navigate([`/chat/user/${user.id}`]);
  }

  getActiveUserId() {
    return this.chatService.getActiveUserId();
  }

  private sortMembers(members) {
    return members.sort((a, b) => (a.lastMessageAt > b.lastMessageAt ? -1 : 1));
  }
}
