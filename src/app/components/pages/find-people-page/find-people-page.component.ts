import { Component, HostListener, OnInit } from '@angular/core';
import { faComments, faTimes, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { CHttp } from 'src/app/services/chttp.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'find-people-page',
  templateUrl: './find-people-page.component.html',
  styleUrls: ['./find-people-page.component.scss']
})
export class FindPeoplePageComponent implements OnInit {
  faMessage = faComments;
  faNo = faTimes;
  faSearchPref = faSlidersH;

  loading: boolean;
  page = 1;
  totalPages: number;

  users = [];

  ages = [];
  agesTo = [];

  searchPref: {
    fromAge: number,
    toAge: number,
    location?: { cityId?: string, name: string, fullName: string }
  };

  editSearchPref: {
    fromAge: number,
    toAge: number,
    location: { cityId?: string, name: string, fullName: string }
  };

  constructor(
    private userService: UsersService,
    private http: CHttp,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal
  ) {
    let foundSearchPref;
    try {
      foundSearchPref = JSON.parse(sessionStorage.getItem('find_people_pref'));
    } catch (e) { }
    foundSearchPref = foundSearchPref || {};

    this.searchPref = {
      fromAge: foundSearchPref?.fromAge ?? 18,
      toAge: foundSearchPref?.toAge ?? 70,
      location: foundSearchPref?.location ?? { name: '', fullName: '' }
    };

    this.activatedRoute.queryParams
      .subscribe(params => {

        let page;
        try {
          page = parseInt(params.page, 10);
          if (isNaN(page) || 0 >= page) {
            page = 1;
          }
        } catch (e) {
          page = 1;
        }
        this.page = page;

        this.loadUsers();
      });

    this.ages = this.getAges(18);
    this.agesTo = this.getAges(this.searchPref.fromAge);

    // this.userService.getSearchPref()
    //   .subscribe((searchPreference) => {
    //     this.searchPref = searchPreference;

    //     this.ages = this.getAges(18);
    //     this.agesTo = this.getAges(this.searchPref.fromAge);
    //   });
  }

  ngOnInit(): void {
  }

  changePref(option, value) {
    this.editSearchPref[option] = value;
    if ('fromAge' === option && value > this.editSearchPref.toAge) {
      this.editSearchPref.toAge = value;
    }
    this.agesTo = this.getAges(this.editSearchPref.fromAge);
  }

  locationChanged(location: { id: string, name: string, fullName: string }) {
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

  loadUsers() {
    this.loading = true;

    this.userService.getUsers(this.page, {
      fromAge: this.searchPref.fromAge,
      toAge: this.searchPref.toAge,
      cityId: this.searchPref?.location?.cityId
    })
      .subscribe(response => {
        this.users = response.users;
        this.loading = false;
        this.totalPages = response.totalPages;
      });
  }

  pageChange(page) {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { page }
      });
  }

  openModal(content) {
    this.editSearchPref = {
      fromAge: this.searchPref.fromAge,
      toAge: this.searchPref.toAge,
      location: { ...this.searchPref.location },
    };
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  resetSearchPref() {
    this.editSearchPref = {
      fromAge: 18,
      toAge: 70,
      location: { name: '', fullName: '' }
    };
    sessionStorage.setItem('find_people_pref', JSON.stringify(this.searchPref));
  }

  saveSearchPref() {
    // const payload = {
    //   fromAge: this.editSearchPref.fromAge,
    //   toAge: this.editSearchPref.toAge,
    //   cityId: this.editSearchPref.location.cityId,
    // };

    this.searchPref = {
      fromAge: this.editSearchPref.fromAge,
      toAge: this.editSearchPref.toAge,
      location: { ...this.editSearchPref.location },
    };
    sessionStorage.setItem('find_people_pref', JSON.stringify(this.searchPref));

    this.modalService.dismissAll();

    this.pageChange(1);
    this.loadUsers();
    // this.userService.setSearchPref(payload)
    //   .subscribe(() => {
    //     this.searchPref = {
    //       fromAge: this.editSearchPref.fromAge,
    //       toAge: this.editSearchPref.toAge,
    //       location: { ...this.editSearchPref.location },
    //     };

    //     this.modalService.dismissAll();

    //     this.pageChange(1);

    //     this.loadUsers();
    //   });
  }
}
