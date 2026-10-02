import { Component, Input } from '@angular/core';
@Component({
  selector: 'cp-icon',
  template:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path [attr.d]="paths[name]"/></svg>',
  styles: [
    ':host{display:inline-flex;width:1.25em;height:1.25em;flex-shrink:0;vertical-align:middle}svg{width:100%;height:100%}',
  ],
})
export class IconComponent {
  @Input() name = 'arrow';
  paths: Record<string, string> = {
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    search: 'm21 21-5-5M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15',
    clock: 'M12 8v4l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18',
    bookmark: 'M6 3h12v18l-6-4-6 4V3',
    leaf: 'M20 3C8 2 2 8 5 15c4 7 15 3 15-12ZM5 21 16 8',
    chef: 'M7 14a5 5 0 0 1-3-9 5 5 0 0 1 8-2 5 5 0 0 1 8 2 5 5 0 0 1-3 9v7H7v-7Zm0 3h10',
    heart: 'M20 4c-3-2-6 0-8 2-2-2-5-4-8-2-6 5 2 12 8 16 6-4 14-11 8-16',
    menu: 'M4 6h16M4 12h16M4 18h16',
    close: 'm6 6 12 12M6 18 18 6',
    check: 'm5 12 4 4L19 6',
    download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
    user: 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M4 21v-2a8 8 0 0 1 16 0v2',
    filter: 'M4 7h16M4 17h16M8 4v6m8 4v6',
    spark: 'm12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7',
    trash: 'M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7',
    eye: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  };
}
