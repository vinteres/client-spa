import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { Subject } from 'rxjs'

@Component({
  selector: 'audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.sass']
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  faPlay = faPlay
  faPause = faPause

  @Input() src
  @Input() index
  @Input() parentSubject: Subject<any>

  @ViewChild('media') media

  playing: boolean
  private subscription

  constructor() { }

  ngOnInit() {
    this.subscription = this.parentSubject.subscribe(event => {
      if (event.play === this.index) {
        this.media.nativeElement.play()
      } else if (event.pause === this.index) {
        this.media.nativeElement.pause()
      }
    })
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe() }
  }

  timeupdate($event, audiobar) {
    audiobar.setAttribute('value', ($event.target.currentTime / $event.target.duration).toString())
  }

  play() {
    this.playing = true
  }

  pause() {
    this.playing = false
  }

  toggleMedia() {
    if (this.playing) {
      this.media.nativeElement.pause()
    } else {
      this.media.nativeElement.play()
    }
  }
}
