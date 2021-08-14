import { Component, OnInit } from '@angular/core';
import { CordovaService } from 'src/app/cordova.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-title',
  templateUrl: './app-title.component.html',
  styleUrls: ['./app-title.component.scss']
})
export class AppTitleComponent implements OnInit {

  constructor(public cordovaService: CordovaService) { }

  ngOnInit(): void {
  }

  get websiteUrl() {
    return environment.website_url;
  }
}
