import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NoticeService } from '../services/notice.service';
import { IconComponent } from '../shared/icon.component';
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  auth = inject(AuthService);
  router = inject(Router);
  notice = inject(NoticeService);
  menuOpen = false;
  logout() {
    this.auth.clear();
    this.notice.show('You have signed out. See you in the kitchen.');
    void this.router.navigateByUrl('/');
  }
}
