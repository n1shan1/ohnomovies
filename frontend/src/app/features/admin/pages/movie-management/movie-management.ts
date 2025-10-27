import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { Textarea } from 'primeng/textarea';
import { DatePicker } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdminMovieService } from '../../services/admin-movie.service';
import { MovieDto, CreateMovieRequest } from '../../../../core/models/backend-dtos';

@Component({
  selector: 'app-movie-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    Textarea,
    DatePicker,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './movie-management.html',
  styleUrl: './movie-management.css',
})
export class MovieManagementComponent implements OnInit {
  private movieService = inject(AdminMovieService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  movies: MovieDto[] = [];
  displayDialog = false;
  isEditMode = false;
  movieForm!: FormGroup;
  selectedMovieId?: number;

  ngOnInit() {
    this.initForm();
    this.loadMovies();
  }

  initForm() {
    this.movieForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      description: ['', Validators.required],
      posterUrl: ['', Validators.required],
      releaseDate: ['', Validators.required],
      durationInMinutes: [null, [Validators.required, Validators.min(1)]],
      language: ['', Validators.required],
    });
  }

  loadMovies() {
    this.movieService.getAllMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
      },
      error: (err) => {
        console.error('Error loading movies:', err);
        // Don't show error toast for empty data - handled in template
      },
    });
  }

  openCreateDialog() {
    this.isEditMode = false;
    this.selectedMovieId = undefined;
    this.movieForm.reset();
    this.displayDialog = true;
  }

  openEditDialog(movie: MovieDto) {
    this.isEditMode = true;
    this.selectedMovieId = movie.id;
    this.movieForm.patchValue({
      title: movie.title,
      description: movie.description,
      posterUrl: movie.posterUrl,
      releaseDate: new Date(movie.releaseDate),
      durationInMinutes: movie.durationInMinutes,
      language: movie.language,
    });
    this.displayDialog = true;
  }

  saveMovie() {
    if (this.movieForm.invalid) {
      this.movieForm.markAllAsTouched();
      return;
    }

    const formValue = this.movieForm.value;
    const movieData: CreateMovieRequest = {
      title: formValue.title,
      description: formValue.description,
      posterUrl: formValue.posterUrl,
      releaseDate: this.formatDateToString(formValue.releaseDate),
      durationInMinutes: formValue.durationInMinutes,
      language: formValue.language,
    };

    const operation = this.isEditMode
      ? this.movieService.updateMovie(this.selectedMovieId!, movieData)
      : this.movieService.createMovie(movieData);

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Movie ${this.isEditMode ? 'updated' : 'created'} successfully`,
        });
        this.displayDialog = false;
        this.loadMovies();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${this.isEditMode ? 'update' : 'create'} movie`,
        });
      },
    });
  }

  deleteMovie(movie: MovieDto) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${movie.title}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.movieService.deleteMovie(movie.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Movie deleted successfully',
            });
            this.loadMovies();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete movie',
            });
          },
        });
      },
    });
  }

  private formatDateToString(date: Date | string): string {
    if (typeof date === 'string') return date;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
