import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutUserComponent } from './logout-user.component';

describe('LogoutUserComponent', () => {
  let component: LogoutUserComponent;
  let fixture: ComponentFixture<LogoutUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoutUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoutUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
