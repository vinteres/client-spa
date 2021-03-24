import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'views-page',
  templateUrl: './views-page.component.html',
  styleUrls: ['./views-page.component.sass']
})
export class ViewsPageComponent implements OnInit {
  users: any = []
  loading: boolean

  constructor(private usersService: UsersService) {
    this.loading = true
    this.usersService.getViews()
      .subscribe(result => {
        this.users = result
        this.loading = false
      })
  }

  ngOnInit(): void {
  }
}
