import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdminTheaterService } from '../../services/admin-theater.service';
import { ScreenDto, ScreenRequest, TheaterDto } from '../../../../core/models/backend-dtos';

@Component({
  selector: 'app-screen-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './screen-management.html',
  styleUrl: './screen-management.css',
})
export class ScreenManagementComponent implements OnInit {
  private theaterService = inject(AdminTheaterService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  theaterId!: number;
  theater?: TheaterDto;
  screens: ScreenDto[] = [];
  displayDialog = false;
  isEditMode = false;
  screenForm!: FormGroup;
  selectedScreenId?: number;

  ngOnInit() {
    this.theaterId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.loadTheater();
    this.loadScreens();
  }

  initForm() {
    this.screenForm = this.fb.group({
      screenName: ['', [Validators.required, Validators.maxLength(100)]],
      totalRows: [null, [Validators.required, Validators.min(1), Validators.max(50)]],
      totalColumns: [null, [Validators.required, Validators.min(1), Validators.max(50)]],
    });
  }

  loadTheater() {
    this.theaterService.getTheaterById(this.theaterId).subscribe({
      next: (theater) => {
        this.theater = theater;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load theater details',
        });
      },
    });
  }

  loadScreens() {
    this.theaterService.getScreensForTheater(this.theaterId).subscribe({
      next: (screens) => {
        this.screens = screens;
      },
      error: (err) => {
        // Don't show error toast for empty data - handled in template
      },
    });
  }

  openCreateDialog() {
    this.isEditMode = false;
    this.selectedScreenId = undefined;
    this.screenForm.reset();
    this.screenForm.enable();
    this.displayDialog = true;
  }

  openEditDialog(screen: ScreenDto) {
    this.isEditMode = true;
    this.selectedScreenId = screen.id;
    this.screenForm.patchValue({
      screenName: screen.screenName,
      totalRows: screen.totalRows,
      totalColumns: screen.totalColumns,
    });
    // Disable rows and columns in edit mode (cannot be changed after creation)
    this.screenForm.get('totalRows')?.disable();
    this.screenForm.get('totalColumns')?.disable();
    this.displayDialog = true;
  }

  saveScreen() {
    if (this.screenForm.invalid) {
      this.screenForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      // Update all fields (backend allows updating all fields)
      const updateData: ScreenRequest = {
        screenName: this.screenForm.get('screenName')?.value,
        totalRows: this.screenForm.get('totalRows')?.value,
        totalColumns: this.screenForm.get('totalColumns')?.value,
      };
      this.theaterService.updateScreen(this.selectedScreenId!, updateData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Screen updated successfully',
          });
          this.displayDialog = false;
          this.loadScreens();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update screen',
          });
        },
      });
    } else {
      const screenData: ScreenRequest = this.screenForm.value;
      this.theaterService.createScreen(this.theaterId, screenData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Screen created successfully',
          });
          this.displayDialog = false;
          this.loadScreens();
          this.loadTheater(); // Refresh theater to update screen count
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create screen',
          });
        },
      });
    }
  }

  deleteScreen(screen: ScreenDto) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete screen "${screen.screenName}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.theaterService.deleteScreen(screen.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Screen deleted successfully',
            });
            this.loadScreens();
            this.loadTheater(); // Refresh theater to update screen count
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete screen',
            });
          },
        });
      },
    });
  }

  goBack() {
    this.router.navigate(['/admin/theaters']);
  }
}
