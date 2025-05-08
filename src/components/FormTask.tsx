import React, { useState, useEffect } from 'react';
import { CreateTaskDto } from '../types/Task';
import { useTask } from '../hooks/useTask';
import { useNotification } from '../hooks/useNotification';
import { getTitleSuggestion, formatDescription } from '../api/geniusService';
import { LoadingBlurCard } from './LoadingBlurCard';
import { FaPlus } from "react-icons/fa";
import { MdEditNote } from "react-icons/md";
import { RiAiGenerateText } from "react-icons/ri";
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
    const [titleCooldown, setTitleCooldown] = useState(0);
    const [descriptionCooldown, setDescriptionCooldown] = useState(0);

    useEffect(() => {
        let titleTimer: NodeJS.Timeout;
        let descriptionTimer: NodeJS.Timeout;

        if (titleCooldown > 0) {
            titleTimer = setTimeout(() => setTitleCooldown(titleCooldown - 1), 1000);
        }

        if (descriptionCooldown > 0) {
            descriptionTimer = setTimeout(() => setDescriptionCooldown(descriptionCooldown - 1), 1000);
        }

        return () => {
            clearTimeout(titleTimer);
            clearTimeout(descriptionTimer);
        };
    }, [titleCooldown, descriptionCooldown]);

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
        if (task.description && titleCooldown === 0) {
            try {
                setLoading(true);
                const response = await getTitleSuggestion(task.description);
                setTask({ ...task, title: response.title || '' });
                addNotification('Título generado', 'success');
                setTitleCooldown(10);
            } catch (error) {
                addNotification('Error al generar título', 'error');
                console.error('Error fetching title suggestion:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFormatDescription = async () => {
        if (task.description && descriptionCooldown === 0) {
            try {
                setLoading(true);
                const response = await formatDescription(task.description);
                setTask({ ...task, description: response.description || '' });
                addNotification('Descripción formateada', 'success');
                setDescriptionCooldown(10);
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
                className={styles.newTaskButton}
                onClick={() => setShowForm(true)}
                aria-label="Crear nueva tarea"
            >
                <FaPlus />
                Nueva tarea
            </button>
        );
    }

    return (
        <div className={styles.backdrop}>
            <div className={styles.container}>
                <LoadingBlurCard loading={loading}>
                    <h2 className={styles.title}>Nueva tarea</h2>
                    <form className={styles.form} onSubmit={handleSubmit} aria-label="Formulario de nueva tarea">
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="task-title">Título</label>
                            <div className={styles.inputContainer}>
                                <input
                                    id="task-title"
                                    className={styles.input}
                                    type="text"
                                    name="title"
                                    value={task.title || ''}
                                    onChange={handleChange}
                                    placeholder="Título de la tarea"
                                    required
                                    aria-required="true"
                                />
                                {task.description && (
                                    <button
                                        type="button"
                                        className={styles.inputButton}
                                        onClick={handleGetTitleSuggestion}
                                        disabled={titleCooldown > 0}
                                        aria-label="Generar título desde descripción"
                                        title="Generar desde descripción"
                                    >
                                        {titleCooldown > 0 ? <span className={styles.cooldownText}>{titleCooldown}s</span> : <RiAiGenerateText />}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="task-description">Descripción</label>
                            <div className={styles.textareaContainer}>
                                <textarea
                                    id="task-description"
                                    className={styles.textarea}
                                    name="description"
                                    value={task.description || ''}
                                    onChange={handleChange}
                                    placeholder="Describe la tarea en detalle"
                                    aria-label="Descripción de la tarea"
                                ></textarea>
                                {task.description && (
                                    <button
                                        type="button"
                                        className={styles.inputButton}
                                        onClick={handleFormatDescription}
                                        disabled={descriptionCooldown > 0}
                                        aria-label="Reformatear descripción"
                                        title="Reformatear descripción"
                                    >
                                        {descriptionCooldown > 0 ? <span className={styles.cooldownText}>{descriptionCooldown}s</span> : <MdEditNote />}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <div className={styles.checkboxGroup}>
                                <input
                                    id="enable-date"
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={showDatePicker}
                                    onChange={() => setShowDatePicker(!showDatePicker)}
                                    aria-label="Activar fecha de vencimiento"
                                />
                                <label className={styles.label} htmlFor="enable-date">
                                    Agregar fecha de vencimiento
                                </label>
                            </div>

                            {showDatePicker && (
                                <div className={styles.formGroup}>
                                    <label className={styles.label} htmlFor="task-due-date">Fecha de vencimiento</label>
                                    <input
                                        id="task-due-date"
                                        className={styles.dateInput}
                                        type="date"
                                        name="dueDate"
                                        value={task.dueDate || ''}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={handleChange}
                                        aria-label="Fecha de vencimiento de la tarea"
                                    />
                                </div>
                            )}
                        </div>

                        <div className={styles.buttonGroup}>
                            <button
                                type="button"
                                className={`${styles.button} ${styles.secondaryButton}`}
                                onClick={handleCancel}
                                aria-label="Cancelar creación de tarea"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className={`${styles.button} ${styles.primaryButton}`}
                                disabled={!task.title}
                                aria-label="Crear tarea"
                            >
                                Crear tarea
                            </button>
                        </div>
                    </form>
                </LoadingBlurCard>
            </div>
        </div>
    );
};

export default FormTask;