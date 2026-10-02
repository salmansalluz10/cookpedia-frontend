import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { IconComponent } from './icon.component';

@Component({
  selector: 'cp-auth-art',
  imports: [IconComponent],
  template: `<div class="auth-illustration">
    @if (image) {
      <img [src]="image" [alt]="name" (error)="image = ''" />
    } @else {
      <cp-icon name="chef" />
    }
    <span>Good things<br />are cooking.</span><cp-icon name="leaf" />
  </div>`,
})
export class AuthArtComponent {
  image = '';
  name = '';
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.getAllRecipeApi().subscribe({
      next: (recipes: any) => {
        if (recipes.length) {
          this.image = recipes[0].image;
          this.name = recipes[0].name;
        }
      },
      error: () => {}, // The shared interceptor reports the service failure; the illustration remains usable.
    });
  }
}
