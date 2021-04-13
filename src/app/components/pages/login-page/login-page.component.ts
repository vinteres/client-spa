import { Component, OnInit, ViewChild } from '@angular/core'
import { AuthService } from 'src/app/services/auth.service'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.sass']
})
export class LoginPageComponent implements OnInit {
  @ViewChild('loginForm') public loginForm: NgForm

  public loginData: any = {}

  public loading: boolean

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  public login(form) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((name) => {
        form.controls[name].markAsTouched()
      })

      return
    }

    this.loading = true
    this.authService.login(this.loginData)
      .then((resp: any) => {
        this.setErrors(resp)

        this.loading = false
        if ('onboarding' === resp.status) {
          this.router.navigateByUrl('/onboarding')
        } else {
          this.router.navigateByUrl('/find-people')
        }
      })
      .catch(resp => {
        this.setErrors(resp)
        this.loading = false
      })
  }

  setErrors(resp: any) {
    if (!resp.loggedIn) {
      let errors: any = { serverError: true }
      errors = { invalidCredentials: true }

      this.loginForm.form.get('password').setErrors(errors)
    }
  }

  public signup() {
    this.router.navigateByUrl('/sign-up')

    return false
  }
}

