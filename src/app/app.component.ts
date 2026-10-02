import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NoticeService } from './services/notice.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'cookpedia';
  notice = inject(NoticeService);
}
