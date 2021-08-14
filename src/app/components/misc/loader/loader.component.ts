import { Component, Input, OnInit } from '@angular/core';
import { CordovaService } from 'src/app/cordova.service';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input() size: string;

  constructor(public cordovaService: CordovaService) { }

  ngOnInit(): void {
  }

}
