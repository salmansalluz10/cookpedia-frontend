import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { apiError } from '../../services/notice.service';
import * as Highcharts from 'highcharts';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  selected = new Date();
  userCount = 0;
  recipeCount = 0;
  downloadCount = 0;
  requestCount = 0;
  loading = true;
  error = '';
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.load();
  }
  load() {
    this.loading = true;
    this.error = '';
    forkJoin({
      users: this.api.getAllUserApi(),
      recipes: this.api.getAllRecipeApi(),
      downloads: this.api.getAllDownloadApi(),
      feedback: this.api.getAllFeedbackApi(),
    }).subscribe({
      next: ({ users, recipes, downloads, feedback }: any) => {
        this.userCount = users.length;
        this.recipeCount = recipes.length;
        this.downloadCount = downloads.reduce(
          (sum: number, item: any) => sum + item.count,
          0,
        );
        this.requestCount = feedback.filter(
          (item: any) => item.status === 'Pending',
        ).length;
        const totals: Record<string, number> = {};
        downloads.forEach(
          (item: any) =>
            (totals[item.recipeCuisine] =
              (totals[item.recipeCuisine] || 0) + item.count),
        );
        this.chartOptions = {
          chart: {
            type: 'bar',
            backgroundColor: 'transparent',
            style: { fontFamily: 'Segoe UI, sans-serif' },
          },
          title: { text: undefined },
          xAxis: { type: 'category' },
          yAxis: { title: { text: 'Downloads' }, allowDecimals: false },
          legend: { enabled: false },
          credits: { enabled: false },
          colors: ['#3d6247', '#94a87c', '#c2bc87'],
          series: [
            {
              type: 'bar',
              name: 'Downloads',
              colorByPoint: true,
              data: Object.entries(totals).map(([name, y]) => ({ name, y })),
            },
          ],
        };
        this.loading = false;
      },
      error: (error) => {
        this.error = apiError(error);
        this.loading = false;
      },
    });
  }
}
