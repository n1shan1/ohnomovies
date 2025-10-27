import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdminTheaterService } from '../../services/admin-theater.service';
import { TheaterDto, TheaterRequest } from '../../../../core/models/backend-dtos';

@Component({
  selector: 'app-theater-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './theater-management.html',
  styleUrl: './theater-management.css',
})
export class TheaterManagementComponent implements OnInit {
  private theaterService = inject(AdminTheaterService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);

  theaters: TheaterDto[] = [];
  displayDialog = false;
  isEditMode = false;
  theaterForm!: FormGroup;
  selectedTheaterId?: number;

  ngOnInit() {
    this.initForm();
    this.loadTheaters();
  }

  initForm() {
    this.theaterForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      location: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  loadTheaters() {
    this.theaterService.getAllTheaters().subscribe({
      next: (theaters) => {
        this.theaters = theaters;
      },
      error: (err) => {
        console.error('Error loading theaters:', err);
        // Don't show error toast for empty data - handled in template
      },
    });
  }

  openCreateDialog() {
    this.isEditMode = false;
    this.selectedTheaterId = undefined;
    this.theaterForm.reset();
    this.displayDialog = true;
  }

  openEditDialog(theater: TheaterDto) {
    this.isEditMode = true;
    this.selectedTheaterId = theater.id;
    this.theaterForm.patchValue({
      name: theater.name,
      location: theater.location,
    });
    this.displayDialog = true;
  }

  saveTheater() {
    if (this.theaterForm.invalid) {
      this.theaterForm.markAllAsTouched();
      return;
    }

    const theaterData: TheaterRequest = this.theaterForm.value;

    const operation = this.isEditMode
      ? this.theaterService.updateTheater(this.selectedTheaterId!, theaterData)
      : this.theaterService.createTheater(theaterData);

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Theater ${this.isEditMode ? 'updated' : 'created'} successfully`,
        });
        this.displayDialog = false;
        this.loadTheaters();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${this.isEditMode ? 'update' : 'create'} theater`,
        });
      },
    });
  }

  deleteTheater(theater: TheaterDto) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${theater.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.theaterService.deleteTheater(theater.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Theater deleted successfully',
            });
            this.loadTheaters();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete theater',
            });
          },
        });
      },
    });
  }

  manageScreens(theater: TheaterDto) {
    this.router.navigate(['/admin/theaters', theater.id, 'screens']);
  }
}
