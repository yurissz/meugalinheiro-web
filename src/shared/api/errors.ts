export interface ApiFieldError {
  campo: string;
  mensagem: string;
}

export interface ApiErrorBody {
  status: number;
  mensagem: string;
  campos?: ApiFieldError[];
}

export class ApiError extends Error {
  status: number;
  campos: ApiFieldError[];

  constructor(body: ApiErrorBody) {
    super(body.mensagem);
    this.status = body.status;
    this.campos = body.campos ?? [];
  }
}
