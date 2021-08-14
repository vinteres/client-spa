import { Component, OnInit, Input } from '@angular/core';
import { faIcons, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { CordovaService } from 'src/app/cordova.service';


@Component({
  selector: 'user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit {
  faPersonality = faUserFriends;
  faInterests = faIcons;

  loading: boolean = true;

  @Input() user: any;

  constructor(private cordovaService: CordovaService) { }

  ngOnInit(): void {
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
}
