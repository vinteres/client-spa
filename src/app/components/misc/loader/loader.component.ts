import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.sass']
})
export class LoaderComponent implements OnInit {
  @Input() size: string

  constructor() { }

  ngOnInit(): void {
  }

}
