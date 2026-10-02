import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute } from '@angular/router';
import { RecipeCardComponent } from '../shared/recipe-card.component';
import { IconComponent } from '../shared/icon.component';
import { apiError } from '../services/notice.service';
@Component({
  selector: 'app-recipes',
  imports: [
    HeaderComponent,
    FooterComponent,
    FormsModule,
    NgxPaginationModule,
    RecipeCardComponent,
    IconComponent,
  ],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
})
export class RecipesComponent {
  p = 1;
  searchKey = '';
  cuisine = '';
  meal = '';
  sort = 'original';
  allRecipes: any[] = [];
  cusineArray: string[] = [];
  mealTypeArray: string[] = [];
  loading = true;
  error = '';
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchKey = params['q'] || '';
      this.cuisine = params['cuisine'] || '';
      this.p = 1;
    });
    this.getRecipes();
  }
  getRecipes() {
    this.loading = true;
    this.error = '';
    this.api.getAllRecipeApi().subscribe({
      next: (res: any) => {
        this.allRecipes = res;
        this.cusineArray = [...new Set<string>(res.map((r: any) => r.cuisine))];
        this.mealTypeArray = [
          ...new Set<string>(res.flatMap((r: any) => r.mealType)),
        ];
        this.loading = false;
      },
      error: (error) => {
        this.error = apiError(error);
        this.loading = false;
      },
    });
  }
  get filteredRecipes() {
    const term = this.searchKey.trim().toLowerCase();
    const result = this.allRecipes.filter(
      (r) =>
        (!term ||
          [r.name, ...(r.ingredients || [])].some((v) =>
            String(v).toLowerCase().includes(term),
          )) &&
        (!this.cuisine || r.cuisine === this.cuisine) &&
        (!this.meal || r.mealType.includes(this.meal)),
    );
    if (this.sort === 'time')
      result.sort(
        (a, b) =>
          a.prepTimeMinutes +
          a.cookTimeMinutes -
          (b.prepTimeMinutes + b.cookTimeMinutes),
      );
    if (this.sort === 'name')
      result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }
  clear() {
    this.searchKey = '';
    this.cuisine = '';
    this.meal = '';
    this.p = 1;
  }
}
