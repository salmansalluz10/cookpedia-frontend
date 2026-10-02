import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NoticeService, apiError } from '../../services/notice.service';
@Component({
  selector: 'app-request-list',
  standalone: false,
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.css',
})
export class RequestListComponent {
  allFeedback: any[] = [];
  loading = true;
  error = '';
  busy = '';
  searchKey = '';
  constructor(
    private api: ApiService,
    private notice: NoticeService,
  ) {}
  ngOnInit() {
    this.getAllFeedback();
  }
  getAllFeedback() {
    this.loading = true;
    this.error = '';
    this.api.getAllFeedbackApi().subscribe({
      next: (res: any) => {
        this.allFeedback = res;
        this.loading = false;
      },
      error: (error) => {
        this.error = apiError(error);
        this.loading = false;
      },
    });
  }
  updateFeedbakcStatus(id: string, status: string) {
    this.busy = id;
    this.api.updateFeedbackStatusApi(id, status).subscribe({
      next: () => {
        this.busy = '';
        this.notice.show('Feedback ' + status.toLowerCase() + '.');
        this.getAllFeedback();
      },
      error: () => (this.busy = ''),
    });
  }
}
