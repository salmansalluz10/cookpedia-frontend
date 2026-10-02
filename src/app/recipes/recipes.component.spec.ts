import { of } from 'rxjs';
import { RecipesComponent } from './recipes.component';
describe('Recipe discovery', () => {
  const data = [
    {
      name: 'Pasta',
      cuisine: 'Italian',
      mealType: ['Dinner'],
      ingredients: ['Basil'],
      prepTimeMinutes: 5,
      cookTimeMinutes: 10,
    },
    {
      name: 'Salad',
      cuisine: 'Italian',
      mealType: ['Lunch'],
      ingredients: ['Basil'],
      prepTimeMinutes: 5,
      cookTimeMinutes: 0,
    },
    {
      name: 'Soup',
      cuisine: 'Asian',
      mealType: ['Dinner'],
      ingredients: ['Ginger'],
      prepTimeMinutes: 5,
      cookTimeMinutes: 20,
    },
  ];
  let component: RecipesComponent;
  beforeEach(() => {
    component = new RecipesComponent(
      { getAllRecipeApi: () => of(data) } as any,
      { queryParams: of({}) } as any,
    );
    component.ngOnInit();
  });
  it('combines ingredient search with exact cuisine and meal filters', () => {
    component.searchKey = 'basil';
    component.cuisine = 'Italian';
    component.meal = 'Dinner';
    expect(component.filteredRecipes.map((r) => r.name)).toEqual(['Pasta']);
  });
  it('resets pagination and all filters', () => {
    component.p = 3;
    component.searchKey = 'missing';
    component.cuisine = 'Asian';
    component.meal = 'Lunch';
    component.clear();
    expect(component.filteredRecipes.length).toBe(3);
    expect(component.p).toBe(1);
  });
  it('sorts by actual combined prep and cooking time without mutating the original collection', () => {
    component.sort = 'time';
    expect(component.filteredRecipes[0].name).toBe('Salad');
    expect(component.allRecipes[0].name).toBe('Pasta');
  });
});
