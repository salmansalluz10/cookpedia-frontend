import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from './icon.component';
@Component({
  selector: 'cp-recipe-card',
  imports: [RouterLink, IconComponent],
  template: ` <a
    class="recipe-card"
    [routerLink]="['/recipe', recipe._id || recipe.recipeId, 'view']"
  >
    <div class="recipe-image">
      <img
        [src]="recipe.image || recipe.recipeImage"
        [alt]="recipe.name || recipe.recipeName"
        loading="lazy"
        (error)="imageError($event)"
      />
      @if (recipe.difficulty) {
        <span class="image-badge">{{ recipe.difficulty }}</span>
      }
      <span class="card-arrow"><cp-icon name="arrow" /></span>
    </div>
    <div class="recipe-content">
      <p class="eyebrow">
        {{ recipe.cuisine || recipe.recipeCuisine || 'YOUR COLLECTION' }}
      </p>
      <h3>{{ recipe.name || recipe.recipeName }}</h3>
      <div class="recipe-meta">
        @if (recipe.prepTimeMinutes != null) {
          <span
            ><cp-icon name="clock" />
            {{ recipe.prepTimeMinutes + recipe.cookTimeMinutes }} min</span
          >
        }
        @if (recipe.mealType?.length) {
          <span>{{ recipe.mealType[0] }}</span>
        }
        @if (recipe.rating) {
          <span>★ {{ recipe.rating }}</span>
        }
        @if (recipe.servings) {
          <span>{{ recipe.servings }} servings</span>
        }
      </div>
    </div>
  </a>`,
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe: any;
  imageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = '/image-unavailable.svg';
  }
}
