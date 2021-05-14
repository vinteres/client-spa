import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.sass']
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

  constructor() { }

  ngOnInit(): void {
  }

}
