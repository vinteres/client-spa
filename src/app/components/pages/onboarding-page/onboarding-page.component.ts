import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotifierService } from 'angular-notifier';
import { AuthService } from 'src/app/services/auth.service';
import { HobbiesService } from 'src/app/services/hobbies.service';
import { OnboardingService } from 'src/app/services/onboarding.service';
import { environment } from 'src/environments/environment';
import { CHttp } from 'src/app/services/chttp.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'onboarding-page',
  templateUrl: './onboarding-page.component.html',
  styleUrls: ['./onboarding-page.component.scss']
})
export class OnboardingPageComponent implements OnInit {
  loading: boolean;
  accountInfoForm = new FormGroup({});
  aboutForm = new FormGroup({});
  profileInfoForm = new FormGroup({});
  interestsForm = new FormGroup({});
  quizForm = new FormGroup({});

  quiz;

  allHobbies: any = [];
  allActivities: any = [];

  selectedHobbies: any = [];
  selectedActivities: any = [];

  questions = [];
  questionMap = {};
  questionAnswers = {};

  location: any = { name: '', fullName: 'Your current city' };

  showIntroText = false;
  showQuizIntroText = true;
  step: number;
  quizStep = 1;

  quizComplete = false;
  uploadingImage = false;

  userImage: {
    position: number,
    small: string,
    big: string
  };

  showAgePicker: boolean = false;
  ages = [];
  agesTo = [];
  agePref = { fromAge: 18, toAge: 70 };

