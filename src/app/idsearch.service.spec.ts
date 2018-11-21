import { TestBed, inject } from '@angular/core/testing';

import { IdsearchService } from './idsearch.service';

describe('IdsearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdsearchService]
    });
  });

  it('should be created', inject([IdsearchService], (service: IdsearchService) => {
    expect(service).toBeTruthy();
  }));
});
