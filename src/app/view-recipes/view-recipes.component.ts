import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RecipeCardComponent } from '../shared/recipe-card.component';
import { IconComponent } from '../shared/icon.component';
import { NoticeService, apiError } from '../services/notice.service';

@Component({
  selector: 'app-view-recipes',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterLink,
    RecipeCardComponent,
    IconComponent,
  ],
  templateUrl: './view-recipes.component.html',
  styleUrl: './view-recipes.component.css',
})
export class ViewRecipesComponent {
  loading = true;
  error = '';
  saved = false;
  saving = false;
  downloading = false;
  relatedError = '';
  recipeId: string = '';
  recipe: any = {};
  allRelatedRecipe: any = [];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private notice: NoticeService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((res: any) => {
      this.recipeId = res.id;
      this.getrecipeDetails(this.recipeId);
    });
  }

  getrecipeDetails(recipeId: string) {
    this.loading = true;
    this.error = '';
    this.saved = false;
    this.allRelatedRecipe = [];
    this.api.viewRecipeApi(recipeId).subscribe({
      next: (res: any) => {
        this.recipe = res;
        this.loading = false;
        this.getAllRelatedRecipes(res.cuisine);
      },
      error: (error) => {
        this.error = apiError(error);
        this.loading = false;
      },
    });
  }
  getAllRelatedRecipes(cuisine: string) {
    this.relatedError = '';
    this.api
      .relatedRecipeApi(cuisine)
      .subscribe({
        next: (res: any) =>
          (this.allRelatedRecipe = res.filter(
            (item: any) => item._id !== this.recipeId,
          )),
        error: (error) => (this.relatedError = apiError(error)),
      });
  }
  downloadRecipe() {
    if (this.downloading) return;
    this.downloading = true;
    this.api.downloadRecipeApi(this.recipeId, this.recipe).subscribe({
      next: async () => {
        try {
          await this.generatePdf();
          this.notice.show('Recipe downloaded. Happy cooking!');
        } catch {
          this.notice.show(
            'The PDF could not be generated. Please try again.',
            'error',
          );
        } finally {
          this.downloading = false;
        }
      },
      error: () => (this.downloading = false),
    });
  }
  //for generating pdf:-
  async generatePdf() {
    const { jsPDF } = await import('jspdf');
    const { autoTable } = await import('jspdf-autotable');
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.setTextColor('red');
    pdf.text(this.recipe.name, 10, 10);
    pdf.setFontSize(12);
    pdf.setTextColor('black');
    pdf.text(`Cuisine:${this.recipe.cuisine}`, 10, 20);
    pdf.text(`Servings:${this.recipe.servings}`, 10, 30);
    pdf.text(`Mode of cooking:${this.recipe.difficulty}`, 10, 40);
    pdf.text(
      `Total preparation time:${this.recipe.prepTimeMinutes} Minutes`,
      10,
      50,
    );
    pdf.text(
      `Total Cooking time:${this.recipe.cookTimeMinutes} Minutes`,
      10,
      60,
    );
    pdf.text(
      `Total calories per servings:${this.recipe.caloriesPerServing}`,
      10,
      65,
    );

    let head = [['Ingredients Needed', 'Cooking Instructions']];
    let body = [];
    body.push([this.recipe.ingredients, this.recipe.instructions]);
    autoTable(pdf, { head, body, startY: 80 });

    pdf.save(`recipe-${this.recipe.name}.pdf`);
  }

  saveRecipe() {
    if (this.saving || this.saved) return;
    this.saving = true;
    this.api.saveRecipeApi(this.recipeId, this.recipe).subscribe({
      next: () => {
        this.saving = false;
        this.saved = true;
        this.notice.show('Saved to your recipe collection.');
      },
      error: (error) => {
        this.saving = false;
        if (error.status === 409) this.saved = true;
      },
    });
  }
}
