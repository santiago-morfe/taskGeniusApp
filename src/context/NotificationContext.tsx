// contexto que controla un lista de notificaciones
// y permite agregar y eliminar notificaciones

import { createContext, useState, useEffect } from 'react'
import { Notification } from '../types/Notification'

export type NotificationContextType = {
    notifications: Notification[]
    addNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
    removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (notifications.length > 0) {
                setNotifications((prev) => prev.slice(1))
            }
        }, 3000) 

        return () => clearTimeout(timer) // Limpia el temporizador al desmontar el componente
    }, [notifications])

    const addNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
        const newNotification: Notification = {
            id: Date.now().toString(), // Genera un ID único basado en la fecha y hora actual
            message,
            type
        };
        setNotifications((prev) => [newNotification, ...prev]); // Agrega la nueva notificación al inicio de la lista
    }

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    }

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification}}>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext