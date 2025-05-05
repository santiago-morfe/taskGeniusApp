import React, { useState } from 'react';
import { CreateTaskDto } from '../types/Task';
import { useTask } from '../hooks/useTask';
import { useNotification } from '../hooks/useNotification';
import { getTitleSuggestion, formatDescription } from '../api/geniusService';
import { LoadingBlurCard } from './LoadingBlurCard';
import styles from './FormTask.module.css';

const FormTask = () => {
    const { createTask } = useTask();
    const { addNotification } = useNotification();
    const [task, setTask] = useState<CreateTaskDto>({
        title: '',
        description: '',
        dueDate: null,
        isCompleted: false,
    });
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            await createTask(task);
            addNotification('Tarea creada exitosamente', 'success');
            setTask({
                title: '',
                description: '',
                dueDate: null,
                isCompleted: false,
            });
            setShowForm(false);
        } catch (error) {
            addNotification('Error al crear tarea', 'error');
            console.error('Error creating task:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setTask({
            title: '',
            description: '',
            dueDate: null,
            isCompleted: false,
        });
    };

    const handleGetTitleSuggestion = async () => {
        if (task.description) {
            try {
                setLoading(true);
                const response = await getTitleSuggestion(task.description);
                setTask({ ...task, title: response.title || '' });
                addNotification('Título generado', 'success');
            } catch (error) {
                addNotification('Error al generar título', 'error');
                console.error('Error fetching title suggestion:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFormatDescription = async () => {
        if (task.description) {
            try {
                setLoading(true);
                const response = await formatDescription(task.description);
                setTask({ ...task, description: response.description || '' });
                addNotification('Descripción formateada', 'success');
            } catch (error) {
                addNotification('Error al formatear descripción', 'error');
                console.error('Error formatting description:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    if (!showForm) {
        return (
            <button 
                className={styles.addButton}
                onClick={() => setShowForm(true)}
                aria-label="Crear nueva tarea"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Nueva tarea
            </button>
        );
    }

    return (
        <div className={styles.taskFormContainer}>
            <LoadingBlurCard loading={loading}>
                <h2 className={styles.formLabel}>Nueva tarea</h2>
                <form onSubmit={handleSubmit} className={styles.form} aria-label="Formulario de nueva tarea">
                    <div className={styles.formGroup}>
                        <label htmlFor="task-title" className={styles.formLabel}>Título</label>
                        <div className="flex items-center gap-2">
                            <input
                                id="task-title"
                                type="text"
                                name="title"
                                value={task.title || ''}
                                onChange={handleChange}
                                placeholder="Título de la tarea"
                                className={styles.formInput}
                                required
                                aria-required="true"
                            />
                            {task.description && (
                                <button 
                                    type="button" 
                                    className={styles.actionButton}
                                    onClick={handleGetTitleSuggestion}
                                    aria-label="Generar título desde descripción"
                                    title="Generar desde descripción"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                                    </svg>
                                    Generar desde descripción
                                </button>
                            )}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="task-description" className={styles.formLabel}>Descripción</label>
                        <textarea
                            id="task-description"
                            name="description"
                            value={task.description || ''}
                            onChange={handleChange}
                            placeholder="Describe la tarea en detalle"
                            className={styles.formTextarea}
                            aria-label="Descripción de la tarea"
                        ></textarea>
                        {task.description && (
                            <button 
                                type="button" 
                                className={styles.actionButton}
                                onClick={handleFormatDescription}
                                aria-label="Reformatear descripción"
                                title="Reformatear descripción"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                                Reformatear
                            </button>
                        )}
                    </div>

                    <div className={styles.dateToggle}>
                        <label className={styles.toggleSwitch}>
                            <input 
                                type="checkbox" 
                                checked={showDatePicker}
                                onChange={() => setShowDatePicker(!showDatePicker)}
                                aria-label="Activar fecha de vencimiento"
                            />
                            <span className={styles.slider}></span>
                        </label>
                        <span className={styles.toggleLabel}>Agregar fecha de vencimiento</span>
                    </div>

                    {showDatePicker && (
                        <div className={styles.formGroup}>
                            <label htmlFor="task-due-date" className={styles.formLabel}>Fecha de vencimiento</label>
                            <input
                                id="task-due-date"
                                type="date"
                                name="dueDate"
                                value={task.dueDate || ''}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={handleChange}
                                className={styles.formInput}
                                aria-label="Fecha de vencimiento de la tarea"
                            />
                        </div>
                    )}

                    <div className={styles.buttonGroup}>
                        <button 
                            type="button" 
                            className={styles.cancelButton}
                            onClick={handleCancel}
                            aria-label="Cancelar creación de tarea"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className={styles.submitButton}
                            disabled={!task.title}
                            aria-label="Crear tarea"
                        >
                            Crear tarea
                        </button>
                    </div>
                </form>
            </LoadingBlurCard>
        </div>
    );
};

export default FormTask;