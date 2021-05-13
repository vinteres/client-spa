import { Component, OnDestroy, ViewChild } from '@angular/core'
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
  faUserFriends,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons'
import { AuthService } from './services/auth.service'
import { WebsocketService } from './services/websocket.service'
import { NotificationsService } from './services/notifications.service'
import { environment } from 'src/environments/environment'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { NavigationStart, Router } from '@angular/router'
import { NotifierService } from 'angular-notifier'
import { CHttp } from './services/chttp.service'
import { Title } from '@angular/platform-browser'
import { ChatService } from './services/chat.service'
import { UsersService } from './services/users.service'
import { TranslateService } from '@ngx-translate/core'
import { VerificationService } from './services/verification.service'
import { OnboardingService } from './services/onboarding.service'
import { Subscription } from 'rxjs'

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
  faCompatibility = faUserFriends
  faProfile = faUserCircle
  faFeedback = faClipboardList
  faLogout = faSignOutAlt
  faClose = faTimesCircle

  @ViewChild('verifyDialog') verifyDialog

  private isInit: boolean = false;

  supportedLanguage = [
    { code: 'en', label: 'English' },
    { code: 'bg', label: 'Български' },
  ]
  currentLang: string

  baseTitle = 'Vinteres - Match with people by personality and interests.'
  title = this.baseTitle

  compatibilityCount: number

  notifsCount = {
    msg: 0,
    notif: 0,
    intro: 0
  }

  showVerifyAlert: boolean = false

  private wsSubscription: Subscription;
  private countSubscription: Subscription;
  private loginSubscription: Subscription;
  private logoutSubscription: Subscription;
  private websocketOpenSubscription: Subscription;
  private verificationModalSubscription: Subscription;

  private loadingVerificationStatus: boolean = false
  private verificationImageBlob: Blob;
  verifying: boolean = false;
  verificationStatus: {
    profileImageId: string | null,
    verificationStatus: 'verified' | 'unverified' | 'pending' | 'unverified' | null
  };
  hasVerificationBLob: boolean;

  // Feedback
  feedbackType: string
  feedbackDetails: string

  constructor(
    private authService: AuthService,
    private websocketService: WebsocketService,
    private notificationsService: NotificationsService,
    private userService: UsersService,
    private modalService: NgbModal,
    private router: Router,
    private notifierService: NotifierService,
    private chatService: ChatService,
    private http: CHttp,
    private titleService: Title,
    private translate: TranslateService,
    private verificationService: VerificationService,
    onboardingService: OnboardingService
  ) {
    this.currentLang = localStorage.getItem('lang') || 'bg'
    translate.setDefaultLang('en');
    translate.use(this.currentLang);

    this.init();

    this.router.events
      .subscribe(event => {
        if (!(event instanceof NavigationStart)) return;

        if (modalService.hasOpenModals()) {
          modalService.dismissAll();
        }
      })

    onboardingService.completedSubject$
      .subscribe(() => this.init())

    this.loginSubscription = authService.loggedInSubject$
      .subscribe(() => this.init())

    this.logoutSubscription = authService.logoutSubject$
      .subscribe(() => {
        this.notifsCount = {
          msg: 0,
          notif: 0,
          intro: 0
        }
        if (this.wsSubscription) { this.wsSubscription.unsubscribe() }
        if (this.countSubscription) { this.countSubscription.unsubscribe() }
        if (this.websocketOpenSubscription) { this.websocketOpenSubscription.unsubscribe() }
        if (this.verificationModalSubscription) { this.verificationModalSubscription.unsubscribe() }

        this.isInit = false;
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
    if (this.verificationModalSubscription) { this.verificationModalSubscription.unsubscribe() }
    this.loginSubscription.unsubscribe()
    this.logoutSubscription.unsubscribe()
  }

  init() {
    if (this.isInit) { return }
    if (!this.isActiveUser) { return }

    this.showVerifyAlert = !['pending', 'verified'].includes(this.authService.getLoggedUser().verificationStatus) &&
      this.authService.getLoggedUser().id !== localStorage.getItem('hide_verify_item')

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

    this.userService.getCompatibilityCount()
      .subscribe((result) => {
        this.compatibilityCount = result.compatibilityCount
      })

    this.countSubscription = this.notificationsService.countSubject$
      .subscribe(({ type, count }: { type: 'msg' | 'notif' | 'intro', count: number }) => {
        this.notifsCount[type] = count

        this.setTitle()
      })

    this.verificationModalSubscription = this.verificationService.modalSubject$
      .subscribe(command => {
        if ('open' !== command) return;

        this.openVerifyModal();
      })

    this.websocketService.send({ type: 'notifs_count' })

    this.isInit = true;
  }

  hideVerifyAlert() {
    localStorage.setItem('hide_verify_item', this.authService.getLoggedUser().id)
    this.showVerifyAlert = false
  }

  changeLanguage(languageCode) {
    this.translate.use(languageCode);
    localStorage.setItem('lang', languageCode);
  }

  private setTitle() {
    const title = this.notSeenCount() ? `(${this.notSeenCount()}) ${this.baseTitle}` : this.baseTitle
    this.titleService.setTitle(title)
  }

  private notSeenCount() {
    return this.notifsCount.msg + this.notifsCount.intro + this.notifsCount.notif
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

  openVerifyModal() {
    if (this.loadingVerificationStatus) return;

    this.loadingVerificationStatus = true;
    this.verificationService.getStatus()
      .subscribe(result => {
        this.loadingVerificationStatus = false;
        this.verificationStatus = result;
        const user = this.authService.getLoggedUser();

        if (user.verificationStatus != this.verificationStatus.verificationStatus) {
          user.verificationStatus = this.verificationStatus.verificationStatus;
          this.authService.addUserToStorage(user);
        }
        if (['pending', 'verified'].includes(this.verificationStatus.verificationStatus)) {
          this.showVerifyAlert = false;

          return;
        }

        this.clearCapturedImage();

        this.modalService.open(this.verifyDialog, { ariaLabelledBy: 'modal-basic-title', size: 'sm' })
          .result.then((result) => {
            this.verificationService.modalSubject$.next('close');
          }, () => {
            this.verificationService.modalSubject$.next('close');
          });
      })
  }

  openFeedbackModal(content) {
    this.feedbackType = ''
    this.feedbackDetails = ''
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'sm' })
  }

  imageCaptured(blob) {
    this.verificationImageBlob = blob;
    this.hasVerificationBLob = true;
  }

  clearCapturedImage() {
    this.hasVerificationBLob = false;
    this.verificationImageBlob = null;
  }

  sendVerificationRequest() {
    if (!this.verificationImageBlob) {
      return;
    }

    const formData = new FormData()
    formData.append('media-blob', this.verificationImageBlob)

    this.http.post(environment.api_url + 'verification/upload', formData)
      .subscribe(() => {
        this.modalService.dismissAll();

        const user = this.authService.getLoggedUser();
        user.verificationStatus = 'pending';
        this.authService.addUserToStorage(user);

        this.showVerifyAlert = false;

        this.translate.get('Verification request sent')
          .subscribe(translatedText => this.notifierService.notify('success', translatedText))
      }, () => {
        this.translate.get('Error')
          .subscribe(translatedText => this.notifierService.notify('error', translatedText))
      })
  }

  sendFeedback(type) {
    const payload = {
      type,
      details: this.feedbackDetails
    }

    this.http.post(environment.api_url + 'feedback', payload)
      .subscribe(response => {
        this.modalService.dismissAll()
        this.translate.get('Feedback sent')
          .subscribe(translatedText => this.notifierService.notify('success', translatedText))
      }, () => {
        this.translate.get('Error')
          .subscribe(translatedText => this.notifierService.notify('error', translatedText))
      })
  }

  get isActiveUser() {
    return this.isLoggedIn && 'active' === this.authService.getLoggedUser().status
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn()
  }
}
