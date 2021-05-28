import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.sass']
})
export class PaginationComponent implements OnInit {

  @Input() page;
  @Input() totalPages;
  @Output() pageChange: EventEmitter<number> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  changePage(page) {
    if (0 >= page || this.totalPages < page || '..' === page) { return; }

    this.pageChange.emit(page);
  }

  pages() {
    let start = this.page - 2;
    let end;
    if (0 >= start) {
      end += Math.abs(start);
      start = 1;
    }
    end = start + 5;

    if (end > this.totalPages + 1) {
      const d = end - (this.totalPages + 1);
      end -= d;
      if (end - start < 5) {
        if (start - d > 0) { start -= d; }
        else { start = 1; }
      }
    }

    const a2 = [];
    for (let i = start; i < end; i++) {
      a2.push(i);
    }

    const f1 = [];
    if (a2[0] - 1 > 1) {
      f1.push('..');
    }
    if (a2[0] - 1 >= 1) {
      f1.push(1);
    }

    for (const i of f1) { a2.unshift(i); }

    const f2 = [];
    if (this.totalPages - a2[a2.length - 1] > 1) {
      f2.push('..');
    }
    if (this.totalPages - a2[a2.length - 1] >= 1) {
      f2.push(this.totalPages);
    }

    for (const i of f2) { a2.push(i); }

    return a2;
  }
}
