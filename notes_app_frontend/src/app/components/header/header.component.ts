import { Component, EventEmitter, Output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header">
      <button class="menu-btn" (click)="toggleSidebar.emit()">
        ☰
      </button>
      <div class="brand">
        <span class="dot"></span>
        Secure Notes
      </div>
      <div class="spacer"></div>
      <div class="auth" *ngIf="user() as u; else loginBlock">
        <span class="user-email">{{ u.email }}</span>
        <button class="btn" (click)="logout()">Logout</button>
      </div>
      <ng-template #loginBlock>
        <button class="btn" (click)="login()">Login</button>
      </ng-template>
    </header>
  `,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  private auth = inject(AuthService);
  user = computed(() => this.auth.user());

  login() {
    this.auth.login('demo@example.com');
  }

  logout() {
    this.auth.logout();
  }
}
