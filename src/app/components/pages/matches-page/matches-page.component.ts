import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'matches-page',
  templateUrl: './matches-page.component.html',
  styleUrls: ['./matches-page.component.sass']
})
export class MatchesPageComponent implements OnInit {
  users: any = []
  loading: boolean

  constructor(private usersService: UsersService) {
    this.loading = true
    this.usersService.getMatches()
      .subscribe(result => {
        this.users = result
        this.loading = false
      })
  }

  ngOnInit(): void {
  }

}
