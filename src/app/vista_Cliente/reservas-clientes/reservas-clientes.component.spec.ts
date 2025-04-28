import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasClientesComponent } from './reservas-clientes.component';

describe('ReservasClientesComponent', () => {
  let component: ReservasClientesComponent;
  let fixture: ComponentFixture<ReservasClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
