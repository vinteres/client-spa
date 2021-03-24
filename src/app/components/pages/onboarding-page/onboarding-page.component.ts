import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthService } from 'src/app/services/auth.service';
import { HobbiesService } from 'src/app/services/hobbies.service';
import { OnboardingService } from 'src/app/services/onboarding.service';

@Component({
  selector: 'onboarding-page',
  templateUrl: './onboarding-page.component.html',
  styleUrls: ['./onboarding-page.component.sass']
})
export class OnboardingPageComponent implements OnInit {

  loading: boolean
  accountInfoForm = new FormGroup({})
  profileInfoForm = new FormGroup({})
  interestsForm = new FormGroup({})
  quizForm = new FormGroup({})

  quiz

  allHobbies: any = []
  allActivities: any = []

  selectedHobbies: any = []
  selectedActivities: any = []

  questions = []
  questionMap = {}
  questionAnswers = {}

  location: any = { name: '', fullName: 'Your current city' }

  step: number
  quizStep: number = 1

  constructor(
    private formBuilder: FormBuilder,
    private onboardingService: OnboardingService,
    private notifierService: NotifierService,
    private router: Router,
    private authService: AuthService,
    private hobbiesService: HobbiesService
  ) {
    this.onboardingService.getStep()
      .subscribe(response => {
        if (response.completed_at) {
          return this.handleComplete()
        }

        this.setStep(response.step)
      })
  }

  ngOnInit(): void {
  }

  private handleComplete() {
    const user = this.authService.getLoggedUser()
    user.status = 'active'
    this.authService.addUserToStorage(user)

    return this.router.navigateByUrl('/find-people')
  }

  private setStep(step) {
    if (1 == step) {
      this.createAccountInfoForm()
      this.step = step
    } else if (2 == step) {
      this.createProfileInfoForm()
      this.step = step
    } else if (3 == step) {
      const setupInterests = () => {
        if (!this.allHobbies || !this.allActivities) return

        this.createInterestsForm()
        this.step = step
      }
      this.hobbiesService.getAll()
        .then(hobbies => {
          this.allHobbies = hobbies

          setupInterests()
        })

      this.hobbiesService.getAllActivities()
        .then(activities => {
          this.allActivities = activities

          setupInterests()
        })
    } else if (4 == step) {
      this.onboardingService.getQuiz()
      .subscribe(({ questions, answers }) => {
        const h = {}
        let c = 1
        this.questions = []
        for (const question of questions) {
          this.questions.push(question.id)

          h[question.id] = {
            id: question.id,
            step: question.quiz_step,
            text: question.text,
            answers: []
          }
        }
        for (const answer of answers) {
          h[answer.question_id].answers.push({
            id: answer.id,
            text: answer.text
          })
        }

        this.questionMap = h
        this.createQuizForm(1)

        this.step = step
      })
    }
  }

  private createQuizForm(step) {
    const formControls = {}
    for (const questionId of Object.keys(this.questionMap)) {
      const question = this.questionMap[questionId]

      if (question.step != step) continue

      formControls[question.id] = ['', [Validators.required]]
    }
    this.quizForm = this.formBuilder.group(formControls)
  }

  private createAccountInfoForm() {
    this.accountInfoForm = this.formBuilder.group({
      'birthday':  ['', [Validators.required]],
      'gender': ['', [Validators.required]],
      'interested_in':  ['', [Validators.required]],
      'title': ['', [Validators.required, Validators.min(1), Validators.max(70)]],
      'description':  ['', [Validators.required, Validators.min(1), Validators.max(255)]],
      'city':  ['', [Validators.required]],
    })
  }

  private createProfileInfoForm() {
    this.profileInfoForm = this.formBuilder.group({
      'height': ['', [Validators.required, Validators.min(100), Validators.max(250)]],
      'smoking':  ['', Validators.required],
      'drinking':  ['', Validators.required],
      'body':  ['', Validators.required],
      'children_status':  ['', Validators.required],
      'pet_status':  ['', Validators.required],
    })
  }

