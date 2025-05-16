import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocioDataComponent } from './socio-data.component';

describe('SocioDataComponent', () => {
  let component: SocioDataComponent;
  let fixture: ComponentFixture<SocioDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocioDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocioDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
