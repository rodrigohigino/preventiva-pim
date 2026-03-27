export interface JwtPayload {
  sub: number;       // id do usuário
  email: string;
  perfil: string;
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    perfil: string;
  };
}
