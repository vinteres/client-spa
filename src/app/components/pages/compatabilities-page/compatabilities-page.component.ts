import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'compatabilities-page',
  templateUrl: './compatabilities-page.component.html',
  styleUrls: ['./compatabilities-page.component.sass']
})
export class CompatabilitiesPageComponent implements OnInit {
  users: any = []
  loading: boolean

  constructor(private usersService: UsersService) {
    this.loading = true
    this.usersService.getCompatabilities()
      .subscribe(result => {
        this.users = result
        this.loading = false
      })
  }

  ngOnInit(): void {
  }
}
