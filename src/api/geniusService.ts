import { TaskAdviceResponseDto, TitleSuggestionResponseDto, DescriptionFormattingResponseDto, TitleSuggestionRequestDto, DescriptionFormattingRequestDto } from '../types/Genius';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const getTaskAdvice = async (): Promise<TaskAdviceResponseDto> => {
    try {
        const response = await fetch(`${baseUrl}/genius/advice`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch task advice');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching task advice:', error);
        throw error;
    }
};

export const getTitleSuggestion = async (description: string): Promise<TitleSuggestionResponseDto> => {
    try {
        const requestBody: TitleSuggestionRequestDto = { description };
        const response = await fetch(`${baseUrl}/genius/titleSuggestion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch title suggestion');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching title suggestion:', error);
        throw error;
    }
};

export const formatDescription = async (description: string): Promise<DescriptionFormattingResponseDto> => {
    try {
        const requestBody: DescriptionFormattingRequestDto = { description };
        const response = await fetch(`${baseUrl}/genius/descriptionFormatting`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to format description');
        }

        return response.json();
    } catch (error) {
        console.error('Error formatting description:', error);
        throw error;
    }
};

export const askTaskQuestion = async (question: string): Promise<TaskAdviceResponseDto> => {
    if (!question || question.trim() === '') {
        throw new Error('La pregunta no puede estar vacía.');
    }

    try {
         const response = await fetch(`${baseUrl}/genius/taskQuestion/${question}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            } 
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to answer task question');
        }

        return response.json();
    } catch (error) {
        console.error('Error answering task question:', error);
        throw error;
    }
};

export const getSpecificTaskAdvice = async (taskId: string): Promise<TaskAdviceResponseDto> => {
    if (!taskId || taskId.trim() === '') {
        throw new Error('El ID de la tarea no puede estar vacío.');
    }

    try {
        const response = await fetch(`${baseUrl}/genius/taskAdvice/${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch specific task advice');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching specific task advice:', error);
        throw error;
    }
};