  private createInterestsForm() {
    this.interestsForm = this.formBuilder.group({
      'hobbies': [[], [Validators.required, Validators.min(1)]],
      'activities': [[], Validators.required],
    })
  }

  get birthday() { return this.accountInfoForm.get('birthday') }
  get gender() { return this.accountInfoForm.get('gender') }
  get interested_in() { return this.accountInfoForm.get('interested_in') }
  get title() { return this.accountInfoForm.get('title') }
  get description() { return this.accountInfoForm.get('description') }
  get city() { return this.accountInfoForm.get('city') }

  get height() { return this.profileInfoForm.get('height') }
  get smoking() { return this.profileInfoForm.get('smoking') }
  get drinking() { return this.profileInfoForm.get('drinking') }
  get body() { return this.profileInfoForm.get('body') }
  get children_status() { return this.profileInfoForm.get('children_status') }
  get pet_status() { return this.profileInfoForm.get('pet_status') }

  get hobbies() { return this.interestsForm.get('hobbies') }
  get activities() { return this.interestsForm.get('activities') }

  quest(qId) { return this.quizForm.get(qId) }

  dateChange(e) {
    this.birthday.setValue(e)
  }

  locationChanged(location) {
    this.location = { name: location.fullName }
    this.city.setValue(location.id)
  }

  hobbiesChanged(selected) {
    this.hobbies.setValue(selected)
  }

  interestsChanged(selected) {
    this.activities.setValue(selected)
  }

  stepQustions(step) {
    const r = []
    for (const k of Object.keys(this.questionMap)) {
      if (this.questionMap[k].step == step) {
        r.push(this.questionMap[k])
      }
    }

    return r
  }

  saveAccountInfo() {
    if (this.accountInfoForm.invalid) {
      this.markFormAsDirty(this.accountInfoForm)

      return
    }

    if (this.loading) return
    if (this.accountInfoForm.invalid && this.accountInfoForm.dirty) return

    this.loading = true
    this.onboardingService.setAccountInfo(this.accountInfoForm.value)
      .subscribe(response => {
        this.loading = false
        this.setStep(response.step)
      }, (err) => this.handleError(err))
  }

  saveProfileInfo() {
    if (this.profileInfoForm.invalid) {
      this.markFormAsDirty(this.profileInfoForm)

      return
    }

    if (this.loading) return
    if (this.profileInfoForm.invalid && this.profileInfoForm.dirty) return

    this.loading = true
    this.onboardingService.setProfileInfo(this.profileInfoForm.value)
      .subscribe(response => {
        this.loading = false
        this.setStep(response.step)
      }, (err) => this.handleError(err))
  }

  saveInterests() {
    if (this.interestsForm.invalid) {
      this.markFormAsDirty(this.interestsForm)

      return
    }

    if (this.loading) return
    if (this.interestsForm.invalid && this.interestsForm.dirty) return


    this.onboardingService.setInterests(this.interestsForm.value)
      .subscribe(response => {
        this.loading = false
        this.setStep(response.step)
      }, (err) => this.handleError(err))
  }

  saveQuiz() {
    if (this.quizForm.invalid) {
      this.markFormAsDirty(this.quizForm)

      return
    }

    for (const qId of Object.keys(this.quizForm.value)) {
      this.questionAnswers[qId] = this.quizForm.value[qId]
    }

    this.quizStep += 1

    if (Object.keys(this.questionAnswers).length < this.questions.length) {
      this.createQuizForm(this.quizStep)

      return
    }

    this.onboardingService.setQuiz({ answers: this.questionAnswers })
      .subscribe(r => {  })
  }

  private handleError({ error }) {
    this.loading = false

    if (error.completed) {
      this.handleComplete()
    } else if (error.step) {
      this.setStep(error.step)
    } else {
      this.notifierService.notify('error', 'Error saving')
    }
  }

  private markFormAsDirty(form: FormGroup) {
    Object.values(form.controls).forEach(control => {
      control.markAsTouched()

      control.markAsDirty()
    })
  }
}
