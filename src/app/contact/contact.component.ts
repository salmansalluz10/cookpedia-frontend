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
import { apiError } from '../services/notice.service';
@Component({
  selector: 'app-contact',
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  testimonyForm: FormGroup;
  loading = false;
  error = '';
  success = '';
  constructor(
    fb: FormBuilder,
    private api: ApiService,
  ) {
    this.testimonyForm = fb.group({
      name: ['', [Validators.required, Validators.maxLength(80)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.maxLength(3000)]],
    });
  }
  addTestimony() {
    if (this.loading) return;
    if (this.testimonyForm.invalid) {
      this.testimonyForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    this.success = '';
    this.api.addTestimonyApi(this.testimonyForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.success =
          'Thank you for sharing. Your feedback has been submitted for review.';
        this.testimonyForm.reset();
      },
      error: (error) => {
        this.loading = false;
        this.error = apiError(error);
      },
    });
  }
}
