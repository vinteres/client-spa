import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'src/app/services/modal.service';
import { Subscription } from 'rxjs';
import { SearchPreferenceService } from 'src/app/services/search-preference.service';
import { CHttp } from 'src/app/services/chttp.service';
import { environment } from 'src/environments/environment';
import { IntrosService } from 'src/app/services/intros.service';

@Component({
  selector: 'like-modal',
  templateUrl: './like-modal.component.html',
  styleUrls: ['./like-modal.component.sass']
})
export class LikeModalComponent implements OnInit, OnDestroy {

  @ViewChild('content') content;
  message: string;
  loading = false;
  params: any;
  private modalSubscription: Subscription;

  constructor(
    private modalService: NgbModal,
    private http: CHttp,
    private introService: IntrosService,
    appModalService: ModalService
  ) {
    this.modalSubscription = appModalService.actionSubject$
      .subscribe(({ action, modal, params }) => {
        if ('like' !== modal) { return; }
        if ('open' !== action) { return; }

        this.params = params || {};
        this.openModal();
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.modalSubscription.unsubscribe();
  }

  openModal() {
    this.message = '';

    this.modalService.open(this.content, {
      size: 'sm',
      centered: true,
      backdrop: 'static',
    });
  }

  save() {
    const payload = {
      message: this.message,
    };

    this.http
      .post(environment.api_url + `users/${this.params.userId}/like`, payload)
      .subscribe(() => {
        this.modalService.dismissAll();

        this.introService.likeSentSubject$.next();
      });
  }
}

