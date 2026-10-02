import { A11yModule } from '@angular/cdk/a11y';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DownloadListComponent } from './download-list/download-list.component';
import { UsersListComponent } from './users-list/users-list.component';
import { RequestListComponent } from './request-list/request-list.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { ManageRecipeComponent } from './manage-recipe/manage-recipe.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../pipes/search.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [
    DashboardComponent,
    DownloadListComponent,
    UsersListComponent,
    RequestListComponent,
    RecipeListComponent,
    ManageRecipeComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    A11yModule,
    AdminRoutingModule,
    RouterLink,
    FormsModule,
    SearchPipe,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HighchartsChartModule,
  ],
})
export class AdminModule {}
