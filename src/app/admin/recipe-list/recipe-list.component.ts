import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NoticeService, apiError } from '../../services/notice.service';
@Component({
  selector: 'app-recipe-list',
  standalone: false,
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
})
export class RecipeListComponent {
  allRecipes: any[] = [];
  loading = true;
  error = '';
  busy = '';
  searchKey = '';
  constructor(
    private api: ApiService,
    private notice: NoticeService,
  ) {}
  ngOnInit() {
    this.getAllRecipes();
  }
  getAllRecipes() {
    this.loading = true;
    this.error = '';
    this.api.getAllRecipeApi().subscribe({
      next: (res: any) => {
        this.allRecipes = res;
        this.loading = false;
      },
      error: (error) => {
        this.error = apiError(error);
        this.loading = false;
      },
    });
  }

  pendingDelete = '';
  removeRecipe(id: string) {
    this.pendingDelete = id;
  }
  cancelDelete() {
    this.pendingDelete = '';
  }
  confirmDelete() {
    const id = this.pendingDelete;
    this.busy = id;
    this.api.deleteRecipeApi(id).subscribe({
      next: () => {
        this.busy = '';
        this.pendingDelete = '';
        this.notice.show('Recipe deleted.');
        this.getAllRecipes();
      },
      error: () => (this.busy = ''),
    });
  }
}
