import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';
import { RecipeCardComponent } from '../shared/recipe-card.component';
import { IconComponent } from '../shared/icon.component';
import { NoticeService, apiError } from '../services/notice.service';
@Component({
  selector: 'app-saved-recipes',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterLink,
    RecipeCardComponent,
    IconComponent,
  ],
  templateUrl: './saved-recipes.component.html',
  styleUrl: './saved-recipes.component.css',
})
export class SavedRecipesComponent {
  allrecipes: any[] = [];
  loading = true;
  error = '';
  removing = '';
  constructor(
    private api: ApiService,
    private notice: NoticeService,
  ) {}
  ngOnInit() {
    this.getAllSavedRecipes();
  }
  getAllSavedRecipes() {
    this.loading = true;
    this.error = '';
    this.api.getUserSavedRecipeApi().subscribe({
      next: (res: any) => {
        this.allrecipes = res;
        this.loading = false;
      },
      error: (error) => {
        this.error = apiError(error);
        this.loading = false;
      },
    });
  }
  removeRecipe(id: string) {
    this.removing = id;
    this.api.deleteUserSavedRecipeApi(id).subscribe({
      next: () => {
        this.allrecipes = this.allrecipes.filter((r) => r._id !== id);
        this.removing = '';
        this.notice.show('Removed from your collection.');
      },
      error: () => (this.removing = ''),
    });
  }
}
