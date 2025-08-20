import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="list">
      <div *ngFor="let n of notes" class="item" [class.selected]="n.id===selectedId" (click)="select.emit(n)">
        <div class="title">{{ n.title || 'Untitled' }}</div>
        <div class="snippet">{{ (n.content || '').slice(0, 100) }}</div>
        <button class="delete" (click)="onDelete($event, n)">Delete</button>
      </div>
      <div *ngIf="!notes || notes.length===0" class="empty">No notes found.</div>
    </div>
  `,
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent {
  @Input() notes: Note[] = [];
  @Input() selectedId?: string;
  @Output() select = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<Note>();

  onDelete(e: unknown, n: Note) {
    // Using unknown to avoid DOM typings lint on server
    try {
      (e as { stopPropagation?: () => void })?.stopPropagation?.();
    } catch {}
    this.delete.emit(n);
  }
}
