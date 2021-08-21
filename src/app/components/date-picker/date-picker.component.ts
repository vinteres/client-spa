import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {

  @Input() date: any;
  @Output() dateChange: EventEmitter<any> = new EventEmitter();
  @Output() changed: EventEmitter<any> = new EventEmitter();

  yearOptions: any = [];
  monthOptions: any = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  selectedYear: any;
  selectedMonth: any;
  selectedDay: any;

  constructor() {
    const currentYear = new Date().getFullYear();
    for (let i = 18; i <= 100; i++) {
      this.yearOptions.push(currentYear - i);
    }
  }

  ngOnInit(): void {
    const date = new Date(this.date);
    this.selectedYear = date.getFullYear();
    this.selectedMonth = date.getMonth();
    this.selectedDay = date.getDate();
  }

  getMonthDays() {
    const daysInMonth: number = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
    const daysOptions = [];
    for (let i = 0; i < daysInMonth; i++) {
      daysOptions.push(daysInMonth - i);
    }

    return daysOptions;
  }

  changeYear(event) {
    this.selectedYear = +event.target.value;

    if (!this.changeDate()) { this.changed.emit(this.value); }
  }

  changeMonth(event) {
    this.selectedMonth = +event.target.value;

    if (!this.changeDate()) { this.changed.emit(this.value); }
  }

  changeDay(event) {
    this.selectedDay = +event.target.value;

    if (!this.changeDate()) { this.changed.emit(this.value); }
  }

  changeDate() {
    if (!Number.isInteger(this.selectedYear) ||
        !Number.isInteger(this.selectedMonth) ||
        !Number.isInteger(this.selectedDay)
    ) {
      return false;
    }

    this.dateChange.emit(this.value);

    return true;
  }

  get value() {
    const month = (+this.selectedMonth + 1) < 10 ? `0${+this.selectedMonth + 1}` : (+this.selectedMonth + 1);
    const day = +this.selectedDay < 10 ? `0${+this.selectedDay}` : this.selectedDay;
    const date = `${this.selectedYear}/${month}/${day}`;

    return date;
  }
}
