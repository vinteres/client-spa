import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-title',
  templateUrl: './app-title.component.html',
  styleUrls: ['./app-title.component.scss']
})
export class AppTitleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  get websiteUrl() {
    return environment.website_url;
  }
}
