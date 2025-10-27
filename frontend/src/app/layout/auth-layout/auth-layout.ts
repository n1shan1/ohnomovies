import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Logo } from '../../shared/components/logo/logo';

@Component({
  selector: 'auth-layout',
  imports: [RouterOutlet, ToastModule, Logo],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {}
