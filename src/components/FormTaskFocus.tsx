import React, { useState, useEffect } from 'react';
import { useTaskFocus } from '../hooks/useTaskFocus';
import { useTask } from '../hooks/useTask';
import { UpdateTaskDto } from '../types/Task';
import { useNotification } from '../hooks/useNotification';
import styles from './FormTaskFocus.module.css';

const FormTaskFocus: React.FC = () => {
  const { taskFocus, setTaskFocus } = useTaskFocus();
  const { deleteTask, updateTask } = useTask();
  const { addNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [taskData, setTaskData] = useState<UpdateTaskDto>({
    id: taskFocus?.id || 0,
    title: taskFocus?.title || '',
    description: taskFocus?.description || '',
    dueDate: taskFocus?.dueDate || null,
    isCompleted: taskFocus?.isCompleted || false,
  });

  // Update form data when taskFocus changes
  useEffect(() => {
    if (taskFocus) {
      setTaskData({
        id: taskFocus.id,
        title: taskFocus.title || '',
        description: taskFocus.description || '',
        dueDate: taskFocus.dueDate || null,
        isCompleted: taskFocus.isCompleted || false,
      });
      setIsEditing(false);
    }
  }, [taskFocus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!isEditing) return;
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = async () => {
    if (taskFocus) {
      try {
        await deleteTask(taskFocus.id);
        setTaskFocus(null);
        addNotification("Tarea eliminada con éxito", "success");
      } catch (error) {
        addNotification("Error al eliminar la tarea", "error");
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleSaveClick = async () => {
    if (taskFocus) {
      try {
        const updatedTask = {
          ...taskData,
          id: taskFocus.id,
          dueDate: taskData.dueDate || null,
        };
        await updateTask(updatedTask);
        setTaskData(updatedTask);
        addNotification("Tarea actualizada con éxito", "success");
        setIsEditing(false);
      } catch (error) {
        addNotification("Error al actualizar la tarea", "error");
        console.error('Error updating task:', error);
      }
    }
  };

  const handleCancel = () => {
    // Reset form data to original task data when cancelling edit
    if (taskFocus) {
      setTaskData({
        id: taskFocus.id,
        title: taskFocus.title || '',
        description: taskFocus.description || '',
        dueDate: taskFocus.dueDate || null,
        isCompleted: taskFocus.isCompleted || false,
      });
    }
    setIsEditing(false);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    
    setTaskData((prevData) => ({
      ...prevData,
      isCompleted: e.target.checked,
    }));
  };

  // Don't render if no task is focused
  if (!taskFocus) {
    return null;
  }

  return (
    <div className={styles.taskDetailContainer}>
      <h2 className={styles.taskDetailTitle}>Detalles de la Tarea</h2>
      
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.formLabel}>Título:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={taskData.title || ''}
          onChange={handleInputChange}
          disabled={!isEditing}
          className={styles.formInput}
          aria-required="true"
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.formLabel}>Descripción:</label>
        <textarea
          id="description"
          name="description"
          value={taskData.description || ''}
          onChange={handleInputChange}
          disabled={!isEditing}
          className={styles.formTextarea}
          rows={4}
        ></textarea>
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="dueDate" className={styles.formLabel}>Fecha límite:</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={taskData.dueDate ? taskData.dueDate.split('T')[0] : ''}
          onChange={handleInputChange}
          disabled={!isEditing}
          className={styles.formInput}
        />
      </div>
      
      <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
        <label htmlFor="isCompleted" className={styles.checkboxLabel}>
          <input
            type="checkbox"
            id="isCompleted"
            name="isCompleted"
            checked={taskData.isCompleted}
            onChange={handleCheckboxChange}
            disabled={!isEditing}
            className={styles.checkbox}
          />
          <span>Completada</span>
        </label>
      </div>
      
      <div className={styles.buttonGroup}>
        {!isEditing ? (
          <>
            <button 
              onClick={handleEditClick} 
              className={`${styles.button} ${styles.editButton}`}
              aria-label="Editar tarea"
            >
              Editar
            </button>
            <button 
              onClick={handleDeleteClick} 
              className={`${styles.button} ${styles.deleteButton}`}
              aria-label="Eliminar tarea"
            >
              Eliminar
            </button>
            <button 
              onClick={() => setTaskFocus(null)} 
              className={`${styles.button} ${styles.closeButton}`}
              aria-label="Cerrar detalles"
            >
              Cerrar
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={handleSaveClick} 
              className={`${styles.button} ${styles.saveButton}`}
              aria-label="Guardar cambios"
            >
              Guardar
            </button>
            <button 
              onClick={handleCancel} 
              className={`${styles.button} ${styles.cancelButton}`}
              aria-label="Cancelar edición"
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FormTaskFocus;