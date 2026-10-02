import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';
import { ApiService } from '../services/api.service';

describe('Homepage discovery', () => {
  it('updates the search destination as the user types', async () => {
    await TestBed.configureTestingModule({imports:[HomeComponent],providers:[provideRouter([]),{provide:ApiService,useValue:{getAllRecipeApi:()=>of([]),getApprovedFeedbackApi:()=>of([])}}]}).compileComponents();
    const fixture=TestBed.createComponent(HomeComponent);
    fixture.detectChanges(); await fixture.whenStable();
    const input:HTMLInputElement=fixture.nativeElement.querySelector('input[aria-label="Search recipes"]');
    input.value='basil';input.dispatchEvent(new Event('input'));
    fixture.detectChanges();await fixture.whenStable();fixture.detectChanges();
    const link:HTMLAnchorElement=fixture.nativeElement.querySelector('.discovery-bar a');
    expect(link.getAttribute('href')).toBe('/recipes?q=basil');
  });
});
