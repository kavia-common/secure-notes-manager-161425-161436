export interface Note {
  id?: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}
