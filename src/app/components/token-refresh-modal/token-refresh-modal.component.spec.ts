import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenRefreshModalComponent } from './token-refresh-modal.component';

describe('TokenRefreshModalComponent', () => {
  let component: TokenRefreshModalComponent;
  let fixture: ComponentFixture<TokenRefreshModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenRefreshModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenRefreshModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
