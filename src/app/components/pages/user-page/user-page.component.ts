import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { UsersService } from 'src/app/services/users.service'
import {
  faEllipsisH,
  faEdit,
  faSave,
  faFlag,
  faHeart,
  faTimes,
  faSmoking,
  faCocktail,
  faCat,
  faChild,
  faDumbbell,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import { AuthService } from 'src/app/services/auth.service'
import { CHttp } from 'src/app/services/chttp.service'
import { environment } from 'src/environments/environment'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { HobbiesService } from 'src/app/services/hobbies.service'
import { NotifierService } from 'angular-notifier'
import { Subject } from 'rxjs'
import { IntrosService } from 'src/app/services/intros.service'

@Component({
  selector: 'user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.sass']
})
export class UserPageComponent implements OnInit {
  faEllipsisH = faEllipsisH
  faPen = faEdit
  faSave = faSave
  faFlag = faFlag
  faHeart = faHeart
  faTimesCircle = faTimes
  faBody = faDumbbell
  faSmoking = faSmoking
  faCocktail = faCocktail
  faCat = faCat
  faChild = faChild
  faPlus = faPlus

  userId: string
  user: any = null

  editingBio = false
  editingInterests = false
  editingActivities = false
  editingFrom = false

  likingIntro: boolean

  editBioText: string
  editInterestsData: any
  editActivitiesData: any
  editFromData: any

  matches: any = []
  showInterestList: boolean

  gallerySubject: Subject<any> = new Subject()
  parentSubject: Subject<any> = new Subject()

  editHobbies: any = []
  editActivities: any = []

  loading: boolean

  allHobbies: any = []
  allActivities: any = []

  loadingImages: { [key: number]: boolean } = {}

  introType: 'message' | 'audio' | 'video'
  introData: any
  introMsg: string

