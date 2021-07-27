import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'hobbie-picker',
  templateUrl: './hobbie-picker.component.html',
  styleUrls: ['./hobbie-picker.component.scss']
})
export class HobbiePickerComponent implements OnInit {
  faTimes = faTimes;

  @Input() selectedHobbies: any;
  @Input() list: any;
  @Input() type: string;
  @Output() changed: EventEmitter<any> = new EventEmitter();

  interestSearchTimer: any;
  showInterestHighlight: boolean;
  matches: any = [];

  inpValue: string = '';

  ngOnInit(): void {
  }

  add(hobbie) {
    if (this.hasHobbie(hobbie)) { return; }

    this.selectedHobbies.push(hobbie);

    this.changed.emit(this.selectedHobbies);
  }

  remove(hobbie) {
    for (let i = 0; i < this.selectedHobbies.length; i++) {
      if (this.selectedHobbies[i].id === hobbie.id) {
        this.selectedHobbies.splice(i, 1);

        break;
      }
    }

    this.changed.emit(this.selectedHobbies);
  }

  hasHobbie(targetHobbie) {
    for (const hobbie of this.selectedHobbies) {
      if (targetHobbie.id === hobbie.id) {
        return true;
      }
    }

    return false;
  }

  keydownInput(e) {
    if (e.keyCode !== 13) return;

    this.selectedHobbies.push({ name: this.inpValue, custom: true });
    this.changed.emit(this.selectedHobbies);

    this.inpValue = '';
  }
}
