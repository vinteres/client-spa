import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'matches-page',
  templateUrl: './matches-page.component.html',
  styleUrls: ['./matches-page.component.scss']
})
export class MatchesPageComponent implements OnInit {
  users: any = [];
  loading: boolean;
  error: boolean;

  constructor(
    private usersService: UsersService,
    alertService: AlertService
  ) {
    this.loading = true;
    this.error = false;

    this.usersService.getMatches()
      .subscribe(result => {
        this.users = result;
        this.loading = false;
      }, (error) => {
        this.loading = false;
        this.error = true;
        alertService.error('Error');
      });
  }

  ngOnInit(): void {
  }

}
