import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
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
  faPlus,
  faGraduationCap,
  faBriefcase,
  faSmileBeam,
  faComment,
  faCommentDots,
  faTimesCircle,
  faEye,
  faUserFriends,
  faChevronDown,
  faUser,
  faStar,
  faCrown,
  faIcons,
  faHourglassHalf,
  faWallet
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { CHttp } from 'src/app/services/chttp.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HobbiesService } from 'src/app/services/hobbies.service';
import { Subject, Subscription } from 'rxjs';
import { IntrosService } from 'src/app/services/intros.service';
import { VerificationService } from 'src/app/services/verification.service';
import { ModalService } from 'src/app/services/modal.service';
import { SearchPreferenceService } from 'src/app/services/search-preference.service';
import { ProfileQuestionService } from 'src/app/services/profile-question.service';
import { CordovaService } from 'src/app/cordova.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit, OnDestroy {
  faEllipsisH = faEllipsisH;
  faPen = faEdit;
  faSave = faSave;
  faFlag = faFlag;
  faHeart = faHeart;
  faTimes = faTimes;
  faBody = faDumbbell;
  faSmoking = faSmoking;
  faCocktail = faCocktail;
  faCat = faCat;
  faChild = faChild;
  faPlus = faPlus;
  faEducation = faGraduationCap;
  faEmployment = faBriefcase;
  faSmile = faSmileBeam;
  faSendMessage = faComment;
  faSendIntro = faCommentDots;
  faUnmatch = faTimesCircle;
  faLookingFor = faEye;
  faLookingForRelation = faUserFriends;
  faArrowDown = faChevronDown;
  faPersonality = faUser;
  faZodiac = faStar;
  faFavorite = faCrown;
  faCompPersonality = faUserFriends;
  faCompInterests = faIcons;
  faAge = faHourglassHalf;
  faIncome = faWallet;
  faLike = faHeart;

  @ViewChild('editAnswerDialog') editAnswerDialog;
  @ViewChild('reportDialog') reportDialog;

  userId: string;
  user: any = null;

  allProfileQuestions: {
    [key: number]: Array<{
      question_id: number,
      question_text: string
    }>
  };
  profileAnswers = [];
  editingQuestion: {
    categoryId: number,
    questionId: number,
    answer: string,
    oldAnswer: string
  };

  loadings: { editAnswer: boolean, bio: boolean } = { editAnswer: false, bio: false };

  editingBio = false;
  editingInterests = false;
  editingActivities = false;
  editingFrom = false;

  likingIntro: boolean;

  editBioText: string;
  editInterestsData: any;
  editActivitiesData: any;
  editFromData: any;

  matches: any = [];
  showInterestList: boolean;

  gallerySubject: Subject<any> = new Subject();
  editHobbies: any = [];
  editActivities: any = [];

  loading: boolean;

  allHobbies: any = [];
  allActivities: any = [];

  loadingImages: { [key: number]: boolean } = {};

  // Report
  reportType: string;
  reportDetails: string;
  reporting: boolean;

  imageUploadError: string = '';

  searchPreferenceSubscription: Subscription;
  likeSentSubscription: Subscription;
  setImagesSubject: Subscription;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private authService: AuthService,
    private http: CHttp,
    private modalService: NgbModal,
    private hobbiesService: HobbiesService,
    private router: Router,
    private verificationService: VerificationService,
    private appModalService: ModalService,
    private profileQuestionService: ProfileQuestionService,
    private cordovaService: CordovaService,
    private alertService: AlertService,
    public introsService: IntrosService,
    searchPreferenceService: SearchPreferenceService,
  ) {
    hobbiesService.getAll()
      .then(hobbies => {
        this.allHobbies = hobbies;
      })
      .catch(() => {
        this.alertService.error('Error');
      });

    hobbiesService.getAllActivities()
      .then(activities => {
        this.allActivities = activities;
      })
      .catch(() => {
        this.alertService.error('Error');
      });

    this.setImagesSubject = usersService.setImagesSubject$
      .subscribe(images => {
        if (!this.isLoggedUser) return;

        this.user.images = images;
        this.user.profile_image = images[0].big;
      });

    this.searchPreferenceSubscription = searchPreferenceService.changedSubject$
      .subscribe(({ fromAge, toAge, lookingFor, income }) => {
        this.user.lookingFor = this.getLookingForList(lookingFor);

        if (!this.user.searchPreferences) this.user.searchPreferences = {};

        this.user.searchPreferences = {
          ageRangeSet: Boolean(fromAge && fromAge),
          fromAge,
          toAge,
          income
        };
      });

    this.likeSentSubscription = this.introsService.likeSentSubject$
      .subscribe(() => {
        this.user.relation_status = 'intro_from_me';
      });

    verificationService.sentForVerificationSubject$
      .subscribe(() => {
        if (this.isLoggedUser && this.user) {
          this.user.verification_status = 'pending';
        }
      });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params.id;

      this.changeUser(userId);
    });
  }

  ngOnDestroy(): void {
    this.searchPreferenceSubscription.unsubscribe();
    this.likeSentSubscription.unsubscribe();
    this.setImagesSubject.unsubscribe();
  }

  changeUser(userId) {
    this.loading = true;
    this.userId = userId;
    this.usersService.getById(userId)
      .subscribe(user => {
        user.interests.sort((a, b) => b.favorite - a.favorite);
        user.activities.sort((a, b) => b.favorite - a.favorite);

        user.location = user.location || { fullName: '' };
        user.lookingFor = this.getLookingForList(user.looking_for_type);
        user.zodiac = this.usersService.ZODIAC_SIGNS.find(({ value }) => value === user.zodiac)?.label;
        this.user = user;
        if (!this.user.description) { this.user.description = ''; }
        this.loading = false;
      }, error => {
        this.router.navigate(['/']);
      });

    this.profileQuestionService.getUserAnswers(this.userId)
      .subscribe(({ answers, questions }) => {
        this.allProfileQuestions = questions;

        if (this.isLoggedUser) {
          const categories = Object.keys(questions).map(cId => +cId);
          const answersRes = categories.map(categoryId => {
            const answer = answers.find(answ => answ.category_id === categoryId);

            if (!answer || 'string' !== typeof answer.answer_text || '' === answer.answer_text.trim()) {
              return {
                category_id: categoryId,
                question_text: questions[categoryId][0].question_text,
                noAnswer: true
              };
            }

            return answer;
          });

          this.profileAnswers = answersRes;
        } else {
          this.profileAnswers = answers;
        }
      }, (error) => {
        this.alertService.error('Error');
      });
  }

  editAnswer(answer) {
    if (!this.isLoggedUser) { return; }

    this.editingQuestion = {
      categoryId: answer.category_id,
      questionId: answer.question_id,
      answer: answer.answer_text || '',
      oldAnswer: answer.answer_text || ''
    };

    if (!this.editingQuestion.questionId) {
      this.editingQuestion.questionId = this.allProfileQuestions[this.editingQuestion.categoryId][0].question_id;
    }

    this.modalService.open(this.editAnswerDialog, { backdrop: 'static', centered: true });
  }

  saveAsnwer() {
    if (this.loadings.editAnswer || this.editingQuestion.oldAnswer === this.editingQuestion.answer.trim()) { return; }

    this.loadings.editAnswer = true;

    this.profileQuestionService.saveAnswer(this.editingQuestion)
      .subscribe(() => {
        const answer = this.profileAnswers.find(answ => answ.category_id === this.editingQuestion.categoryId);

        answer.question_text = this.allProfileQuestions[answer.category_id]
          .find(question => question.question_id === this.editingQuestion.questionId)
          .question_text;
        answer.question_id = this.editingQuestion.questionId;
        answer.answer_text = this.editingQuestion.answer;
        answer.noAnswer = '' === this.editingQuestion.answer.trim();

        this.loadings.editAnswer = false;
        this.modalService.dismissAll();
      }, () => {
        this.loadings.editAnswer = false;

        this.alertService.error('Error');
      });
  }

  hasBio() {
    return this.user.description && '' !== this.user.description.trim();
  }

  editInterests() {
    this.editHobbies = this.user.interests || [];

    this.editInterestsData = this.user.interests || [];
    this.matches = [];
    this.showInterestList = false;
    this.editingInterests = true;
  }

  editFreeActivities() {
    this.editActivities = this.user.activities || [];

    this.editActivitiesData = this.user.activities || [];
    this.editingActivities = true;
  }

  removeActivity(id) {
    for (const index in this.editActivitiesData) {
      if (this.editActivitiesData[index].id !== id) {
        continue;
      }

      this.editActivitiesData.splice(index, 1);

      return;
    }
  }

  removeInterest(id) {
    for (const index in this.editInterestsData) {
      if (this.editInterestsData[index].id !== id) {
        continue;
      }

      this.editInterestsData.splice(index, 1);

      return;
    }
  }

  saveInterests() {
    this.user.interests = this.editHobbies;

    this.editingInterests = false;
    this.hobbiesService.saveHobbies(this.user.interests)
      .subscribe(result => { }, (error) => {
        this.alertService.error('Error');
      });
  }

  saveActivities() {
    this.user.activities = this.editActivities;

    this.editingActivities = false;
    this.hobbiesService.saveActivities(this.user.activities)
      .subscribe(result => { }, (error) => {
        this.alertService.error('Error');
      });
  }

  editBio() {
    this.editBioText = this.user.description;
    this.editingBio = true;
  }

  saveBio() {
    if (this.loadings.bio) { return; }
    if (this.user.description.trim() === this.editBioText.trim()) {
      this.editingBio = false;

      return;
    }

    this.loadings.bio = true;

    const description = this.editBioText;

    this.http.post(environment.api_url + 'users/bio', { description })
      .subscribe(() => {
        this.user.description = description;
        this.editingBio = false;

        this.loadings.bio = false;
      }, (error) => {
        this.alertService.error('Error');
      });
  }

  editFrom() {
    this.editFromData = { ...this.user.location, name: '' };
    this.editFromData.fullName = this.editFromData.fullName || 'Enter city name...';
    this.editingFrom = true;
  }

  saveFrom() {
    if (this.user.location.id === this.editFromData.id) {
      this.editingFrom = false;

      return;
    }

    this.http.post(environment.api_url + 'user/location/' + this.editFromData.id)
      .subscribe(response => {
        this.user.location = this.editFromData;
        this.editingFrom = false;
        this.alertService.success('Location changed');
      }, (error) => {
        this.alertService.error('Error');
      });
  }

  changeEditHobbies(e) {
    this.editHobbies = e;
  }

  uploadImage(position, files, image) {
    if (this.isUploading()) { return; }

    if (!files[0]) return;

    this.loadingImages[position] = true;
    this.imageUploadError = '';

    const formData: FormData = new FormData();

    formData.append('image', files[0], files[0].name);
    this.http.post(environment.api_url + `users/image/upload?position=${position}`, formData)
      .subscribe(response => {
        this.user.images = response.images;
        if (1 === position) {
          this.user.profile_image = this.user.images[0].small;
        }

        this.loadingImages[position] = false;
      }, (response) => {
        this.imageUploadError = response?.error?.error ?? 'Internal server error';
        this.loadingImages[position] = false;
      });
  }

  removeImage(event, position) {
    event.stopPropagation();

    if (this.loadingImages[position]) { return; }

    this.loadingImages[position] = true;
    this.imageUploadError = '';

    this.http.delete(environment.api_url + `users/image?position=${position}`)
      .subscribe(({ images, errMsg }) => {
        this.user.images = images;

        if (errMsg) {
          this.imageUploadError = errMsg;
          this.loadingImages[position] = false;

          return;
        }

        if (0 === images.length) {
          this.user.profile_image = this.cordovaService.getImgPath(
            `/assets/${this.user.gender === 'male' ? 'man' : this.user.gender}.jpg`
          );
        } else {
          this.user.profile_image = images.find(image => 1 === image.position).small;
        }

        this.loadingImages[position] = false;
      }, (response) => {
        this.imageUploadError = response?.error?.error ?? 'Internal server error';
        this.loadingImages[position] = false;
      });
  }

  showImageUpload(position, file) {
    if (this.isUploading()) { return; }

    file.click();
  }

  private isUploading() {
    return Object.keys(this.loadingImages)
      .map(k => this.loadingImages[k])
      .some(loading => loading);
  }

  showGalleryModal(imagePosition = 0) {
    if (0 === this.user.images.length || this.isLoggedUser) { return; }

    this.gallerySubject.next({ imagePosition });
  }

  showEditImageModal(content) {
    this.open(content);
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' });
  }

  openReportModal() {
    this.reportType = '';
    this.reportDetails = '';
    this.modalService.open(this.reportDialog, { ariaLabelledBy: 'modal-basic-title' });
  }

  openVerifyModal() {
    this.verificationService.modalSubject$.next('open');
  }

  openLikeModal() {
    if ('intro_to_me' === this.user.relation_status) {
      this.like();

      return;
    }

    this.appModalService.actionSubject$.next({
      action: 'open',
      modal: 'like',
      params: {
        userId: this.user.id,
        userName: this.user.name,
      }
    });
  }

  openSearchPrefModal() {
    this.appModalService.actionSubject$.next({
      action: 'open',
      modal: 'edit-preferences'
    });
  }

  hasUserData() {
    return this.user.smoking || this.user.drinking || this.user.children_status ||
      this.user.pet_status || this.user.height || this.user.body || this.user.income;
  }

  sendReport(type) {
    const payload = {
      type,
      toUserId: this.userId,
      details: this.reportDetails
    };

    this.reporting = true;
    this.http.post(environment.api_url + 'report', payload)
      .subscribe(response => {
        this.user.reported = true;
        this.reporting = false;
        this.modalService.dismissAll();
        this.alertService.success('Report sent');
      }, () => {
        this.alertService.error('Error');
        this.reporting = false;
      });
  }

  unmatch() {
    this.usersService.unmatch(this.userId)
      .subscribe(result => {
        this.user.relation_status = null;
      }, () => {
        this.alertService.error('Error');
      });
  }

  locationChanged(location: { id: string, name: string, fullName: string }) {
    this.editFromData = { ...location, name: '' };
  }

  getInterests() {
    if (!this.user.interests) { return []; }

    return this.user.interests.sort((x, y) => -1 * (x.mutual - y.mutual));
  }

  getActivities() {
    if (!this.user.activities) { return []; }

    return this.user.activities;
  }

  hasMoreThanOneQuestion(categoryId) {
    return this.allProfileQuestions &&
      this.allProfileQuestions[categoryId] &&
      this.allProfileQuestions[categoryId].length > 1;
  }

  private like() {
    const intro = this.user.intro;

    this.likingIntro = true;
    this.introsService.like(intro.id)
      .subscribe(result => {
        intro.liked_at = Date.now();

        this.alertService.success('You are now matched!');

        this.user.intro.liked_at = true;
        this.user.relation_status = result.relationStatus;
      }, () => {
        this.likingIntro = false;

        this.alertService.error('Error');
      });
  }

  private getLookingForList(lookingForType: number) {
    if (!lookingForType) { return []; }

    const result = [];
    Object.entries(this.usersService.LOOKING_FOR_TYPES).forEach(([k, v]) => {
      const type = +k;
      if ((lookingForType & type) === type) {
        result.push(v);
      }
    });

    return result.map((item, ix) => {
      let s = '';

      if (ix === result.length - 2) { s = ' &'; }
      else if (ix < result.length - 2) { s = ','; }

      return { item, s };
    });
  }

  get isLoggedUser() {
    return this.authService.isLoggedUser(this.userId);
  }

  get loggedUser() {
    return this.authService.getLoggedUser();
  }

  get previewImages() {
    return (Array.isArray(this.user.images) ? this.user.images : []).slice(1);
  }
}
