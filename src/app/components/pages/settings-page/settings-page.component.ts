import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NotifierService } from 'angular-notifier';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
  faCheck = faCheck;

  private static readonly MIN_AGE = 18;

  activeTab: string;

  loading: boolean;
  settings: any;

  profileInfoForm = new FormGroup({});
  accountInfoForm = new FormGroup({});
  securityForm = new FormGroup({});

  loadingAccountInfo: boolean;
  loadingProfileInfo: boolean;
  loadingSecurity: boolean;

  confirmPasswordModal: string;
  confirmPasswordError: boolean;

  supportedLanguage: any[];
  currentLang: string;

  constructor(
    private usersService: UsersService,
    private notifierService: NotifierService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private userService: UsersService,
    private languageService: LanguageService
  ) {
    this.currentLang = languageService.getCurrentLang();
    this.supportedLanguage = languageService.getSupportedLanguages();

    this.route.queryParams.subscribe(params => {
      this.activeTab = ['account_info', 'profile_info', 'security', 'account'].includes(params.type) ?
        params.type :
        'account_info';
    });

    this.loading = true;
    usersService.getSettings()
      .subscribe(settings => {
        this.settings = settings;

        this.createAccountInfoForm();
        this.createProfileInfoForm();
        this.createSecurityForm();

        this.loading = false;
      });
  }

  changeTab(tab) {
    this.activeTab = tab;
  }

  changeLanguage(languageCode) {
    this.languageService.langChangeSubject$.next(languageCode);
  }

  private createAccountInfoForm() {
    this.accountInfoForm = this.formBuilder.group({
      name: [this.settings.accountSettings.name, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      email: [this.settings.accountSettings.email, [Validators.required]],
      birthday:  [this.settings.accountSettings.birthday, [this.ageValidator(), Validators.required]],
      title: [this.settings.accountSettings.title, [Validators.required, Validators.minLength(5), Validators.maxLength(70)]],
      description:  [this.settings.accountSettings.description, [Validators.required, Validators.maxLength(255)]],
    });
  }

  private ageValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (SettingsPageComponent.MIN_AGE > this.userService.calculateAge(control.value)) {
        return {
          underage: 'Underage not allowed'
        };
      }

      return null;
    };
  }

  private createProfileInfoForm() {
    this.profileInfoForm = this.formBuilder.group({
      height: [this.settings.profileSettings.height, [Validators.required, Validators.min(100), Validators.max(250)]],
      personality: [this.settings.profileSettings.personality, [Validators.required]],
      zodiac: [this.settings.profileSettings.zodiac, [Validators.required]],
      income: [this.settings.profileSettings.income, [Validators.required]],
      smoking:  [this.settings.profileSettings.smoking, Validators.required],
      drinking:  [this.settings.profileSettings.drinking, Validators.required],
      body:  [this.settings.profileSettings.body, Validators.required],
      children_status:  [this.settings.profileSettings.children_status, Validators.required],
      pet_status:  [this.settings.profileSettings.pet_status, Validators.required],
      education_status:  [this.settings.profileSettings.education_status, Validators.required],
      employment_status:  [this.settings.profileSettings.employment_status, Validators.required],
    });
  }

  private createSecurityForm() {
    // const passowrdValidator = Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
    const passwordValidator = Validators.pattern('^.{8,}$');

    this.securityForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      newPassword:  ['', [Validators.required, passwordValidator]],
      confirmPassword:  ['', [Validators.required, passwordValidator]],
    });
  }

  get name() { return this.accountInfoForm.get('name'); }
  get title() { return this.accountInfoForm.get('title'); }
  get email() { return this.accountInfoForm.get('email'); }
  get birthday() { return this.accountInfoForm.get('birthday'); }
  get description() { return this.accountInfoForm.get('description'); }

  get height() { return this.profileInfoForm.get('height'); }
  get personality() { return this.profileInfoForm.get('personality'); }
  get zodiac() { return this.profileInfoForm.get('zodiac'); }
  get income() { return this.profileInfoForm.get('income'); }
  get smoking() { return this.profileInfoForm.get('smoking'); }
  get drinking() { return this.profileInfoForm.get('drinking'); }
  get body() { return this.profileInfoForm.get('body'); }
  get children_status() { return this.profileInfoForm.get('children_status'); }
  get pet_status() { return this.profileInfoForm.get('pet_status'); }
  get education_status() { return this.profileInfoForm.get('education_status'); }
  get employment_status() { return this.profileInfoForm.get('employment_status'); }

  get password() { return this.securityForm.get('password'); }
  get newPassword() { return this.securityForm.get('newPassword'); }
  get confirmPassword() { return this.securityForm.get('confirmPassword'); }

  ngOnInit(): void {
  }

  dateChange(e) {
    this.birthday.markAsDirty();
    this.birthday.setValue(e);
  }

  saveAccountInfo() {
    if (this.accountInfoForm.invalid) {
      this.markFormAsDirty(this.accountInfoForm);

      return;
    }

    if (this.loadingAccountInfo) { return; }
    if (this.accountInfoForm.invalid && this.accountInfoForm.dirty) { return; }

    this.loadingAccountInfo = true;
    this.usersService.setAccountSettings(this.accountInfoForm.value)
      .subscribe(() => {
        this.loadingAccountInfo = false;
        this.translate.get('Settings saved')
          .subscribe(translatedText => this.notifierService.notify('success', translatedText));
      }, (err) => {
        this.loadingAccountInfo = false;
        this.translate.get('Error saving')
          .subscribe(translatedText => this.notifierService.notify('error', translatedText));
      });
  }

  saveProfileInfo() {
    if (this.profileInfoForm.invalid) {
      this.markFormAsDirty(this.profileInfoForm);

      return;
    }

    if (this.loadingProfileInfo) { return; }
    if (this.profileInfoForm.invalid && this.profileInfoForm.dirty) { return; }

    this.loadingProfileInfo = true;
    this.usersService.setProfileSettings(this.profileInfoForm.value)
      .subscribe(() => {
        this.loadingProfileInfo = false;
        this.translate.get('Settings saved')
          .subscribe(translatedText => this.notifierService.notify('success', translatedText));
      }, (err) => {
        this.loadingProfileInfo = false;
        this.translate.get('Error saving')
          .subscribe(translatedText => this.notifierService.notify('error', translatedText));
      });
  }

  saveSecurity() {
    if (this.securityForm.invalid) {
      this.markFormAsDirty(this.securityForm);

      return;
    }

    if (this.securityForm.value.newPassword !== this.securityForm.value.confirmPassword) {
      this.securityForm.controls.confirmPassword.setErrors({does_not_match: true});

      return;
    }

    this.loadingSecurity = true;
    this.usersService.changePassword(this.securityForm.value.password, this.securityForm.value.newPassword)
      .subscribe(() => {
        this.loadingSecurity = false;
        this.securityForm.reset();
        this.translate.get('Password changed')
          .subscribe(translatedText => this.notifierService.notify('success', translatedText));
      }, (err) => {
        this.loadingSecurity = false;
        this.securityForm.controls.password.setErrors({invalid: true});
      });
  }

  openConfirmPassword(content) {
    if (this.settings?.deactive?.skipPassword) {
      const r = confirm('Сигурни ли сте, че искате да деактивирате акаунта ви?');

      if (r) this.deactivate();

      return;
    }
    this.confirmPasswordModal = '';
    this.confirmPasswordError = false;
    this.modalService.open(content, { size: 'sm' });
  }

  deactivate() {
    this.usersService.deactivate(this.confirmPasswordModal)
      .subscribe(response => {
        this.modalService.dismissAll();
        this.authService.logout()
          .then(() => this.router.navigate(['/login']));
      }, error => {
        if (400 === error.status) {
          this.confirmPasswordError = true;
        }
      });
  }

  hasUppercase(value) {
    return /[A-Z]+/.test(value);
  }

  hasLowercase(value) {
    return /[a-z]+/.test(value);
  }

  hasNumber(value) {
    return /[0-9]+/.test(value);
  }

  hasSpecialChar(value) {
    return /[#?!@$%^&*-]+/.test(value);
  }

  private markFormAsDirty(form: FormGroup) {
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();

      control.markAsDirty();
    });
  }

  get zodiacs() {
    return this.userService.ZODIAC_SIGNS;
  }
}
