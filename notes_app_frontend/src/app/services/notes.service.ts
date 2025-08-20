import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Note, PagedResult } from '../models/note.model';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/notes`;

  // PUBLIC_INTERFACE
  /** Fetch a paginated list of notes optionally filtered by a search query. */
  list(query = '', page = 1, pageSize = 50): Observable<PagedResult<Note>> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
    if (query) params = params.set('q', query);
    return this.http.get<PagedResult<Note>>(this.base, { params });
  }

  // PUBLIC_INTERFACE
  /** Get a single note by id. */
  get(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.base}/${encodeURIComponent(id)}`);
  }

  // PUBLIC_INTERFACE
  /** Create a new note. */
  create(payload: Partial<Note>): Observable<Note> {
    return this.http.post<Note>(this.base, payload);
  }

  // PUBLIC_INTERFACE
  /** Update an existing note by id. */
  update(id: string, payload: Partial<Note>): Observable<Note> {
    return this.http.put<Note>(`${this.base}/${encodeURIComponent(id)}`, payload);
  }

  // PUBLIC_INTERFACE
  /** Delete a note by id. Returns true on success. */
  remove(id: string): Observable<boolean> {
    return this.http.delete<void>(`${this.base}/${encodeURIComponent(id)}`).pipe(map(() => true));
  }
}
