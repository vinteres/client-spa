import { Component, OnInit, Output, ViewChild, EventEmitter, ChangeDetectorRef, ApplicationRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'sign-in-with',
  templateUrl: './sign-in-with.component.html',
  styleUrls: ['./sign-in-with.component.scss']
})
export class SignInWithComponent implements OnInit {
  public loading: boolean;

  @ViewChild('btn') btn;

  @Output() loadingChanged: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private authService: AuthService,
    private router: Router,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.authService.googleAuth2
      .then((auth2) => {
        auth2.attachClickHandler(
          this.btn.nativeElement,
          {},
          (googleUser) => {
            this.authService.loginWith({
              name: googleUser.Os.getName(),
              email: googleUser.Os.getEmail(),
              token: googleUser.Zb.access_token
            }).subscribe((resp: any) => {
              this.zone.run(() => {
                this.authService.loginUser(resp);

                if ('onboarding' === resp.status) {
                  this.router.navigateByUrl('/onboarding');
                } else {
                  this.router.navigateByUrl('/find-people');
                }
              });
            }, (error) => {
              this.setLoading(false);
            });
          }, (error) => {
            this.setLoading(false);
          })
      });
  }

  public signInWithGoogle() {
    this.setLoading(true);
  }

  private setLoading(loading) {
    this.loading = loading;
    this.loadingChanged.emit(loading);
  }
}
