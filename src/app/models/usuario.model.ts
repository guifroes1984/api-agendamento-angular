export interface LoginRequest {
  usuario: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  usuario: string;
  email: string;
  role: string;
}

export interface RegisterRequest {
  usuario: string;
  email: string;
  senha: string;
}