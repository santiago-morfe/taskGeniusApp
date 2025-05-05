import { LoginRequestDto, LoginResponseDto, RegisterRequestDto, RegisterResponseDto } from "../types/Auth";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const login = async (data: LoginRequestDto): Promise<LoginResponseDto> => {
    const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to login');
    }

    return response.json();
};

export const register = async (data: RegisterRequestDto): Promise<RegisterResponseDto> => {
    const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to register');
    }

    const responseData = await response.json(); // Leer el cuerpo de la respuesta una sola vez
    return responseData; // Retornar el cuerpo leído
};

export const logout = async (): Promise<void> => {
    localStorage.removeItem('token');
};