import { apiRequest } from "../../shared/api/client";
import type { LoginRequest, LoginResponse, RegistrarRequest } from "./types";

export function login(dados: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/login", { method: "POST", body: dados });
}

export function registrar(dados: RegistrarRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/registrar", { method: "POST", body: dados });
}
