import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'views-page',
  templateUrl: './views-page.component.html',
  styleUrls: ['./views-page.component.scss']
})
export class ViewsPageComponent implements OnInit {
  users: any = [];
  loading: boolean;
  error: boolean;

  constructor(
    private usersService: UsersService,
    alertService: AlertService
  ) {
    this.loading = true;
    this.error = false;

    this.usersService.getViews()
      .subscribe(result => {
        this.users = result;
        this.loading = false;
      }, (error) => {
        this.error = true;
        this.loading = false;
        alertService.error('Error');
      });
  }

  ngOnInit(): void {
  }
}
