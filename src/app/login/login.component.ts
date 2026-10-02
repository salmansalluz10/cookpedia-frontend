import { AuthArtComponent } from '../shared/auth-art.component';
import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { apiError, NoticeService } from '../services/notice.service';
import { IconComponent } from '../shared/icon.component';
@Component({
  selector: 'app-login',
  imports: [
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    RouterLink,
    IconComponent,
    AuthArtComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  showPassword = false;
  get returnUrl() {
    return this.route.snapshot.queryParamMap.get('returnUrl');
  }
  constructor(
    fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private notice: NoticeService,
  ) {
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(72)]],
    });
  }
  login() {
    if (this.loading) return;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    this.api.loginApi(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (!res.token || !res.user) {
          this.error = 'The server returned an incomplete sign-in response.';
          return;
        }
        this.auth.setSession(res.user, res.token);
        const target = this.route.snapshot.queryParamMap.get('returnUrl');
        void this.router.navigateByUrl(
          target &&
            target.startsWith('/') &&
            !target.startsWith('//') &&
            !target.startsWith('/login')
            ? target
            : this.auth.admin
              ? '/admin'
              : '/',
        );
      },
      error: (error) => {
        this.error = apiError(error);
        this.loading = false;
      },
    });
  }
}
