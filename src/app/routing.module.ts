import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompatibilitiesPageComponent } from './components/pages/compatibilities-page/compatibilities-page.component';
import { FindPeoplePageComponent } from './components/pages/find-people-page/find-people-page.component';
import { IntroPageComponent } from './components/pages/intro-page/intro-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { MatchesPageComponent } from './components/pages/matches-page/matches-page.component';
import { MessagesPageComponent } from './components/pages/chat/messages-page/messages-page.component';
import { NotificationPageComponent } from './components/pages/notification-page/notification-page.component';
import { OnboardingPageComponent } from './components/pages/onboarding-page/onboarding-page.component';
import { SettingsPageComponent } from './components/pages/settings-page/settings-page.component';
import { SignUpPageComponent } from './components/pages/sign-up-page/sign-up-page.component';
import { SuspendedPageComponent } from './components/pages/suspended-page/suspended-page.component';
import { UserChatComponent } from './components/pages/chat/user-chat/user-chat.component';
import { UserPageComponent } from './components/pages/user-page/user-page.component';
import { ViewsPageComponent } from './components/pages/views-page/views-page.component';
import { AuthGuard } from './services/auth.guard';
import { IsNotOnboardingGuard } from './services/is-not-onboarding.guard';
import { IsOnboardingGuard } from './services/is-onboarding.guard';
import { LoggedInGuard } from './services/logged-in.guard';
import { SuspendedGuard } from './services/suspended.guard';

const routes: Routes = [
  { path: 'matches', component: MatchesPageComponent, canActivate: [AuthGuard, SuspendedGuard, IsOnboardingGuard] },
  { path: 'views', component: ViewsPageComponent, canActivate: [AuthGuard, SuspendedGuard, IsOnboardingGuard] },
  { path: 'compatibilities', component: CompatibilitiesPageComponent, canActivate: [AuthGuard, SuspendedGuard, IsOnboardingGuard] },
  { path: 'find-people', component: FindPeoplePageComponent, canActivate: [AuthGuard, SuspendedGuard, IsOnboardingGuard] },
  {
    path: 'chat', component: MessagesPageComponent,
    children: [
      { path: 'user/:id', component: UserChatComponent },
    ],
    canActivate: [AuthGuard, SuspendedGuard, IsOnboardingGuard]
  },
  { path: 'likes', component: IntroPageComponent, canActivate: [AuthGuard, SuspendedGuard, IsOnboardingGuard] },
  { path: 'user/:id', component: UserPageComponent, canActivate: [AuthGuard, SuspendedGuard, IsOnboardingGuard] },
  { path: 'settings', component: SettingsPageComponent, canActivate: [AuthGuard, SuspendedGuard, IsOnboardingGuard] },
  { path: 'suspended', component: SuspendedPageComponent, canActivate: [AuthGuard, IsOnboardingGuard] },
  { path: 'onboarding', component: OnboardingPageComponent, canActivate: [AuthGuard, IsNotOnboardingGuard] },
  { path: 'login', component: LoginPageComponent, canActivate: [LoggedInGuard] },
  { path: 'sign-up', component: SignUpPageComponent, canActivate: [LoggedInGuard] },
  { path: '', redirectTo: '/find-people', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    // { useHash: true } CORDOVA BUILD
  )],
  exports: [RouterModule]
})
export class RoutingModule { }
