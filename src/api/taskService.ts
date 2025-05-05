const baseUrl = import.meta.env.VITE_API_BASE_URL;

import { TaskDto, CreateTaskDto, UpdateTaskDto } from '../types/Task';

export const getTasks = async (): Promise<TaskDto[]> => {
    const response = await fetch(`${baseUrl}/Task`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }

    return response.json();
};

export const getTaskById = async (id: number): Promise<TaskDto> => {
    const response = await fetch(`${baseUrl}/Task/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch task');
    }

    return response.json();
};

export const createTask = async (data: CreateTaskDto): Promise<void> => {
    const response = await fetch(`${baseUrl}/Task`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to create task');
    }
};

export const updateTask = async (data: UpdateTaskDto): Promise<void> => {
    const response = await fetch(`${baseUrl}/Task/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to update task');
    }
};

export const deleteTask = async (id: number): Promise<void> => {
    const response = await fetch(`${baseUrl}/Task/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete task');
    }
};