import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialPagosFormComponent } from './historial-pagos-form.component';

describe('HistorialPagosFormComponent', () => {
  let component: HistorialPagosFormComponent;
  let fixture: ComponentFixture<HistorialPagosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialPagosFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialPagosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
