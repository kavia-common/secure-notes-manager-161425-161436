import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form class="editor" #f="ngForm" (ngSubmit)="submit(f)">
      <input name="title" [(ngModel)]="model.title" placeholder="Title" required />
      <textarea name="content" [(ngModel)]="model.content" placeholder="Write your note..." rows="12"></textarea>
      <div class="actions">
        <button type="submit" class="primary">{{ model.id ? 'Update' : 'Create' }}</button>
        <button type="button" class="secondary" (click)="cancel.emit()">Cancel</button>
      </div>
    </form>
  `,
  styleUrls: ['./note-editor.component.css']
})
export class NoteEditorComponent implements OnChanges {
  @Input() note?: Note | null;
  @Output() save = new EventEmitter<Partial<Note>>();
  @Output() cancel = new EventEmitter<void>();

  model: Partial<Note> = { title: '', content: '' };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['note']) {
      const n = this.note;
      this.model = { id: n?.id, title: n?.title || '', content: n?.content || '' };
    }
  }

  submit(form: NgForm) {
    if (form.valid) {
      this.save.emit({ id: this.model.id, title: this.model.title?.trim() || 'Untitled', content: this.model.content || '' });
    }
  }
}
