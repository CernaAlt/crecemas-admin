import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimuladorCreditosComponent } from './simulador-creditos.component';

describe('SimuladorCreditosComponent', () => {
  let component: SimuladorCreditosComponent;
  let fixture: ComponentFixture<SimuladorCreditosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimuladorCreditosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimuladorCreditosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
