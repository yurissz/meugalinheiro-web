export interface PaginaResposta<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
