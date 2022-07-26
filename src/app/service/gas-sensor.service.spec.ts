import { TestBed } from '@angular/core/testing';

import { GasSensorService } from './gas-sensor.service';

describe('GasSensorService', () => {
  let service: GasSensorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GasSensorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
