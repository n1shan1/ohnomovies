import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdminShowtimeService } from '../../services/admin-showtime.service';
import { AdminMovieService } from '../../services/admin-movie.service';
import { AdminTheaterService } from '../../services/admin-theater.service';
import {
  ShowtimeDto,
  ShowtimeRequest,
  MovieDto,
  TheaterDto,
  ScreenDto,
} from '../../../../core/models/backend-dtos';

@Component({
  selector: 'app-showtime-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    SelectModule,
    InputNumberModule,
    DatePicker,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './showtime-management.html',
  styleUrl: './showtime-management.css',
})
export class ShowtimeManagementComponent implements OnInit {
  private showtimeService = inject(AdminShowtimeService);
  private movieService = inject(AdminMovieService);
  private theaterService = inject(AdminTheaterService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  showtimes: ShowtimeDto[] = [];
  movies: MovieDto[] = [];
  theaters: TheaterDto[] = [];
  screens: ScreenDto[] = [];
  displayDialog = false;
  isEditMode = false;
  showtimeForm!: FormGroup;
  selectedShowtimeId?: number;

  ngOnInit() {
    this.initForm();
    this.loadShowtimes();
    this.loadMovies();
    this.loadTheaters();
  }

  initForm() {
    this.showtimeForm = this.fb.group({
      movieId: [null, Validators.required],
      theaterId: [null, Validators.required],
      screenId: [null, Validators.required],
      startTime: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
    });

    // Listen to theater changes to load screens
    this.showtimeForm.get('theaterId')?.valueChanges.subscribe((theaterId) => {
      if (theaterId) {
        this.loadScreensForTheater(theaterId);
        this.showtimeForm.patchValue({ screenId: null });
      } else {
        this.screens = [];
      }
    });
  }

  loadShowtimes() {
    this.showtimeService.getAllShowtimes().subscribe({
      next: (showtimes) => {
        this.showtimes = showtimes;
      },
      error: (err) => {
        // Don't show error toast for empty data - handled in template
      },
    });
  }

  loadMovies() {
    this.movieService.getAllMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
      },
      error: (err) => {
        // Failed to load movies - handled silently
      },
    });
  }

  loadTheaters() {
    this.theaterService.getAllTheaters().subscribe({
      next: (theaters) => {
        this.theaters = theaters;
      },
      error: (err) => {
        // Failed to load theaters - handled silently
      },
    });
  }

  loadScreensForTheater(theaterId: number) {
    this.theaterService.getScreensForTheater(theaterId).subscribe({
      next: (screens) => {
        this.screens = screens;
      },
      error: (err) => {
        // Failed to load screens - handled silently
      },
    });
  }

  openCreateDialog() {
    this.isEditMode = false;
    this.selectedShowtimeId = undefined;
    this.showtimeForm.reset();
    this.screens = [];
    this.displayDialog = true;
  }

  openEditDialog(showtime: ShowtimeDto) {
    this.isEditMode = true;
    this.selectedShowtimeId = showtime.id;

    // Load screens for the theater first
    this.loadScreensForTheater(showtime.theaterId);

    this.showtimeForm.patchValue({
      movieId: showtime.movieId,
      theaterId: showtime.theaterId,
      screenId: showtime.screenId,
      startTime: new Date(showtime.startTime),
      price: showtime.price,
    });
    this.displayDialog = true;
  }
  saveShowtime() {
    if (this.showtimeForm.invalid) {
      this.showtimeForm.markAllAsTouched();
      return;
    }

    const formValue = this.showtimeForm.value;
    const showtimeData: ShowtimeRequest = {
      movieId: formValue.movieId,
      screenId: formValue.screenId,
      startTime:
        formValue.startTime instanceof Date
          ? formValue.startTime.toISOString()
          : formValue.startTime,
      price: formValue.price,
    };

    const operation = this.isEditMode
      ? this.showtimeService.updateShowtime(this.selectedShowtimeId!, showtimeData)
      : this.showtimeService.createShowtime(showtimeData);

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Showtime ${this.isEditMode ? 'updated' : 'created'} successfully`,
        });
        this.displayDialog = false;
        this.loadShowtimes();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${this.isEditMode ? 'update' : 'create'} showtime`,
        });
      },
    });
  }

  deleteShowtime(showtime: ShowtimeDto) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this showtime for "${showtime.movieTitle}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.showtimeService.deleteShowtime(showtime.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Showtime deleted successfully',
            });
            this.loadShowtimes();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete showtime',
            });
          },
        });
      },
    });
  }
}
