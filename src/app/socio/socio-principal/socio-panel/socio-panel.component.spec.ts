import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocioPanelComponent } from './socio-panel.component';

describe('SocioPanelComponent', () => {
  let component: SocioPanelComponent;
  let fixture: ComponentFixture<SocioPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocioPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocioPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
