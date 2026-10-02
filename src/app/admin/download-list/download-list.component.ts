import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NoticeService, apiError } from '../../services/notice.service';
@Component({
  selector: 'app-download-list',
  standalone: false,
  templateUrl: './download-list.component.html',
  styleUrl: './download-list.component.css',
})
export class DownloadListComponent {
  allDownload: any[] = [];
  loading = true;
  error = '';
  busy = '';
  searchKey = '';
  constructor(
    private api: ApiService,
    private notice: NoticeService,
  ) {}
  ngOnInit() {
    this.getAllDownload();
  }
  getAllDownload() {
    this.loading = true;
    this.error = '';
    this.api.getAllDownloadApi().subscribe({
      next: (res: any) => {
        this.allDownload = res;
        this.loading = false;
      },
      error: (error) => {
        this.error = apiError(error);
        this.loading = false;
      },
    });
  }
}
