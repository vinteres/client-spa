import { Component, OnInit } from '@angular/core';
import { faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'verified-badge',
  templateUrl: './verified-badge.component.html',
  styleUrls: ['./verified-badge.component.sass']
})
export class VerifiedBadgeComponent implements OnInit {
  faVerified = faStar;

  constructor() { }

  ngOnInit(): void {
  }

}
