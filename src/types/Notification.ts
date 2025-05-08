export interface Notification {
    id: string;
    message: string;
    type: Type;
}

export type Type = 'info' | 'success' | 'error' | 'warning' | 'loading'; 