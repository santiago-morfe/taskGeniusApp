export interface RegisterRequestDto {
  name?: string | null;
  email?: string | null;
  password?: string | null;
}

export interface RegisterResponseDto {
  token?: string | null;
  expiration?: string; // ISO 8601 date-time
  id?: number;
  name?: string | null;
  email?: string | null;
  createdAt?: string; // ISO 8601 date-time
}

export interface LoginRequestDto {
  email?: string | null;
  password?: string | null;
}

export interface LoginResponseDto {
  token?: string | null;
  expiration?: string; // ISO 8601 date-time
  id?: number;
  name?: string | null;
  email?: string | null;
  createdAt?: string; // ISO 8601 date-time
}