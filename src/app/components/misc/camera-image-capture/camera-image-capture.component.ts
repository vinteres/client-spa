import { AfterViewInit, Component, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { VerificationService } from 'src/app/services/verification.service';

@Component({
  selector: 'camera-image-capture',
  templateUrl: './camera-image-capture.component.html',
  styleUrls: ['./camera-image-capture.component.sass']
})
export class CameraImageCaptureComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('video') video;
  @ViewChild('canvas') canvas;
  @ViewChild('photo') photo;

  @Output() imageCaptured: EventEmitter<Blob> = new EventEmitter();
  @Output() captureStarted: EventEmitter<void> = new EventEmitter();

  private width = 320;
  private height = 0;
  private stream: any;

  streaming = false;
  data: any;

  verificationModalSubscription: Subscription;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeVideo();
  }

  constructor(verificationService: VerificationService) {
    this.verificationModalSubscription = verificationService.modalSubject$
      .subscribe(command => {
        if ('close' !== command) { return; }

        this.done();
      });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.start();
  }

  ngOnDestroy() {
    this.verificationModalSubscription.unsubscribe();
  }

  private resizeVideo() {
    const video = this.video.nativeElement;
    const photo = this.photo.nativeElement;

    const targetSize = video.parentNode.getBoundingClientRect().width;
    video.height = targetSize;
    photo.height = targetSize;

    const d = Math.floor((video.videoWidth - video.videoHeight) / 2);

    video.style.marginLeft = photo.style.marginLeft = `-${d * (targetSize / video.videoHeight)}px`;
  }

  start() {
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    })
      .then((stream) => {
        this.captureStarted.emit();

        this.stream = stream;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.log('An error occurred: ' + err);
      });

    video.addEventListener('canplay', (ev) => {
      this.clearImage();

      if (this.streaming) { return; }

      this.resizeVideo();

      this.width = video.videoWidth;
      this.height = video.videoHeight;

      canvas.setAttribute('width', this.width);
      canvas.setAttribute('height', this.height);

      this.streaming = true;
    }, false);
  }

  takePicture() {
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;
    const photo = this.photo.nativeElement;

    const context = canvas.getContext('2d');
    if (this.width && this.height) {
      canvas.width = this.width;
      canvas.height = this.height;
      context.drawImage(video, 0, 0, this.width, this.height);

      canvas.toBlob((blob) => {
        this.imageCaptured.emit(blob);
      }, 'image/png');

      const data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    } else {
      this.clearImage();
    }

    this.done();
  }

  clearImage() {
    const canvas = this.canvas.nativeElement;
    const photo = this.photo.nativeElement;

    const context = canvas.getContext('2d');
    context.fillStyle = '#AAA';
    context.fillRect(0, 0, 0, 0);

    const data = canvas.toDataURL('image/png');
    this.data = data;

    photo.setAttribute('src', data);
  }

  done() {
    this.stream.stop();
    this.streaming = false;
  }
}
