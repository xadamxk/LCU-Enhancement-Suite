import { TestBed } from '@angular/core/testing';
import { LCUService } from './lcu.service';

describe('LCUService', () => {
  let service: LCUService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LCUService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
