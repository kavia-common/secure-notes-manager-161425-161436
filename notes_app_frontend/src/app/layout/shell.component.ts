import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <app-header (toggleSidebar)="toggle()"></app-header>
    <div class="shell">
      <app-sidebar *ngIf="sidebarOpen()" (createNote)="create()"></app-sidebar>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./shell.component.css']
})
export class ShellComponent {
  sidebarOpen = signal(true);

  toggle() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  create() {
    // Emit a global event; guard for SSR.
    if (typeof window !== 'undefined') {
      const ev = new CustomEvent('create-new-note');
      window.dispatchEvent(ev);
    }
  }
}
