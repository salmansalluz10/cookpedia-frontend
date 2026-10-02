import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { RecipesComponent } from './recipes/recipes.component';
import { SavedRecipesComponent } from './saved-recipes/saved-recipes.component';
import { ViewRecipesComponent } from './view-recipes/view-recipes.component';
import { PnfComponent } from './pnf/pnf.component';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  // lazy load admin module //authorized
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About',
  },
  {
    path: 'contact',
    component: ContactComponent,
    title: 'Contact',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register',
  },
  // profile-authorized
  {
    path: 'profile',
    canActivate: [authGuard],
    component: ProfileComponent,
    title: 'Profile',
  },
  {
    path: 'recipes',
    component: RecipesComponent,
    title: 'Recipes',
  },
  // saved-recipes -authorized
  {
    path: 'saved-recipes',
    canActivate: [authGuard],
    component: SavedRecipesComponent,
    title: 'saved-recipes',
  },
  // authorized
  {
    path: 'recipe/:id/view',
    canActivate: [authGuard],
    component: ViewRecipesComponent,
    title: 'View-recipes',
  },
  {
    path: '**',
    component: PnfComponent,
    title: 'Page Not Found',
  },
];
