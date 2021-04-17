import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { Subject } from 'rxjs'

@Component({
  selector: 'modal-gallery',
  templateUrl: './modal-gallery.component.html',
  styleUrls: ['./modal-gallery.component.sass']
})
export class ModalGalleryComponent implements OnInit, OnDestroy {

  faLeft = faChevronLeft
  faRight = faChevronRight

  @Input() parentSubject: Subject<any>
  @Input() images: any

  @ViewChild('lightboxDialog') lightboxDialog

  currentImage: number
  isOpen: boolean

  private subscription

  constructor() { }

  ngOnInit() {
    this.subscription = this.parentSubject.subscribe(event => {
      this.currentImage = event.imagePosition
      this.isOpen = true
      this.lightboxDialog.nativeElement.style.display = 'block'
    })
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe() }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(e: KeyboardEvent) {
    if (!this.isOpen) { return }

    if (e.keyCode === 37) {
      // left arrow
      this.plusSlides(-1)
    } else if (e.keyCode === 39) {
        // right arrow
      this.plusSlides(1)
    } else if (e.keyCode === 27) {
      // esc
      this.close()
    }
  }

  plusSlides(d) {
    if (this.currentImage + d >= this.images.length) {
      this.currentImage = 0
    } else if (this.currentImage + d < 0) {
      this.currentImage = this.images.length - 1
    } else {
      this.currentImage += d
    }
  }

  close() {
    this.isOpen = false
    this.lightboxDialog.nativeElement.style.display = 'none'
  }
}
