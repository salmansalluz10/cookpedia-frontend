import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { NoticeService, apiError } from '../services/notice.service';
import { RecipeCardComponent } from '../shared/recipe-card.component';
import { IconComponent } from '../shared/icon.component';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-profile',
  imports: [
    HeaderComponent,
    FooterComponent,
    RecipeCardComponent,
    IconComponent,
    RouterLink,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  auth = inject(AuthService);
  profileImg = this.auth.user()?.profilePic || '';
  userDownloads: any[] = [];
  loading = true;
  saving = false;
  error = '';
  constructor(
    private api: ApiService,
    private notice: NoticeService,
  ) {}
  ngOnInit() {
    this.getUserDownloads();
  }
  getUserDownloads() {
    this.loading = true;
    this.error = '';
    this.api.getUserDownloadRecipeApi().subscribe({
      next: (res: any) => {
        this.userDownloads = res;
        this.loading = false;
      },
      error: (error) => {
        this.error = apiError(error);
        this.loading = false;
      },
    });
  }
  getFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (
      !['image/png', 'image/jpeg', 'image/webp'].includes(file.type) ||
      file.size > 3 * 1024 * 1024
    ) {
      this.notice.show(
        'Choose a PNG, JPEG, or WebP image under 3 MB.',
        'error',
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => (this.profileImg = String(reader.result));
    reader.onerror = () =>
      this.notice.show('This image could not be opened.', 'error');
    reader.readAsDataURL(file);
  }
  updateProfile() {
    if (this.saving) return;
    this.saving = true;
    this.api.editUserApi({ profilePic: this.profileImg }).subscribe({
      next: (res: any) => {
        this.auth.updateUser(res);
        this.saving = false;
        this.notice.show('Your profile picture has been updated.');
      },
      error: () => (this.saving = false),
    });
  }
}
