import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { faIcons, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { CordovaService } from 'src/app/cordova.service';


@Component({
  selector: 'user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit, AfterViewInit {
  faPersonality = faUserFriends;
  faInterests = faIcons;

  loading: boolean = true;

  @Input() user: any;
  @ViewChild('loaderCont') loaderCont;

  constructor(private cordovaService: CordovaService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    let width = this.loaderCont.width || this.loaderCont.innerWidth || this.loaderCont.nativeElement.clientWidth;
    this.loaderCont.nativeElement.style.height = `${width}px`;
  }

  imageLoaded() {
    this.loading = false;
  }

  errorLoadingImage() {
    this.loading = false;
    this.user.profile_image = this.cordovaService.getImgPath(
      `/assets/${this.user.gender === 'male' ? 'man' : this.user.gender}.jpg`
    );
  }

  getImg(img) {
    return this.cordovaService.getImgPath2(img);
  }

  get userProfileLink() {
    return this.user.showProfileLink ? [`/user/${this.user.id}`] : [];
  }
}
