import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CordovaService } from 'src/app/cordova.service';
import { AuthService } from 'src/app/services/auth.service';
import { CHttp } from 'src/app/services/chttp.service';
import { ModalService } from 'src/app/services/modal.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'image-upload-modal',
  templateUrl: './image-upload-modal.component.html',
  styleUrls: ['./image-upload-modal.component.scss']
})
export class ImageUploadModalComponent implements OnInit, OnDestroy {

  @ViewChild('content') content;

  uploadingImage: boolean;
  imageUploadError: string;

  private modalSubject: Subscription;

  constructor(
    private http: CHttp,
    private modalService: NgbModal,
    private authService: AuthService,
    private userService: UsersService,
    private cordovaService: CordovaService,
    appModalService: ModalService
  ) {
    this.modalSubject = appModalService.uploadProfileImageModalSubject$
      .subscribe(open => {
        if (!open) return;

        this.modalService.open(this.content, {
          size: 'sm',
          centered: true,
          backdrop: 'static',
        });
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.modalSubject.unsubscribe();
  }

  uploadImage(files) {
    if (this.uploadingImage) { return; }

    this.imageUploadError = '';

    if (!files[0]) { return; }

    const formData: FormData = new FormData();
    formData.append('image', files[0], files[0].name);

    this.uploadingImage = true;
    this.http.post(environment.api_url + `users/image/upload?position=${1}`, formData)
      .subscribe(({ images }) => {
        this.userService.setImagesSubject$.next(images);
        this.modalService.dismissAll();

        this.uploadingImage = false;
      }, (response) => {
        this.imageUploadError = response?.error?.error ?? 'Internal server error';

        this.uploadingImage = false;
      });
  }

  get image() {
    return this.cordovaService.getImgPath(
      `/assets/${this.loggedUser?.gender === 'male' ? 'man' : this.loggedUser?.gender}.jpg`
    );
  }

  get loggedUser() {
    return this.authService.getLoggedUser();
  }
}
