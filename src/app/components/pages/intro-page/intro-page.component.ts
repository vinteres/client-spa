import { Component, HostListener, OnInit } from '@angular/core'
import { IntrosService } from 'src/app/services/intros.service'
import { faPlay, faPause, faHeart, faFlag } from '@fortawesome/free-solid-svg-icons'
import { NotificationsService } from 'src/app/services/notifications.service'

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
  users: any = []
  page = 1
  noMoreItems = false

  constructor(
    public introsService: IntrosService,
    private notificationsService: NotificationsService
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

    if (scrollTop > maxHeight ) {
      this.loadIntros()
    }
  }

  loadIntros() {
    if (this.noMoreItems) { return }

    this.loading = true

    this.getIntros()
      .subscribe(users => {
        for (const user of users) this.users.push(user);

        if (0 === users.length) {
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
}
