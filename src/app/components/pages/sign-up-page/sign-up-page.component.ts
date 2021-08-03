import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, NgForm, FormGroup, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPageComponent implements OnInit {
  faCheck = faCheck;

  @ViewChild('registerForm') public registerForm: NgForm;

  form = new FormGroup({});
  public showForm = true;
  public loading: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  public signup(form) {
    if (this.form.invalid) {
      this.markFormAsDirty(this.form);

      return;
    }
    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.form.controls.confirmPassword.setErrors({does_not_match: true});

      return;
    }

    const payload = this.form.value;
    delete payload.confirmPassword;

    this.loading = true;
    this.authService.create(payload)
      .subscribe((response: { user: any, onboarding: any }) => {
        this.authService.addUserToStorage(response.user);

        this.router.navigateByUrl('/onboarding');
      }, (resp) => {
        this.loading = false;
        if (400 === resp.status) {
          Object.keys(resp.error).forEach(field => {
            this.form.get(field).setErrors(resp.error[field]);
          });
        }
      });
  }

  private markFormAsDirty(form: FormGroup) {
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();

      control.markAsDirty();
    });
  }

  private createForm() {
    const passwordValidator = Validators.pattern('^.{8,}$');

    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email], [this.emailValidator.bind(this)]),
      password: new FormControl('', [Validators.required, passwordValidator]),
      confirmPassword: new FormControl('', [Validators.required, passwordValidator])
    });
  }

  emailValidator(control: AbstractControl): Observable<ValidationErrors> | null {
    return this.http.get(environment.api_url + 'email-exists?email=' + control.value);
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  public login() {
    this.router.navigateByUrl('/login');

    return false;
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

  get termsAndUsageUrl() {
    return environment.terms_and_usage_url;
  }

  loadingChanged(loading: boolean) {
    this.loading = loading;
  }

  get privacyPolicyUrl() {
    return environment.privacy_policy_url;
  }
}
