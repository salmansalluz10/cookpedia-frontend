import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NoticeService, apiError } from '../../services/notice.service';
@Component({
  selector: 'app-users-list',
  standalone: false,
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
})
export class UsersListComponent {
  allUsers: any[] = [];
  loading = true;
  error = '';
  busy = '';
  searchKey = '';
  constructor(
    private api: ApiService,
    private notice: NoticeService,
  ) {}
  ngOnInit() {
    this.getAllUsers();
  }
  getAllUsers() {
    this.loading = true;
    this.error = '';
    this.api.getAllUserApi().subscribe({
      next: (res: any) => {
        this.allUsers = res;
        this.loading = false;
      },
      error: (error) => {
        this.error = apiError(error);
        this.loading = false;
      },
    });
  }
}
