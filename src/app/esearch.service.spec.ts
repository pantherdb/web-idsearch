import { TestBed, inject } from '@angular/core/testing';

import { EsearchService } from './esearch.service';

describe('EsearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EsearchService]
    });
  });

  it('should be created', inject([EsearchService], (service: EsearchService) => {
    expect(service).toBeTruthy();
  }));
});