  imageUploadError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private onboardingService: OnboardingService,
    private notifierService: NotifierService,
    private router: Router,
    private authService: AuthService,
    private hobbiesService: HobbiesService,
    private translate: TranslateService,
    private http: CHttp,
    private userService: UsersService
  ) {
    this.onboardingService.getStep()
      .subscribe(response => {
        if (response.completed) {
          return this.handleComplete();
        }

        this.setStep(response.step);
        this.showQuizIntroText = true;
      });
  }

  ngOnInit(): void {
  }

  private handleComplete() {
    const user = this.authService.getLoggedUser();
    user.status = 'active';
    this.authService.addUserToStorage(user);

    this.onboardingService.completedSubject$.next();

    return this.router.navigateByUrl('/find-people');
  }

  private setStep(step) {
    if (1 === step) {
      this.http.get(environment.api_url + 'onboarding/account-info')
        .subscribe(resp => {
          this.createAccountInfoForm(resp);
          this.step = step;
        });
    } else if (2 === step) {
      this.createAboutForm();
      this.step = step;
    } else if (3 === step) {
      this.createProfileInfoForm();
      this.step = step;
    } else if (4 === step) {
      const setupInterests = () => {
        if (!this.allHobbies || !this.allActivities) { return; }

        this.createInterestsForm();
        this.step = step;
      };
      this.hobbiesService.getAll()
        .then(hobbies => {
          this.allHobbies = hobbies;

          setupInterests();
        });

      this.hobbiesService.getAllActivities()
        .then(activities => {
          this.allActivities = activities;

          setupInterests();
        });
    } else if (5 === step) {
      this.initDefaultUserImage();

      this.step = step;
    } else if (6 === step) {
      this.onboardingService.getQuiz()
        .subscribe(({ questions, answers }) => {
          const h = {};
          this.questions = [];
          for (const question of questions) {
            this.questions.push(question.id);

            h[question.id] = {
              id: question.id,
              step: question.quiz_step,
              text: question.text,
              answers: []
            };
          }
          for (const answer of answers) {
            h[answer.question_id].answers.push({
              id: answer.id,
              text: answer.text
            });
          }

          this.questionMap = h;
          this.createQuizForm(1);

          this.step = step;
        });
    } else if (7 === step) {
      this.step = step;
    }
  }

  private createQuizForm(step) {
    const formControls = {};
    for (const questionId of Object.keys(this.questionMap)) {
      const question = this.questionMap[questionId];

      if (question.step !== step) { continue; }

      formControls[question.id] = [this.questionAnswers[question.id] || '', [Validators.required]];
    }
    this.quizForm = this.formBuilder.group(formControls);
  }

  private createAccountInfoForm(accountInfo: any) {
    this.accountInfoForm = this.formBuilder.group({
      birthday: [accountInfo.birthday ?? '', [this.ageValidator(), Validators.required]],
      gender: [accountInfo.gender ?? '', [Validators.required]],
      name: [accountInfo.name ?? '', [Validators.minLength(3), Validators.maxLength(255), Validators.required]],
      interested_in: [accountInfo.interested_in ?? '', [Validators.required]],
      city: [accountInfo.city ?? '', [Validators.required]],
    });
  }

  private createAboutForm() {
    this.aboutForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(70)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
    });
  }

  private ageValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (18 > this.userService.calculateAge(control.value)) {
        return {
          underage: 'Underage not allowed'
        };
      }

      return null;
    };
  }

  private createProfileInfoForm() {
    this.profileInfoForm = this.formBuilder.group({
      height: ['', [Validators.required, Validators.min(100), Validators.max(250)]],
      smoking: ['', Validators.required],
      drinking: ['', Validators.required],
      body: ['', Validators.required],
      children_status: ['', Validators.required],
      pet_status: ['', Validators.required],
      education_status: ['', Validators.required],
      employment_status: ['', Validators.required],
      personality: ['', [Validators.required]],
      zodiac: ['', [Validators.required]],
      income: ['', [Validators.required]]
    });
  }

  private createInterestsForm() {
    this.interestsForm = this.formBuilder.group({
      hobbies: [[], [Validators.required, Validators.min(1)]],
      activities: [[], Validators.required],
    });
  }

  private initDefaultUserImage() {
    const { gender } = this.authService.getLoggedUser();
    const imageName = `${'male' === gender ? 'man' : 'female'}.jpg`;

    this.userImage = {
      position: 0,
      small: `/assets/${imageName}`,
      big: `/assets/${imageName}`
    };
  }

  get birthday() { return this.accountInfoForm.get('birthday'); }
  get gender() { return this.accountInfoForm.get('gender'); }
  get name() { return this.accountInfoForm.get('name'); }
  get interested_in() { return this.accountInfoForm.get('interested_in'); }
  get city() { return this.accountInfoForm.get('city'); }

  get title() { return this.aboutForm.get('title'); }
  get description() { return this.aboutForm.get('description'); }

  get height() { return this.profileInfoForm.get('height'); }
  get smoking() { return this.profileInfoForm.get('smoking'); }
  get drinking() { return this.profileInfoForm.get('drinking'); }
  get body() { return this.profileInfoForm.get('body'); }
  get children_status() { return this.profileInfoForm.get('children_status'); }
  get pet_status() { return this.profileInfoForm.get('pet_status'); }
  get education_status() { return this.profileInfoForm.get('education_status'); }
  get employment_status() { return this.profileInfoForm.get('employment_status'); }
  get personality() { return this.profileInfoForm.get('personality'); }
  get zodiac() { return this.profileInfoForm.get('zodiac'); }
  get income() { return this.profileInfoForm.get('income'); }

  get hobbies() { return this.interestsForm.get('hobbies'); }
  get activities() { return this.interestsForm.get('activities'); }

  quest(qId) {
    return this.quizForm.get(qId);
  }

  dateChange(e) {
    this.birthday.markAsDirty();
    this.birthday.setValue(e);
  }

  locationChanged(location) {
    this.location = { name: location.fullName };
    this.city.setValue(location.id);
  }

  hobbiesChanged(selected) {
    this.hobbies.setValue(selected);
  }

  interestsChanged(selected) {
    this.activities.setValue(selected);
  }

  stepQustions(step) {
    const r = [];
    for (const k of Object.keys(this.questionMap)) {
      if (this.questionMap[k].step === step) {
        r.push(this.questionMap[k]);
      }
    }

    return r;
  }

  showAgePickerStep() {
    if (this.accountInfoForm.invalid) {
      this.markFormAsDirty(this.accountInfoForm);

      return;
    }
    if (this.accountInfoForm.invalid && this.accountInfoForm.dirty) { return; }

    this.ages = this.getAges(18);
    this.agesTo = this.getAges(this.agePref.fromAge);
    this.showAgePicker = true;
  }

  private getAges(from) {
    const ages = [];
    for (let i = from; i < 100; i++) {
      ages.push(i);
    }

    return ages;
  }

  changePref(option, value) {
    this.agePref[option] = value;
    if ('fromAge' === option && value > this.agePref.toAge) {
      this.agePref.toAge = value;
    }
    this.agesTo = this.getAges(this.agePref.fromAge);
  }

  saveAccountInfo() {
    if (this.loading) { return; }
    if (this.accountInfoForm.invalid && this.accountInfoForm.dirty) { return; }

    this.loading = true;
    this.onboardingService.setAccountInfo({
      accountInfo: this.accountInfoForm.value,
      agePref: this.agePref
    })
      .subscribe(response => {
        this.loading = false;

        const user = this.authService.getLoggedUser();
        user.gender = this.accountInfoForm.value.gender;
        this.authService.addUserToStorage(user);

        this.setStep(response.step);
      }, (err) => this.handleError(err));
  }

  saveAbout() {
    if (this.aboutForm.invalid) {
      this.markFormAsDirty(this.aboutForm);

      return;
    }

    if (this.loading) { return; }
    if (this.aboutForm.invalid && this.aboutForm.dirty) { return; }

    this.loading = true;
    this.onboardingService.setAbout(this.aboutForm.value)
      .subscribe(response => {
        this.loading = false;
        this.setStep(response.step);
      }, (err) => this.handleError(err));
  }

  skipAbout() {
    if (this.loading) { return; }

    this.loading = true;
    this.onboardingService.setAbout({
      title: '',
      description: ''
    })
      .subscribe(response => {
        this.loading = false;
        this.setStep(response.step);
      }, (err) => this.handleError(err));
  }

  saveProfileInfo() {
    if (this.profileInfoForm.invalid) {
      this.markFormAsDirty(this.profileInfoForm);

      return;
    }

    if (this.loading) { return; }
    if (this.profileInfoForm.invalid && this.profileInfoForm.dirty) { return; }

    this.loading = true;
    this.onboardingService.setProfileInfo(this.profileInfoForm.value)
      .subscribe(response => {
        this.loading = false;
        this.setStep(response.step);
      }, (err) => this.handleError(err));
  }

  skipPofileInfo() {
    if (this.loading) { return; }

    this.loading = true;
    this.onboardingService.setProfileInfo({
      body: null,
      children_status: null,
      drinking: null,
      education_status: null,
      employment_status: null,
      height: null,
      pet_status: null,
      smoking: null
    })
      .subscribe(response => {
        this.loading = false;
        this.setStep(response.step);
      }, (err) => this.handleError(err));
  }

  saveInterests() {
    if (this.interestsForm.invalid) {
      this.markFormAsDirty(this.interestsForm);

      return;
    }

    if (this.loading) { return; }
    if (this.interestsForm.invalid && this.interestsForm.dirty) { return; }


    this.onboardingService.setInterests(this.interestsForm.value)
      .subscribe(response => {
        this.loading = false;
        this.setStep(response.step);
      }, (err) => this.handleError(err));
  }

  skipInterests() {
    if (this.loading) { return; }

    this.onboardingService.setInterests({
      activities: [],
      hobbies: []
    })
      .subscribe(response => {
        this.loading = false;
        this.setStep(response.step);
      }, (err) => this.handleError(err));
  }

  prevQuizStep() {
    if (1 >= this.quizStep) {
      return;
    }

    this.quizStep--;
    this.createQuizForm(this.quizStep);
  }

  saveQuiz() {
    if (this.quizForm.invalid) {
      this.markFormAsDirty(this.quizForm);

      return;
    }

    for (const qId of Object.keys(this.quizForm.value)) {
      this.questionAnswers[qId] = this.quizForm.value[qId];
    }

    this.quizStep += 1;

    if (Object.keys(this.questionAnswers).length < this.questions.length) {
      this.createQuizForm(this.quizStep);

      return;
    }

    this.quizComplete = true;
    this.onboardingService.setQuiz({ answers: this.questionAnswers })
      .subscribe(response => {
        this.loading = false;

        if (5 !== response.step) {
          this.setStep(response.step);

          return;
        }
      }, (err) => {
        this.quizComplete = true;
        this.handleError(err);
      });
  }

  // skipUpload() {
  //   if (this.uploadingImage) { return; }

  //   this.passImageStep();
  // }

  uploadImage(files) {
    if (this.uploadingImage) { return; }

    this.imageUploadError = '';

    if (!files[0]) { return; }

    const formData: FormData = new FormData();
    formData.append('image', files[0], files[0].name);

    this.uploadingImage = true;
    this.http.post(environment.api_url + `users/image/upload?position=${1}`, formData)
      .subscribe(response => {
        this.userImage = response.images[0];

        this.passImageStep();
      }, (response) => {
        this.imageUploadError = response?.error?.error ?? 'Internal server error';

        this.uploadingImage = false;
      });
  }

  complete() {
    this.onboardingService.complete()
      .subscribe(response => {
        if (response.completed) {
          this.handleComplete();
        }
      });
  }

  private passImageStep() {
    this.onboardingService.imagePass()
      .subscribe(response => {
        this.loading = false;
        this.setStep(response.step);
      }, (err) => this.handleError(err));
  }

  private handleError({ error }) {
    this.loading = false;

    if (error.completed) {
      this.handleComplete();
    } else if (error.step) {
      this.setStep(error.step);
    } else {
      this.translate.get('Error saving')
        .subscribe(translatedText => this.notifierService.notify('error', translatedText));
    }
  }

  private markFormAsDirty(form: FormGroup) {
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();

      control.markAsDirty();
    });
  }

  get stepProgress() {
    let r = 0;
    for (let i = 0; i < this.quizStep; i++) {
      r += this.stepQustions(i).length;
    }

    return r;
  }

  get zodiacs() {
    return this.userService.ZODIAC_SIGNS;
  }
}
