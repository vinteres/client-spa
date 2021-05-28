import { Component, OnInit, AfterViewChecked, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { CHttp } from 'src/app/services/chttp.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'user-chat',
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.sass']
})
export class UserChatComponent implements OnInit, OnDestroy, AfterViewChecked, OnDestroy {
  chat = null;
  loading = true;
  userId: string;
  loadingMore: boolean;

  scrolledAtBottom: boolean;

  chatSubscription: Subscription;
  websocketOpenSubscription: Subscription;
  websocketSubscription: Subscription;

  chatMsg: { [key: string]: string } = {};

  @ViewChild('messagesCont') messagesCont;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService,
    private websocketService: WebsocketService,
    private http: CHttp,
    private router: Router
  ) {
    this.chatSubscription = chatService.chatMessageSubject$
      .subscribe(message => {
        if (message.chatId !== this.chat.chatId) { return; }

        chatService.seeMessage(message.chatId);
        this.scrolledAtBottom = this.isScrolledAtBottom();
        this.chat.messages.push(message);
      });

    this.websocketOpenSubscription = this.websocketService.websocketOpenSubject$
      .subscribe(() => {
        if (!this.chat) { return; }

        const lastMsg = this.chat.messages[this.chat.messages.length - 1];
        this.websocketService.send({
          type: 'msgs',
          chatId: this.chat.chatId,
          after: (lastMsg ? lastMsg.created_at : null)
        });
      });

    this.websocketSubscription = websocketService.websocketMessageSubject$
      .subscribe(payload => {
        if ('msgs' !== payload.type) { return; }
        if (!this.chat) { return; }
        if (payload.chatId !== this.chat.chatId) { return; }

        this.scrolledAtBottom = this.isScrolledAtBottom();
        let fromOtherUser = false;
        for (const message of payload.messages) {
          if (!this.chat.messages.find(msg => msg.id === message.id)) {
            this.chat.messages.push(message);

            if (!this.isFromLoggedUser(message.user_id)) { fromOtherUser = true; }
          }
        }

        chatService.seeMessage(this.chat.chatId);
      });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params.id;
      if (!this.chatMsg[userId]) { this.chatMsg[userId] = ''; }

      this.changeChat(userId);
    });
  }

  ngOnDestroy() {
    this.chatService.setActiveUserId(null);

    this.chatSubscription.unsubscribe();
    this.websocketOpenSubscription.unsubscribe();
    this.websocketSubscription.unsubscribe();
  }

  ngAfterViewChecked() {
    if (!this.messagesCont || !this.messagesCont.nativeElement) { return; }

    if (this.scrolledAtBottom) {
      this.scrollToBottom();
      this.scrolledAtBottom = false;
    }
  }

  isScrolledAtBottom() {
    const h = this.messagesCont.nativeElement.clientHeight + this.messagesCont.nativeElement.scrollTop;
    const atBottom = Math.ceil(h) === this.messagesCont.nativeElement.scrollHeight;

    return atBottom;
  }

  scrollToBottom() {
    this.messagesCont.nativeElement.scrollTo(0, this.messagesCont.nativeElement.scrollHeight);
  }

  changeChat(userId) {
    this.userId = userId;
    this.loading = true;

    this.http.get(environment.api_url + `chat/${this.userId}`)
      .subscribe((result: any) => {
        if (!result.member) {
          this.router.navigateByUrl('/chat');

          return;
        }

        this.chat = result;
        this.scrolledAtBottom = true;
        this.loading = false;

        this.chatService.setActiveUserId(userId);
      });
  }

  sendMessage(e) {
    if (e.keyCode !== 13 || e.shiftKey) {
      return;
    }

    e.preventDefault();
    const textarea = e.target;
    const text = textarea.value;

    if ('' === text.trim()) { return; }

    this.chatService.send({ text, chatId: this.chat.chatId });
    this.chatMsg[this.userId] = '';

    return false;
  }

  isFromLoggedUser(userId) {
    if (!this.authService.isLoggedIn()) {
      return false;
    }

    return userId === this.authService.getLoggedUser().id;
  }

  isNextMsgFromMe(msgIx) {
    const currMsg = this.chat.messages[msgIx];
    const nextMsg = this.chat.messages[msgIx + 1];

    if (!nextMsg || currMsg.user_id !== nextMsg.user_id) {
      return true;
    }

    return false;
  }

  getMessageDate(msg) {
    const msgDate = new Date(+msg.created_at);
    const day = msgDate.getDate() < 10 ? `0${msgDate.getDate()}` : msgDate.getDate();
    const month = msgDate.getMonth() < 10 ? `0${msgDate.getMonth() + 1}` : (msgDate.getMonth() + 1);
    const bd = `${day}/${month}/${msgDate.getFullYear()}`;

    return bd;
  }

  isFromDifferentDay(msgIx) {
    const prevMsg = this.chat.messages[msgIx - 1];
    const currMsg = this.chat.messages[msgIx];

    if (!prevMsg) { return true; }

    return 0 !== this.days(prevMsg.created_at / 1000) - this.days(currMsg.created_at / 1000);
  }

  messageTime(msg) {
    const msgTime = new Date(+msg.created_at);

    return `${this.getDateInt(msgTime.getHours())}:${this.getDateInt(msgTime.getMinutes())}`;
  }

  postedAgo(msg) {
    const now = new Date();
    const msgTime = new Date(+msg.created_at);

    const nowSec = now.getTime() / 1000;

    const d1 = this.days(nowSec);
    const d2 = this.days(msg.created_at / 1000);

    const d = d1 - d2;
    let timeAgo = '';
    if (0 === d) {
      timeAgo = 'Today';
    } else if (1 === d) {
      timeAgo = 'Yesterday';
    } else {
      timeAgo = `${this.getDateInt(msgTime.getDate())}/${this.getDateInt(msgTime.getMonth())}`;
      if (msgTime.getFullYear() !== now.getFullYear()) {
        timeAgo = `${msgTime.getFullYear()}/${timeAgo}`;
      }
    }

    return `${timeAgo} at`;
  }

  days(t) {
    return Math.floor(
      ((t / 60) / 60) / 24
    );
  }

  loadMore() {
    this.loadingMore = true;

    this.http.get(environment.api_url + `chat/${this.chat.chatId}/older?t=${this.chat.messages[0].created_at}`)
      .subscribe((result: any) => {
        for (const msg of result.messages.reverse()) {
          this.chat.messages.unshift(msg);
        }

        this.chat.hasMoreMsgs = result.hasMoreMsgs;

        this.loadingMore = false;
      }, () => {
        this.loadingMore = false;
      });
  }

  private getDateInt(i) {
    return i < 10 ? `0${i}` : `${i}`;
  }
}
