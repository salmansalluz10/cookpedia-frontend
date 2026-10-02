import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  auth = inject(AuthService);
  router = inject(Router);
  logout() {
    this.auth.clear();
    void this.router.navigateByUrl('/');
  }
}
