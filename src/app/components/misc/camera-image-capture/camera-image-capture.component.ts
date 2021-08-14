import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ImageCaptureServiceService } from 'src/app/services/image-capture-service.service';
import { VerificationService } from 'src/app/services/verification.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { CordovaService } from 'src/app/cordova.service';

@Component({
  selector: 'camera-image-capture',
  templateUrl: './camera-image-capture.component.html',
  styleUrls: ['./camera-image-capture.component.scss']
})
export class CameraImageCaptureComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('video') video;
  @ViewChild('canvas') canvas;
  @ViewChild('photo') photo;

  @Output() imageCaptured: EventEmitter<Blob> = new EventEmitter();
  @Output() captureStarted: EventEmitter<void> = new EventEmitter();
  @Output() cameraLoaded: EventEmitter<void> = new EventEmitter();

  private width = 320;
  private height = 0;
  private stream: any;

  streaming = false;
  data: any;
  streamingStoped = false;

  canStart: boolean = true;

  verificationModalSubscription: Subscription;
  canStartSubscription: Subscription;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeVideo();
  }

  constructor(
    private zone: NgZone,
    private androidPermissions: AndroidPermissions,
    private cordovaService: CordovaService,
    verificationService: VerificationService,
    imageCaptureService: ImageCaptureServiceService
  ) {
    this.verificationModalSubscription = verificationService.modalSubject$
      .subscribe(command => {
        if ('close' !== command) { return; }

        this.done();
      });

    this.canStartSubscription = imageCaptureService.canStartSubject$
      .subscribe((canStart) => {
        this.canStart = canStart;
      });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.start();
  }

  ngOnDestroy() {
    this.verificationModalSubscription.unsubscribe();
    this.canStartSubscription.unsubscribe();
  }

  private resizeVideo() {
    const video = this.video.nativeElement;
    const photo = this.photo.nativeElement;

    const videoParentSize = video.parentNode.getBoundingClientRect();
    const containerWidth = videoParentSize.width;
    const targetSize = containerWidth;

    if (video.videoWidth > video.videoHeight) {
      video.height = targetSize;
      photo.height = targetSize;
      const d = Math.floor((video.videoWidth - video.videoHeight) / 2);

      video.style.marginLeft = photo.style.marginLeft = `-${d * (targetSize / video.videoHeight)}px`;
    } else {
      video.parentNode.style = `max-height: ${targetSize}px; overflow: hidden;`;
      video.width = targetSize;
      photo.width = targetSize;

      const d = Math.floor((video.videoHeight - video.videoWidth) / 2);

      video.style.marginTop = photo.style.marginTop = `-${d * (targetSize / video.videoWidth)}px`;
    }
  }

  start() {
    if (!this.canStart) { return; }

    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;

    if (this.cordovaService.onCordova) {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA)
        .then(
          result => {
            if (result) {
              this.reqMedia();
            }
          },
          err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
        );

      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
    } else {
      this.reqMedia();
    }

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

  private reqMedia() {
    const video = this.video.nativeElement;

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    })
      .then((stream) => {
        this.cameraLoaded.emit();
        this.captureStarted.emit();

        this.stream = stream;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error(err);
        console.log('An error occurred: ' + err);
      });
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
        this.zone.run(() => {
          this.imageCaptured.emit(blob);
        });
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
    this.streamingStoped = true;
  }
}
