export interface LoginRequest {
  celular: string;
  senha: string;
}

export interface RegistrarRequest {
  nome: string;
  celular: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  produtorId: string;
  nome: string;
}
