import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'compatibilities-page',
  templateUrl: './compatibilities-page.component.html',
  styleUrls: ['./compatibilities-page.component.sass']
})
export class CompatibilitiesPageComponent implements OnInit {
  users: any = [];
  loading: boolean;

  constructor(private usersService: UsersService) {
    this.loading = true;
    this.usersService.getCompatibilities()
      .subscribe(result => {
        this.users = result;
        this.loading = false;
      });
  }

  ngOnInit(): void {
  }
}
