import { TaskDto } from "../types/Task";
import { useTask } from "../hooks/useTask";
import ItemTask from "./ItemTask";
import FormTaskFocus from "./FormTaskFocus";
import { useTaskFocus } from "../hooks/useTaskFocus";
import FormTask from "./FormTask";
import styles from "./ListTask.module.css";

const ListTask = () => {
    const { tasks } = useTask();
    const { taskFocus } = useTaskFocus();


    if (!tasks || tasks.length === 0) {
        return (
            <div className={styles.emptyState} role="status">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className={styles.emptyStateIcon}
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                </svg>
                <p className={styles.emptyStateText}>No hay tareas disponibles</p>
                <FormTask />
            </div>
        );
    }

    return (
        <div className={styles.taskContainer}>
            <section className={styles.taskListSection}>
                <div className={styles.taskHeader}>
                    <h2 className={styles.taskTitle}>Mis tareas</h2>
                    <span className={styles.taskCount}>{tasks.length}</span>
                    <FormTask />
                </div>
                <div className={styles.taskList}>
                    {tasks.map((task: TaskDto) => (
                        <ItemTask key={task.id} task={task} />
                    ))}
                </div>
            </section>
            
            {taskFocus && (
                <section className={styles.taskDetailSection}>
                    <FormTaskFocus />
                </section>
            )}
        </div>
    );
};

export default ListTask;