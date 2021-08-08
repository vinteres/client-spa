import { Component, OnInit, Input } from '@angular/core';
import { faIcons, faUserFriends } from '@fortawesome/free-solid-svg-icons';


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

  constructor() { }

  ngOnInit(): void {
  }

  imageLoaded() {
    this.loading = false;
  }
}
