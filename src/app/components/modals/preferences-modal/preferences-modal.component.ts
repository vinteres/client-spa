import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CHttp } from 'src/app/services/chttp.service';
import { UsersService } from 'src/app/services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'src/app/services/modal.service';
import { Subscription } from 'rxjs';
import { SearchPreferenceService } from 'src/app/services/search-preference.service';

@Component({
  selector: 'preferences-modal',
  templateUrl: './preferences-modal.component.html',
  styleUrls: ['./preferences-modal.component.scss']
})
export class PreferencesModalComponent implements OnInit, OnDestroy {
  @ViewChild('content') content;

  ages = [];
  agesTo = [];

  editSearchPref: {
    fromAge: number,
    toAge: number,
    lookingFor: number,
    location: { cityId?: string, name: string, fullName: string }
  };

  private modalSubscription: Subscription;

  constructor(
    private userService: UsersService,
    private modalService: NgbModal,
    private searchPreferenceService: SearchPreferenceService,
    appModalService: ModalService
  ) {
    this.modalSubscription = appModalService.actionSubject$
      .subscribe(({ action, modal}) => {
        if ('edit-preferences' !== modal) { return; }

        if ('open' === action) {
          this.openModal();
        }
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.modalSubscription.unsubscribe();
  }

  changePref(option, value) {
    this.editSearchPref[option] = value;
    if ('fromAge' === option && value > this.editSearchPref.toAge) {
      this.editSearchPref.toAge = value;
    }
    this.agesTo = this.getAges(this.editSearchPref.fromAge);
  }

  locationChanged(location: {id: string, name: string, fullName: string}) {
    this.editSearchPref.location = {
      cityId: location.id,
      name: null,
      fullName: location.fullName,
    };
  }

  private getAges(from) {
    const ages = [];
    for (let i = from; i < 100; i++) {
      ages.push(i);
    }

    return ages;
  }

  lookingForChanged(value, checked) {
    if (checked) {
      this.editSearchPref.lookingFor |= value;
    } else {
      this.editSearchPref.lookingFor ^= value;
    }
  }

  shouldBeChecked(v: number) {
    return v === (this.editSearchPref.lookingFor & v);
  }

  openModal() {
    this.userService.getSearchPref()
      .subscribe((searchPreference) => {
        this.editSearchPref = searchPreference;

        this.ages = this.getAges(18);
        this.agesTo = this.getAges(this.editSearchPref.fromAge);

        this.modalService.open(this.content, { size: 'sm' });
      });
  }

  save() {
    const payload = {
      fromAge: this.editSearchPref.fromAge,
      toAge: this.editSearchPref.toAge,
      cityId: this.editSearchPref.location.cityId,
      lookingFor: this.editSearchPref.lookingFor
    };

    this.userService.setSearchPref(payload)
      .subscribe(() => {
        this.modalService.dismissAll();

        this.searchPreferenceService.changedSubject$.next(payload);
      });
  }
}
