import { TestBed } from '@angular/core/testing';

import { BooksInfoService } from './books-info.service';

describe('BooksInfoService', () => {
  let service: BooksInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BooksInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