  // Report
  reportType: string
  reportDetails: string
  reporting: boolean

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private authService: AuthService,
    private http: CHttp,
    private modalService: NgbModal,
    private hobbiesService: HobbiesService,
    private router: Router,
    private notifierService: NotifierService,
    public introsService: IntrosService
  ) {
    hobbiesService.getAll()
      .then(hobbies => {
        this.allHobbies = hobbies
      })

    hobbiesService.getAllActivities()
      .then(activities => {
        this.allActivities = activities
      })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params.id

      this.changeUser(userId)
   })
  }

  changeUser(userId) {
    this.loading = true
    this.userId = userId
    this.usersService.getById(userId)
      .subscribe(user => {
        user.location = user.location || { fullName: '' }
        this.user = user
        this.loading = false
      }, error => {
        this.router.navigate(['/'])
      })
  }

  getBio() {
    const NO_BIO = 'No bio yet.'
    if (!this.user.description) { return NO_BIO }
    if (this.user.description.trim() === '') { return NO_BIO }

    return this.user.description
  }

  isLoggedUser() {
    return this.userId === this.authService.getLoggedUser().id
  }

  editInterests() {
    this.editHobbies = this.user.interests || []

    this.editInterestsData = this.user.interests || []
    this.matches = []
    this.showInterestList = false
    this.editingInterests = true
  }

  editFreeActivities() {
    this.editActivities = this.user.activities || []

    this.editActivitiesData = this.user.activities || []
    this.editingActivities = true
  }

  removeActivity(id) {
    for (const index in this.editActivitiesData) {
      if (this.editActivitiesData[index].id !== id) {
        continue
      }

      this.editActivitiesData.splice(index, 1)

      return
    }
  }

  removeInterest(id) {
    for (const index in this.editInterestsData) {
      if (this.editInterestsData[index].id !== id) {
        continue
      }

      this.editInterestsData.splice(index, 1)

      return
    }
  }

  saveInterests() {
    this.user.interests = this.editHobbies

    this.editingInterests = false
    this.hobbiesService.saveHobbies(this.user.interests)
      .subscribe(result => { })
  }

  saveActivities() {
    this.user.activities = this.editActivities

    this.editingActivities = false
    this.hobbiesService.saveActivities(this.user.activities)
      .subscribe(result => { })
  }

  editBio() {
    this.editBioText = this.user.bio
    this.editingBio = true
  }

  saveBio() {
    this.user.bio = this.editBioText
    this.editingBio = false
  }

  editFrom() {
    this.editFromData = { ...this.user.location, name: '' }
    this.editFromData.fullName = this.editFromData.fullName || 'Enter city name...'
    this.editingFrom = true
  }

  saveFrom() {
    if (this.user.location.id === this.editFromData.id) {
      this.editingFrom = false

      return
    }

    this.http.post(environment.api_url + 'user/location/' + this.editFromData.id)
    .subscribe(response => {
      this.user.location = this.editFromData
      this.editingFrom = false
      this.notifierService.notify('success', 'Location changed')
    })
  }

  setEditBioText(text) {
    this.editBioText = text
  }

  changeEditHobbies(e) {
    this.editHobbies = e
  }

  uploadImage(position, files, image) {
    const formData: FormData = new FormData()
    formData.append('image', files[0], files[0].name)
    this.http.post(environment.api_url + `image/upload?position=${position}`, formData)
      .subscribe(response => {
        this.user.images = response.images
        if (1 === position) {
          this.user.profile_image = this.user.images[0].small
        }
      })
  }

  removeImage(event, position) {
    event.stopPropagation()

    if (this.loadingImages[position]) { return }

    this.loadingImages[position] = true
    this.http.delete(environment.api_url + `image?position=${position}`)
      .subscribe(response => {
        this.user.images = response.images

        if (0 === response.images.length) {
          this.user.profile_image = `/assets/${this.user.gender}.jpg`
        } else {
          this.user.profile_image = response.images.find(image => 1 === image.position).small
        }
        this.loadingImages[position] = false
      }, () => {
        this.loadingImages[position] = false
      })
  }

  showImageUpload(position, file) {
    if (this.loadingImages[position]) { return }

    file.click()
  }

  showGalleryModal(imagePosition = 0) {
    if (0 === this.user.images.length || this.isLoggedUser()) { return }

    this.gallerySubject.next({ imagePosition })
  }

  showEditImageModal(content) {
    this.open(content)
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })
  }

  openReportModal(content) {
    this.reportType = ''
    this.reportDetails = ''
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'sm' })
  }

  openIntroDialog(content) {
    this.introType = 'message'
    this.introData = null
    this.introMsg = ''
    this.modalService.open(content, { centered: true, size: 'lg' })
  }

  changeIntroType(type) {
    this.introType = type
    this.introData = null
    this.introMsg = ''
  }

  bodyData() {
    const data = []
    if (this.user.height) { data.push(`${this.user.height}cm`) }
    if (this.user.body) { data.push(this.user.body) }

    return data.join(', ')
  }

  hasUserData() {
    return this.user.smoking || this.user.drinking || this.user.children_status ||
      this.user.pet_status || this.bodyData()
  }

  sendReport(type) {
    const payload = {
      type,
      toUserId: this.userId,
      details: this.reportDetails
    }

    this.reporting = true
    this.http.post(environment.api_url + 'report', payload)
      .subscribe(response => {
        this.user.reported = true
        this.reporting = false
        this.modalService.dismissAll()
        this.notifierService.notify('success', 'Report sent')
      }, () => {
        this.notifierService.notify('error', 'Error')
        this.reporting = false
      })
  }

  sendIntro() {
    const formData = new FormData()
    formData.append('introType', this.introType)
    formData.append('userId', this.userId)

    if ('message' === this.introType) {
      formData.append('message', this.introMsg)
    } else {
      formData.append('media-blob', this.introData)
    }

    this.http.post(environment.api_url + 'media/upload', formData)
      .subscribe(response => {
        this.user.relation_status = 'intro_from_me'
        this.modalService.dismissAll()
        this.notifierService.notify('success', 'Intro sent')
      }, () => {
        this.notifierService.notify('error', 'Error sending intro')
      })
  }

  sendSmile() {
    this.http.post(environment.api_url + 'smile', {
      introType: 'smile',
      userId: this.userId
    })
      .subscribe(response => {
        this.user.relation_status = 'intro_from_me'
        this.notifierService.notify('success', 'Intro sent')
      }, () => {
        this.notifierService.notify('error', 'Error sending intro')
      })
  }

  changeMedia(blob) {
    this.introData = blob
  }

  unmatch() {
    this.usersService.unmatch(this.userId)
      .subscribe(result => {
        if (result && 'success' === result.status) {
          this.user.relation_status = null
        }
      }, () => {
        this.notifierService.notify('error', 'Error')
      })
  }

  locationChanged(location) {
    this.editFromData = location
  }

  getInterests() {
    if (!this.user.interests) { return [] }

    return this.user.interests.sort((x, y) => -1 * (x.mutual - y.mutual))
  }

  getActivities() {
    if (!this.user.activities) { return [] }

    return this.user.activities
  }

  previewImages() {
    const images = []
    for (let i = 1; i < this.user.images.length; i++) {
      images.push(this.user.images[i])
    }

    return images
  }

  like(intro) {
    this.likingIntro = true
    this.introsService.like(intro.id)
      .subscribe(result => {
        intro.liked_at = Date.now()

        if ('success' === result.status) {
          this.notifierService.notify('success', 'You are now matched!')
        }

        if (result.status) {
          this.user.intro.liked_at = true
          this.user.relation_status = result.relationStatus
        }
      }, () => {
        this.likingIntro = false
      })
  }
}
