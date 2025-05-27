import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificacionesFormComponent } from './calificaciones-form.component';

describe('CalificacionesFormComponent', () => {
  let component: CalificacionesFormComponent;
  let fixture: ComponentFixture<CalificacionesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalificacionesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalificacionesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
