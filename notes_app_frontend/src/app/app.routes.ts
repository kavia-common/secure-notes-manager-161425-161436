import { Routes } from '@angular/router';
import { NotesPage } from './pages/notes/notes.page';

export const routes: Routes = [
  { path: '', component: NotesPage },
  { path: '**', redirectTo: '' }
];
