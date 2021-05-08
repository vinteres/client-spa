import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RoutingModule } from './routing.module'
import { AppComponent } from './app.component'
import { UserPageComponent } from './components/pages/user-page/user-page.component'
import { UserItemComponent } from './components/user-item/user-item.component'
import { MessagesPageComponent } from './components/pages/chat/messages-page/messages-page.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { SettingsPageComponent } from './components/pages/settings-page/settings-page.component'
import 'bootstrap'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { FindPeoplePageComponent } from './components/pages/find-people-page/find-people-page.component'
import { UserChatComponent } from './components/pages/chat/user-chat/user-chat.component'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { LoginPageComponent } from './components/pages/login-page/login-page.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { customHttpProvider } from './services/chttp.service'
import { NotificationPageComponent } from './components/pages/notification-page/notification-page.component'
import { HobbiePickerComponent } from './components/hobbie-picker/hobbie-picker.component'
import { DatePickerComponent } from './components/date-picker/date-picker.component'
import { MediaRecorderComponent } from './components/media-recorder/media-recorder.component'
import { IntroPageComponent } from './components/pages/intro-page/intro-page.component'
import { AudioPlayerComponent } from './components/audio-player/audio-player.component'
import { VideoPlayerComponent } from './components/video-player/video-player.component'
import { NotifierModule, NotifierOptions } from 'angular-notifier'
import { ModalGalleryComponent } from './components/modal-gallery/modal-gallery.component'
import { SuspendedPageComponent } from './components/pages/suspended-page/suspended-page.component'
import { LoaderComponent } from './components/misc/loader/loader.component'
import { PaginationComponent } from './components/misc/pagination/pagination.component'
import { LocationSelectComponent } from './components/misc/location-select/location-select.component'
import { SignUpPageComponent } from './components/pages/sign-up-page/sign-up-page.component'
import { OnboardingPageComponent } from './components/pages/onboarding-page/onboarding-page.component'
import { ViewsPageComponent } from './components/pages/views-page/views-page.component'
import { CompatabilitiesPageComponent } from './components/pages/compatabilities-page/compatabilities-page.component'
import { SmileComponent } from './components/misc/smile/smile.component'
import { MatchesPageComponent } from './components/pages/matches-page/matches-page.component';
import { AppTitleComponent } from './components/misc/app-title/app-title.component';
import { AppInfoComponent } from './components/misc/app-info/app-info.component';
import { VerifiedBadgeComponent } from './components/misc/verified-badge/verified-badge.component'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OnlineComponent } from './components/misc/online/online.component';
import { CameraImageCaptureComponent } from './components/misc/camera-image-capture/camera-image-capture.component';
import { LinkifyPipe } from './pipes/linkify.pipe'
import { HTMLEscapeUnescapeModule } from 'html-escape-unescape'

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'bottom',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: false,
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
}

@NgModule({
  declarations: [
    AppComponent,
    UserPageComponent,
    UserItemComponent,
    MatchesPageComponent,
    MessagesPageComponent,
    SettingsPageComponent,
    FindPeoplePageComponent,
    UserChatComponent,
    LoginPageComponent,
    NotificationPageComponent,
    HobbiePickerComponent,
    DatePickerComponent,
    MediaRecorderComponent,
    IntroPageComponent,
    AudioPlayerComponent,
    VideoPlayerComponent,
    ModalGalleryComponent,
    SuspendedPageComponent,
    LoaderComponent,
    PaginationComponent,
    LocationSelectComponent,
    SignUpPageComponent,
    OnboardingPageComponent,
    ViewsPageComponent,
    CompatabilitiesPageComponent,
    SmileComponent,
    AppTitleComponent,
    AppInfoComponent,
    VerifiedBadgeComponent,
    OnlineComponent,
    CameraImageCaptureComponent,
    LinkifyPipe,
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    FontAwesomeModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    NotifierModule.withConfig(customNotifierOptions),
    ReactiveFormsModule,
    HTMLEscapeUnescapeModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  providers: [
    customHttpProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
