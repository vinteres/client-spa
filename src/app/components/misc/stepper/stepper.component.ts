import { Component, Input, OnInit } from '@angular/core';
import { CordovaService } from 'src/app/cordova.service';

@Component({
  selector: 'stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {

  @Input() activeStep: number;

  steps: Array<string> = [
    'About',
    'Description',
    'Profile',
    'Interests',
    'Photo',
    'Personality:stepper'
  ];

  constructor(public cordovaService: CordovaService) { }

  ngOnInit(): void {
  }

  get isMobile() {
    return this.cordovaService.isMobile || this.cordovaService.onCordova;
  }
}
