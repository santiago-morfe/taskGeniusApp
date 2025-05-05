import { useState } from "react";
import { TaskDto } from "../types/Task";
import { LoadingBlurCard } from "./LoadingBlurCard";
import { useTask } from "../hooks/useTask";
import { AiFillDelete } from "react-icons/ai";
import { AiFillCheckCircle } from "react-icons/ai";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useTaskFocus } from "../hooks/useTaskFocus";
import { useNotification } from "../hooks/useNotification";
import styles from "./ItemTask.module.css";

interface ItemTaskProps {
    task: TaskDto;
}

const ItemTask: React.FC<ItemTaskProps> = ({ task }) => {
    const { setTaskFocus, taskFocus } = useTaskFocus();
    const { deleteTask, completeTask, unCompleteTask } = useTask();
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await deleteTask(task.id);
            addNotification("Tarea eliminada", "success");
        } catch (error) {
            console.error(error);
            addNotification("Error al eliminar la tarea", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleComplete = async () => {
        setIsLoading(true);
        try {
            await completeTask(task.id);
            addNotification("Tarea completada", "success");
        } catch (error) {
            console.error(error);
            addNotification("Error al completar la tarea", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnComplete = async () => {
        setIsLoading(true);
        try {
            await unCompleteTask(task.id);
            addNotification("Tarea desmarcada como completada", "success");
        } catch (error) {
            console.error(error);
            addNotification("Error al desmarcar la tarea como completada", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTaskFocus = () => {
        setTaskFocus(task);
    };

    const isFocused = taskFocus && taskFocus.id === task.id;

    return (
        <LoadingBlurCard loading={isLoading}>
            <div className={`${styles.taskItem} ${task.isCompleted ? styles.completed : ''} ${isFocused ? styles.focused : ''}`}>
                <button
                    className={styles.actionButton}
                    onClick={task.isCompleted ? handleUnComplete : handleComplete}
                    aria-label={task.isCompleted ? "Marcar como incompleta" : "Marcar como completada"}
                    title={task.isCompleted ? "Desmarcar tarea" : "Completar tarea"}
                >
                    {task.isCompleted ?
                        <AiFillCheckCircle className={styles.completeIcon} /> :
                        <AiOutlineCheckCircle className={styles.incompleteIcon} />}
                </button>

                <span
                    className={styles.taskTitle}
                    onClick={handleTaskFocus}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isFocused ? "true" : "false"}
                >
                    {task.title || "Sin título"}
                </span>

                <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={handleDelete}
                    aria-label="Eliminar tarea"
                    title="Eliminar tarea"
                >
                    <AiFillDelete className={styles.deleteIcon} />
                </button>

                {isFocused && (
                    <span className={styles.focusIndicator} aria-live="polite">
                        — Tarea en foco
                    </span>
                )}
            </div>
        </LoadingBlurCard>
    );
}

export default ItemTask;