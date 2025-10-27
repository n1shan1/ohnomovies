import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast'; // Global Toast for errors
import { NavbarComponent } from '../components/navbar/navbar';

@Component({
  standalone: true,
  selector: 'main-layout',
  imports: [CommonModule, RouterModule, NavbarComponent, ToastModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
