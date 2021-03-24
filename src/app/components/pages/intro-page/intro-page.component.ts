import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { IntrosService } from 'src/app/services/intros.service';
import { faPlay, faPause, faHeart, faFlag } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { NotificationsService } from 'src/app/services/notifications.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CHttp } from 'src/app/services/chttp.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'intro-page',
  templateUrl: './intro-page.component.html',
  styleUrls: ['./intro-page.component.sass']
})
export class IntroPageComponent implements OnInit {
  faPlay = faPlay
  faPause = faPause
  faHeart = faHeart
  faFlag = faFlag

  loading: boolean
  intros: any = []
  page: number = 1
  noMoreItems: boolean = false

  introLikeLoading = {}
  selectedIntro: any

  parentSubject: Subject<any> = new Subject()

  videosPlaying = {}
  audioPlaying = {}

  // Report
  reportType: string
  reportDetails: string
  reporting: any = {}
  reportIntro: any

  constructor(
    public introsService: IntrosService,
    private notificationsService: NotificationsService,
    private elem: ElementRef,
    private modalService: NgbModal,
    private router: Router,
    private http: CHttp,
    private notifierService: NotifierService
  ) {
    this.loadIntros()
  }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    const maxHeight = window.innerHeight * 0.9
    const n: any = document.documentElement || document.body.parentNode || document.body
    const scrollTop = window.pageYOffset || n.scrollTop

    if(scrollTop > maxHeight ) {
      this.loadIntros()
    }
  }

  loadIntros() {
    if (this.noMoreItems) return

    this.loading = true

    this.getIntros()
      .subscribe(intros => {
        for (const intro of intros) this.intros.push(intro)
        if (0 === intros.length) {
          this.noMoreItems = true
        }

        if (1 === this.page) {
          this.notificationsService.countSubject$.next({ type: 'intro', count: 0 })
        }

        this.loading = false
        this.page++
      })
  }

  getIntros() {
    return this.introsService.getForUser(this.page)
  }

  hover(index) {
    this.parentSubject.next({ play: index })
  }

  timeupdate(ix, $event, audiobar) {
    audiobar.setAttribute('value', ($event.target.currentTime / $event.target.duration).toString())
  }

  toggleVideo(index) {
    if (this.videosPlaying[index]) {
      this.leave(index)
    } else {
      this.hover(index)
    }
  }

  leave(index) {
    this.parentSubject.next({ pause: index })
  }

  like(intro) {
    this.introLikeLoading[intro.id] = true
    this.introsService.like(intro.id)
      .subscribe(result => {
        intro.liked_at = Date.now()

        if ('success' === result.status) {
          this.notifierService.notify('success', 'You are now matched!')
        }
      }, () => {
        this.introLikeLoading[intro.id] = false
      })
  }

  open(content, intro) {
    this.selectedIntro = intro
    this.modalService.open(content, { size: 'sm' })
  }

  message() {
    this.modalService.dismissAll()
    this.router.navigateByUrl(`/chat/user/${this.selectedIntro.fromUserId}`)
  }

  openReportModal(content, intro) {
    this.reportType = ''
    this.reportDetails = ''
    this.reportIntro = intro
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'sm' }).result
  }

  sendReport(type) {
    const payload = {
      type,
      toUserId: this.reportIntro.user.id,
      details: this.reportDetails
    }

    this.reporting[this.reportIntro.userId] = true
    this.http.post(environment.api_url + 'report', payload)
      .subscribe(response => {
        for (const intro of this.intros) {
          if (intro.user.id !== this.reportIntro.user.id) continue

          intro.user.reported = true
        }
        this.modalService.dismissAll()
        this.notifierService.notify('success', 'Report sent')
      }, () => {
        this.reporting[this.reportIntro.userId] = false
        this.notifierService.notify('error', 'Error')
      })
  }
}
