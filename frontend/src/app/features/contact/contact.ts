import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputTextModule, Textarea],
  providers: [MessageService],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  name: string = '';
  email: string = '';
  subject: string = '';
  message: string = '';
  isSubmitting: boolean = false;

  constructor(private messageService: MessageService, private router: Router) {}

  onSubmit(): void {
    if (!this.name || !this.email || !this.subject || !this.message) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Incomplete Form',
        detail: 'Please fill in all fields',
      });
      return;
    }

    this.isSubmitting = true;

    // Simulate form submission
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Message Sent',
        detail: 'Thank you for contacting us! We will get back to you soon.',
        life: 5000,
      });

      // Reset form
      this.name = '';
      this.email = '';
      this.subject = '';
      this.message = '';
      this.isSubmitting = false;
    }, 1000);
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
