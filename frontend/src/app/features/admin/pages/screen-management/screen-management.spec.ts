import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScreenManagementComponent } from './screen-management';

describe('ScreenManagementComponent', () => {
  let component: ScreenManagementComponent;
  let fixture: ComponentFixture<ScreenManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
