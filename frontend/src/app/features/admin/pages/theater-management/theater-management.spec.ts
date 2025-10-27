import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TheaterManagementComponent } from './theater-management';

describe('TheaterManagementComponent', () => {
  let component: TheaterManagementComponent;
  let fixture: ComponentFixture<TheaterManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheaterManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TheaterManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
