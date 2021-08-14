import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CordovaService } from 'src/app/cordova.service';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  @ViewChild('loginForm') public loginForm: NgForm;

  public loginData: any = {
    remember: true
  };

  public loading: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    public cordovaService: CordovaService
  ) { }

  ngOnInit() {
  }

  public login(form) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((name) => {
        form.controls[name].markAsTouched();
      });

      return;
    }

    this.loading = true;
    this.authService.login(this.loginData)
      .then((resp: any) => {
        this.setErrors(resp);

        this.loading = false;
        if ('onboarding' === resp.status) {
          this.router.navigateByUrl('/onboarding');
        } else {
          this.router.navigateByUrl('/find-people');
        }
      })
      .catch(resp => {
        this.setErrors(resp);
        this.loading = false;
      });
  }

  setErrors(resp: any) {
    if (!resp.loggedIn) {
      let errors: any = { serverError: true };
      errors = { invalidCredentials: true };

      this.loginForm.form.setErrors(errors);
    }
  }

  loadingChanged(loading: boolean) {
    this.loading = loading;
  }

  get bgImg() {
    return `url("${this.cordovaService.getImgPath('/assets/bg.jpg')}")`;
  }
}

