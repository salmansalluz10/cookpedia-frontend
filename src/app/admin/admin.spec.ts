import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { AdminModule } from './admin.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageRecipeComponent } from './manage-recipe/manage-recipe.component';
import { ApiService } from '../services/api.service';
import { NoticeService } from '../services/notice.service';

describe('Existing admin functionality', () => {
  it('renders the dashboard and calendar with an empty database without a reduce error', async () => {
    await TestBed.configureTestingModule({
      imports: [AdminModule],
      providers: [provideRouter([]), {provide: ApiService, useValue: {
        getAllUserApi: () => of([]), getAllRecipeApi: () => of([]),
        getAllDownloadApi: () => of([]), getAllFeedbackApi: () => of([]),
      }}],
    }).compileComponents();
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.downloadCount).toBe(0);
    expect(fixture.componentInstance.error).toBe('');
    expect(fixture.nativeElement.querySelector('mat-calendar')).toBeTruthy();
  });
  it('saves an admin recipe with zero preparation time and edited ingredients', () => {
    const api = {addRecipeApi: jasmine.createSpy().and.returnValue(of({}))};
    const router = {navigateByUrl: jasmine.createSpy().and.resolveTo(true)};
    const editor = new ManageRecipeComponent(api as any, router as unknown as Router, new NoticeService());
    editor.recipeDetails = {name:'Test recipe',image:'https://example.test/image.jpg',cuisine:'Test',difficulty:'Easy',prepTimeMinutes:0,cookTimeMinutes:10,servings:2,caloriesPerServing:100};
    editor.ingredients=['An edited ingredient']; editor.instructions=['One step']; editor.mealArray=['Lunch'];
    editor.saveRecipe();
    expect(api.addRecipeApi).toHaveBeenCalledWith(jasmine.objectContaining({prepTimeMinutes:0,ingredients:['An edited ingredient']}));
    expect(router.navigateByUrl).toHaveBeenCalledWith('/admin/recipe-list');
  });
  it('retains form data and refuses an incomplete recipe', () => {
    const api = {addRecipeApi:jasmine.createSpy()};
    const editor = new ManageRecipeComponent(api as any, {} as Router, new NoticeService());
    editor.recipeDetails.name='Unfinished recipe'; editor.saveRecipe();
    expect(api.addRecipeApi).not.toHaveBeenCalled();
    expect(editor.recipeDetails.name).toBe('Unfinished recipe');
    expect(editor.formError).toContain('Complete every field');
  });
});
