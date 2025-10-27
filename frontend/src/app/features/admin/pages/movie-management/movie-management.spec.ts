import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieManagementComponent } from './movie-management';

describe('MovieManagementComponent', () => {
  let component: MovieManagementComponent;
  let fixture: ComponentFixture<MovieManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
