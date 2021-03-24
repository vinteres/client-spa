import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import RecordRTC from 'recordrtc'
import { CHttp } from 'src/app/services/chttp.service';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'media-recorder',
  templateUrl: './media-recorder.component.html',
  styleUrls: ['./media-recorder.component.sass']
})
export class MediaRecorderComponent implements OnInit {
  faPlay = faPlay
  faPause = faPause

  @ViewChild('previewVideo') previewVideo
  @ViewChild('replayVideo') replayVideo
  @ViewChild('replayAudio') replayAudio

  @ViewChild('audioBar') audioBar
  @ViewChild('replayVideoCont') replayVideoCont

  @Input() type
  @Output() change: EventEmitter<any> = new EventEmitter()

  private readonly MAX_VIDEO_LENGTH = 7
  private readonly MAX_AUDIO_LENGTH = 20
  private blob: any

  private recorder
  private stream

  recording: boolean
  private timeElapsed: number
  private timeElapsedInterval: any

  playing: boolean

  constructor(private http: CHttp) { }

  ngOnInit(): void {
  }

  startRecording() {
    if (this.type === 'video') {
      this.recordingVideo()
      this.timeElapsed = this.MAX_VIDEO_LENGTH
    } else if (this.type === 'audio') {
      this.recordAudio()
      this.timeElapsed = this.MAX_AUDIO_LENGTH
    }
    this.recording = true
    this.timeElapsedInterval = setInterval(() => {
      if (this.timeElapsed <= 0) {
        clearInterval(this.timeElapsedInterval)
        this.stopRecording()
      } else {
        this.timeElapsed--
      }
    }, 1000)
  }
  
  stopRecording() {
    this.recording = false
    if (this.type === 'video') {
      this.stopRecordingVideo()
    } else if (this.type === 'audio') {
      this.stopRecordingAudio()
    }

    clearInterval(this.timeElapsedInterval)
  }

  recordAudio() {
    const audioBar = this.audioBar.nativeElement

    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then(async (stream) => {
      audioBar.style.display = 'none'
      this.stream = stream

        this.recorder = RecordRTC(stream, {
            type: 'audio',
            mimeType: 'audio/webm',
        })
        this.recorder.startRecording()
    })
  }

  stopRecordingAudio() {
    const replayAudio = this.replayAudio.nativeElement
    const audioBar = this.audioBar.nativeElement

    if (!this.recorder) return

    this.recorder.stopRecording(() => {
      let blob = this.recorder.getBlob()

      audioBar.style.display = null
      replayAudio.controls = true
      replayAudio.muted = false
      replayAudio.src = window.URL.createObjectURL(blob)
      replayAudio.play()

      this.blob = blob
      this.change.emit(this.blob)

      this.stream.getAudioTracks().forEach(track => track.stop())
      this.stream.getVideoTracks().forEach(track => track.stop())
      this.recorder.destroy()
      this.recorder = null
    })
  }

  recordingVideo() {
    const v1 = this.previewVideo.nativeElement
    const replayVideoCont = this.replayVideoCont.nativeElement

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(async (stream) => {
      this.stream = stream
      replayVideoCont.style.display = 'none'
      v1.style.display = null
      v1.muted = true
      v1.srcObject = stream

      this.recorder = RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/webm',
      })
      this.recorder.startRecording()
      v1.play()
    })
  }

  stopRecordingVideo() {
    const v1 = this.previewVideo.nativeElement
    const v2 = this.replayVideo.nativeElement
    const replayVideoCont = this.replayVideoCont.nativeElement

    if (!this.recorder) return

    this.recorder.stopRecording(() => {
      v1.pause()
      v1.srcObject = null
      v1.style.display = 'none'

      let blob = this.recorder.getBlob()

      this.blob = blob
      this.change.emit(this.blob)

      this.stream.getAudioTracks().forEach(track => track.stop())
      this.stream.getVideoTracks().forEach(track => track.stop())
      this.recorder.destroy()
      this.recorder = null

      replayVideoCont.style.display = null
      v2.muted = false
      v2.src = window.URL.createObjectURL(this.blob)
      v2.play()
    })
  }

  timeupdate($event, audiobar) {
    audiobar.setAttribute('value', ($event.target.currentTime / $event.target.duration).toString())
  }

  toggleMedia() {
    const media = 'audio' === this.type ? this.replayAudio : this.replayVideo
    if (this.playing) {
      media.nativeElement.pause()
    } else {
      media.nativeElement.play()
    }
  }
}
