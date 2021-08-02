import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faTimes, faCrown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'hobbie-picker',
  templateUrl: './hobbie-picker.component.html',
  styleUrls: ['./hobbie-picker.component.scss']
})
export class HobbiePickerComponent implements OnInit {
  faTimes = faTimes;
  faFavorite = faCrown;

  @Input() selectedHobbies: any;
  @Input() list: any;
  @Input() type: string;
  @Output() changed: EventEmitter<any> = new EventEmitter();

  interestSearchTimer: any;
  showInterestHighlight: boolean;
  matches: any = [];

  error: boolean = false;

  inpValue: string = '';

  ngOnInit(): void {
  }

  add(hobbie) {
    if (this.hasHobbie(hobbie)) { return; }

    this.selectedHobbies.push(hobbie);

    this.emitEvent();
  }

  remove(hobbie) {
    for (let i = 0; i < this.selectedHobbies.length; i++) {
      if (this.selectedHobbies[i].id === hobbie.id) {
        this.selectedHobbies.splice(i, 1);

        break;
      }
    }

    this.emitEvent();
  }

  setFavorite(item) {
    let c = 0;
    item.favorite = !item.favorite;
    for (const item of this.selectedHobbies) {
      if (!item.favorite) {
        continue;
      }

      c++;
    };

    if (c > 3) {
      this.error = true;
      setTimeout(() => {
        this.error = false;
      }, 5000);

      item.favorite = !item.favorite;

      return;
    }

    this.emitEvent();

    this.selectedHobbies.sort((a, b) => b.favorite - a.favorite);
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
    this.emitEvent();

    this.inpValue = '';
  }

  private emitEvent() {
    this.changed.emit(this.selectedHobbies);
  }
}
