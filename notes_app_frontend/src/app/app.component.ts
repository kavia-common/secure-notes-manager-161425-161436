import { Component, OnDestroy, inject } from '@angular/core';
import { ShellComponent } from './layout/shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShellComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  // Use a generic function type to avoid relying on DOM's EventListener global
  private sub: ((evt?: unknown) => void) | null = null;

  constructor() {
    // Listen for "create new note" marker; guard for SSR.
    if (typeof window !== 'undefined') {
      this.sub = () => {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('create-note-request', '1');
        }
      };
      window.addEventListener('create-new-note', this.sub as unknown as (evt: unknown) => void);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined' && this.sub) {
      window.removeEventListener('create-new-note', this.sub as unknown as (evt: unknown) => void);
    }
  }
}
