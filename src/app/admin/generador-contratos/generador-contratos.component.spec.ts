import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneradorContratosComponent } from './generador-contratos.component';

describe('GeneradorContratosComponent', () => {
  let component: GeneradorContratosComponent;
  let fixture: ComponentFixture<GeneradorContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneradorContratosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneradorContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
