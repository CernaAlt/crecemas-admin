import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasListUsuariosComponent } from './reservas-list-usuarios.component';

describe('ReservasListUsuariosComponent', () => {
  let component: ReservasListUsuariosComponent;
  let fixture: ComponentFixture<ReservasListUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasListUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasListUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
