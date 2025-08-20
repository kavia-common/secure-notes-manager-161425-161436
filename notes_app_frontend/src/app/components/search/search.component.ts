import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search">
      <input [(ngModel)]="query" (input)="onChange()" placeholder="Search notes..." aria-label="Search notes" />
    </div>
  `,
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Input() query = '';
  @Output() queryChange = new EventEmitter<string>();
  onChange() {
    this.queryChange.emit(this.query);
  }
}
