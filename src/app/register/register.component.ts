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
  selector: 'app-register',
  imports: [
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    RouterLink,
    IconComponent,
    AuthArtComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';
  showPassword = false;
  constructor(
    fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private notice: NoticeService,
  ) {
    this.registerForm = fb.group({
      username: ['', [Validators.required, Validators.maxLength(80)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(72),
        ],
      ],
    });
  }
  register() {
    if (this.loading) return;
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    this.api.registerApi(this.registerForm.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.notice.show(
          'Your account is ready. Sign in to start your collection.',
        );
        void this.router.navigate(['/login'], {
          queryParams: {
            returnUrl: this.route.snapshot.queryParamMap.get('returnUrl'),
          },
        });
      },
      error: (error) => {
        this.error = apiError(error);
        this.loading = false;
      },
    });
  }
}
