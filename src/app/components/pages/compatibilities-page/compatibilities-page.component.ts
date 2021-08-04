import { Component, OnInit } from '@angular/core';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'compatibilities-page',
  templateUrl: './compatibilities-page.component.html',
  styleUrls: ['./compatibilities-page.component.scss']
})
export class CompatibilitiesPageComponent implements OnInit {
  faSearchPref = faSlidersH;

  users: any = [];
  loading: boolean;

  ages = [];
  agesTo = [];

  searchPref: {
    fromAge: number,
    toAge: number,
    location: { cityId?: string, name: string, fullName: string }
  };

  editSearchPref: {
    fromAge: number,
    toAge: number,
    location: { cityId?: string, name: string, fullName: string }
  };

  constructor(
    private usersService: UsersService,
    private modalService: NgbModal
  ) {
    this.getCompatibilities();

    this.usersService.getSearchPref()
      .subscribe((searchPreference) => {
        this.searchPref = searchPreference;

        this.ages = this.getAges(18);
        this.agesTo = this.getAges(this.searchPref.fromAge);
      });
  }

  ngOnInit(): void {
  }

  getCompatibilities() {
    this.loading = true;
    this.usersService.getCompatibilities()
      .subscribe(result => {
        this.users = result;
        this.loading = false;
      });
  }

  private getAges(from) {
    const ages = [];
    for (let i = from; i < 100; i++) {
      ages.push(i);
    }

    return ages;
  }

  openModal(content) {
    this.editSearchPref = {
      fromAge: this.searchPref.fromAge,
      toAge: this.searchPref.toAge,
      location: { ...this.searchPref.location },
    };
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  changePref(option, value) {
    this.editSearchPref[option] = value;
    if ('fromAge' === option && value > this.editSearchPref.toAge) {
      this.editSearchPref.toAge = value;
    }
    this.agesTo = this.getAges(this.editSearchPref.fromAge);
  }

  saveSearchPref() {
    const payload = {
      fromAge: this.editSearchPref.fromAge,
      toAge: this.editSearchPref.toAge,
      cityId: this.editSearchPref.location.cityId,
    };

    this.usersService.setSearchPref(payload)
      .subscribe(() => {
        this.searchPref = {
          fromAge: this.editSearchPref.fromAge,
          toAge: this.editSearchPref.toAge,
          location: { ...this.editSearchPref.location },
        };

        this.modalService.dismissAll();

        this.getCompatibilities();
      });
  }
}
