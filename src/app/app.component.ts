import { Component, OnDestroy } from '@angular/core'
import {
  faHome,
  faEnvelope,
  faBell,
  faCogs,
  faEllipsisV,
  faHeartbeat,
  faUsers,
  faCommentDots,
  faUserCircle,
  faClipboardList,
  faSignOutAlt,
  faBinoculars,
  faUserFriends
} from '@fortawesome/free-solid-svg-icons'
import { AuthService } from './services/auth.service'
import { WebsocketService } from './services/websocket.service'
import { NotificationsService } from './services/notifications.service'
import { environment } from 'src/environments/environment'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Router } from '@angular/router'
import { NotifierService } from 'angular-notifier'
import { CHttp } from './services/chttp.service'
import { Title } from '@angular/platform-browser'
import { ChatService } from './services/chat.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnDestroy {
  faHome = faHome
  faEnvelope = faEnvelope
  faBell = faBell
  faSettings = faCogs
  faEllipsisV = faEllipsisV
  faIntro = faCommentDots
  faFindPeople = faUsers
  faMatch = faHeartbeat
  faViews = faBinoculars
  faCompatability = faUserFriends
  faProfile = faUserCircle
  faFeedback = faClipboardList
  faLogout = faSignOutAlt

  baseTitle = 'Vinterest'
  title = this.baseTitle

  notifsCount = {
    msg: 0,
    notif: 0,
    intro: 0
  }

  private wsSubscription
  private countSubscription
  private loginSubscription
  private logoutSubscription
  private websocketOpenSubscription

  // Feedback
  feedbackType: string
  feedbackDetails: string

  constructor(
    private authService: AuthService,
    private websocketService: WebsocketService,
    private notificationsService: NotificationsService,
    private modalService: NgbModal,
    private router: Router,
    private notifierService: NotifierService,
    private chatService: ChatService,
    private http: CHttp,
    private titleService: Title
  ) {
    this.init()

    this.loginSubscription = authService.loggedInSubject$
      .subscribe(() => {
        this.init()
      })

    this.logoutSubscription = authService.logoutSubject$
      .subscribe(() => {
        this.notifsCount = {
          msg: 0,
          notif: 0,
          intro: 0
        }
        if (this.wsSubscription) { this.wsSubscription.unsubscribe() }
        if (this.countSubscription) { this.countSubscription.unsubscribe() }
      })

    this.websocketOpenSubscription = this.websocketService.websocketOpenSubject$
      .subscribe(() => {
        this.websocketService.send({ type: 'notifs_count' })
      })
  }

  ngOnDestroy() {
    if (this.wsSubscription) { this.wsSubscription.unsubscribe() }
    if (this.countSubscription) { this.countSubscription.unsubscribe() }
    if (this.websocketOpenSubscription) { this.websocketOpenSubscription.unsubscribe() }
    this.loginSubscription.unsubscribe()
    this.logoutSubscription.unsubscribe()
  }

  init() {
    if (!this.isActiveUser()) { return }

    this.wsSubscription = this.websocketService.websocketMessageSubject$
      .subscribe((data) => {
        if ('notif' === data.type) {
          this.notifsCount.notif++
          this.notificationsService.playSound()
        } else if (
          'msg' === data.type &&
          !this.authService.isLoggedUser(data.user_id) &&
          this.chatService.getActiveUserId() !== data.user_id
        ) {
          this.notifsCount.msg++
          this.notificationsService.playSound()
        } else if ('intro' === data.type) {
          this.notifsCount.intro++
        } else if ('notifs_count' === data.type) {
          const notifData = { ...data }
          let notSeenMsgs = 0
          Object.keys(data.msg).forEach(chatId => notSeenMsgs += data.msg[chatId])
          notifData.msg = notSeenMsgs
          this.notifsCount = notifData
        } else if ('see_msg' === data.type) {
          let notSeenMsgs = 0
          Object.keys(data.msg).forEach(chatId => notSeenMsgs += data.msg[chatId])
          this.notifsCount.msg = notSeenMsgs
        } else if ('see_intros' === data.type) {
          this.notifsCount.intro = 0
        } else if ('see_notifs' === data.type) {
          this.notifsCount.notif = 0
        }

        this.setTitle()
      })

    this.countSubscription = this.notificationsService.countSubject$
      .subscribe(({ type, count }: { type: 'msg' | 'notif' | 'intro', count: number }) => {
        this.notifsCount[type] = count

        this.setTitle()
      })
  }

  private setTitle() {
    const title = this.notSeenCount() ? `(${this.notSeenCount()}) ${this.baseTitle}` : this.baseTitle
    this.titleService.setTitle(title)
  }

  private notSeenCount() {
    return this.notifsCount.msg + this.notifsCount.intro + this.notifsCount.notif
  }

  private isActiveUser() {
    return this.isLoggedIn() && 'active' === this.authService.getLoggedUser().status
  }

  isLoggedIn() {
    return this.authService.isLoggedIn()
  }

  loggedUser() {
    return this.authService.getLoggedUser()
  }

  openIntroDialog(content) {
    this.modalService.open(content, { centered: true })
  }

  logout() {
    this.authService.logout()
      .then(() => {
        this.router.navigate(['/login'])
      })
  }

  openFeedbackModal(content) {
    this.feedbackType = ''
    this.feedbackDetails = ''
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'sm' })
  }

  sendFeedback(type) {
    const payload = {
      type,
      details: this.feedbackDetails
    }

    this.http.post(environment.api_url + 'feedback', payload)
      .subscribe(response => {
        this.modalService.dismissAll()
        this.notifierService.notify('success', 'Feedback sent')
      }, () => {
        this.notifierService.notify('error', 'Error')
      })
  }
}
