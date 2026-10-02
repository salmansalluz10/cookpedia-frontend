import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ApiService } from '../services/api.service';
import { apiError } from '../services/notice.service';
import { RecipeCardComponent } from '../shared/recipe-card.component';
import { IconComponent } from '../shared/icon.component';
@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterLink,
    RecipeCardComponent,
    IconComponent,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  searchQuery = '';
  topRated: any[] = [];
  allRecipes: any[] = [];
  allFeedback: any[] = [];
  categories: { name: string; image: string; count: number }[] = [];
  loading = true;
  error = '';
  feedbackError = '';
  total = 0;
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.getRecipes();
    this.getFeedback();
  }
  getRecipes() {
    this.loading = true;
    this.error = '';
    this.api.getAllRecipeApi().subscribe({
      next: (res: any) => {
        this.total = res.length;
        this.topRated = res
          .filter((recipe: any) => typeof recipe.rating === 'number')
          .sort((a: any, b: any) => b.rating - a.rating)
          .slice(0, 3);
        this.allRecipes = res.slice(0, 6);
        const cuisines = [...new Set<string>(res.map((r: any) => r.cuisine))];
        this.categories = cuisines
          .slice(0, 6)
          .map((name) => ({
            name,
            image: res.find((r: any) => r.cuisine === name).image,
            count: res.filter((r: any) => r.cuisine === name).length,
          }));
        this.loading = false;
      },
      error: (error) => {
        this.error = apiError(error);
        this.loading = false;
      },
    });
  }
  getFeedback() {
    this.api
      .getApprovedFeedbackApi()
      .subscribe({
        next: (res: any) => (this.allFeedback = res),
        error: (error) => (this.feedbackError = apiError(error)),
      });
  }
  imageError(event: Event) {
    (event.target as HTMLImageElement).src = '/image-unavailable.svg';
  }
}
