import { Component, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { RecipeModel } from '../model/recipeModel';
import { NoticeService, apiError } from '../../services/notice.service';
@Component({
  selector: 'app-manage-recipe',
  standalone: false,
  templateUrl: './manage-recipe.component.html',
  styleUrl: './manage-recipe.component.css',
})
export class ManageRecipeComponent {
  @Input() id!: string;
  cusineArray: string[] = [];
  mealTypeArray: string[] = [];
  recipeDetails: RecipeModel = {};
  ingredients: string[] = [];
  instructions: string[] = [];
  mealArray: string[] = [];
  loading = true;
  saving = false;
  error = '';
  formError = '';
  constructor(
    private api: ApiService,
    private router: Router,
    private notice: NoticeService,
  ) {}
  ngOnInit() {
    this.getRecipes();
  }
  getRecipes() {
    this.loading = true;
    this.error = '';
    this.api.getAllRecipeApi().subscribe({
      next: (res: any) => {
        this.cusineArray = [...new Set<string>(res.map((r: any) => r.cuisine))];
        this.mealTypeArray = [
          ...new Set<string>(res.flatMap((r: any) => r.mealType)),
        ];
        if (this.id) {
          const recipe = res.find((r: any) => r._id === this.id);
          if (!recipe) {
            this.error = 'This recipe no longer exists.';
          } else {
            this.recipeDetails = { ...recipe };
            this.ingredients = [...recipe.ingredients];
            this.instructions = [...recipe.instructions];
            this.mealArray = [...recipe.mealType];
          }
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.error = apiError(error);
      },
    });
  }
  addIngredients(input: HTMLTextAreaElement) {
    if (input.value.trim()) {
      this.ingredients.push(input.value.trim());
      input.value = '';
    }
  }
  addInstructions(input: HTMLTextAreaElement) {
    if (input.value.trim()) {
      this.instructions.push(input.value.trim());
      input.value = '';
    }
  }
  removeIngredient(index: number) {
    this.ingredients.splice(index, 1);
  }
  removeInstructions(index: number) {
    this.instructions.splice(index, 1);
  }
  toggleMeal(meal: string) {
    this.mealArray = this.mealArray.includes(meal)
      ? this.mealArray.filter((value) => value !== meal)
      : [...this.mealArray, meal];
  }
  addMeal(input: HTMLInputElement) {
    const meal = input.value.trim();
    if (meal && !this.mealTypeArray.includes(meal))
      this.mealTypeArray.push(meal);
    if (meal && !this.mealArray.includes(meal)) this.mealArray.push(meal);
    input.value = '';
  }
  saveRecipe() {
    if (this.saving) return;
    this.recipeDetails.ingredients = this.ingredients;
    this.recipeDetails.instructions = this.instructions;
    this.recipeDetails.mealType = this.mealArray;
    const r = this.recipeDetails;
    const valid =
      [r.name, r.image, r.cuisine, r.difficulty].every(
        (value) => typeof value === 'string' && value.trim(),
      ) &&
      [this.ingredients, this.instructions, this.mealArray].every(
        (values) => values.length > 0 && values.every((value) => value.trim()),
      ) &&
      [r.prepTimeMinutes, r.cookTimeMinutes, r.caloriesPerServing].every(
        (value) => value != null && Number(value) >= 0,
      ) &&
      r.servings != null &&
      Number(r.servings) >= 1;
    if (!valid) {
      this.formError =
        'Complete every field, including at least one ingredient, instruction, and meal type. Times can be zero; servings must be at least one.';
      return;
    }
    this.formError = '';
    this.saving = true;
    const request = this.id
      ? this.api.updateRecipeApi(this.id, r)
      : this.api.addRecipeApi(r);
    request.subscribe({
      next: () => {
        this.saving = false;
        this.notice.show(
          this.id ? 'Recipe updated.' : 'A new recipe is on the menu.',
        );
        void this.router.navigateByUrl('/admin/recipe-list');
      },
      error: (error) => {
        this.saving = false;
        this.formError = apiError(error);
      },
    });
  }
}
