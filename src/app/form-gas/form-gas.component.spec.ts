import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGasComponent } from './form-gas.component';

describe('FormGasComponent', () => {
  let component: FormGasComponent;
  let fixture: ComponentFixture<FormGasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormGasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
