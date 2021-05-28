import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.sass']
})
export class UserItemComponent implements OnInit {
  @Input() user: any;

  constructor() { }

  ngOnInit(): void {
  }
}
