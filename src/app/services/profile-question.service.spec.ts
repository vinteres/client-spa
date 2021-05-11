import { TestBed } from '@angular/core/testing';

import { ProfileQuestionService } from './profile-question.service';

describe('ProfileQuestionService', () => {
  let service: ProfileQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileQuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
