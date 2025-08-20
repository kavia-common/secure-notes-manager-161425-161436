import { Component, effect, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../services/notes.service';
import { Note } from '../../models/note.model';
import { SearchComponent } from '../../components/search/search.component';
import { NoteListComponent } from '../../components/note-list/note-list.component';
import { NoteEditorComponent } from '../../components/note-editor/note-editor.component';

@Component({
  selector: 'app-notes-page',
  standalone: true,
  imports: [CommonModule, SearchComponent, NoteListComponent, NoteEditorComponent],
  template: `
    <div class="page">
      <div class="left">
        <app-search [query]="query()" (queryChange)="onQuery($event)"></app-search>
        <app-note-list
          [notes]="notes()"
          [selectedId]="selected()?.id"
          (select)="onSelect($event)"
          (delete)="onDelete($event)"
        ></app-note-list>
      </div>
      <div class="right" *ngIf="editorOpen()">
        <app-note-editor
          [note]="selected()"
          (save)="onSave($event)"
          (cancel)="closeEditor()"
        ></app-note-editor>
      </div>
      <div class="right placeholder" *ngIf="!editorOpen()">
        <div class="hint">Select a note to edit, or create a new one.</div>
      </div>
    </div>
  `,
  styleUrls: ['./notes.page.css']
})
export class NotesPage implements OnDestroy {
  private readonly api = inject(NotesService);

  query = signal<string>('');
  notes = signal<Note[]>([]);
  total = signal<number>(0);
  selected = signal<Note | null>(null);
  editorOpen = signal<boolean>(false);

  private onCreateListener = (_e?: Event) => {
    this.selected.set({ title: '', content: '' });
    this.editorOpen.set(true);
  };

  constructor() {
    effect(() => {
      // Refetch when query changes
      void this.fetch();
    });
    if (typeof window !== 'undefined') {
      window.addEventListener('create-new-note', this.onCreateListener as unknown as (evt: unknown) => void);
    }
  }

  async fetch(): Promise<void> {
    this.api.list(this.query(), 1, 200).subscribe({
      next: (res: { items: Note[]; total: number }) => {
        this.notes.set(res.items);
        this.total.set(res.total);
      },
      error: () => {
        this.notes.set([]);
        this.total.set(0);
      }
    });
  }

  onQuery(q: string): void {
    this.query.set(q);
  }

  onSelect(n: Note): void {
    this.selected.set(n);
    this.editorOpen.set(true);
  }

  closeEditor(): void {
    this.editorOpen.set(false);
  }

  onSave(payload: Partial<Note>): void {
    const id = payload.id;
    if (id) {
      this.api.update(id, payload).subscribe({
        next: (updated: Note) => {
          this.notes.update((list: Note[]) => list.map((n: Note) => n.id === updated.id ? updated : n));
          this.selected.set(updated);
        }
      });
    } else {
      this.api.create(payload).subscribe({
        next: (created: Note) => {
          this.notes.update((list: Note[]) => [created, ...list]);
          this.selected.set(created);
          this.editorOpen.set(true);
        }
      });
    }
  }

  onDelete(n: Note): void {
    if (!n.id) return;
    this.api.remove(n.id).subscribe({
      next: () => {
        this.notes.update((list: Note[]) => list.filter((x: Note) => x.id !== n.id));
        if (this.selected()?.id === n.id) {
          this.selected.set(null);
          this.editorOpen.set(false);
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('create-new-note', this.onCreateListener as unknown as (evt: unknown) => void);
    }
  }
}
