// contexto que controla el usos de la API de tareas en servicio
import { createContext, useState, useEffect } from "react";

import { CreateTaskDto, TaskDto, UpdateTaskDto } from "../types/Task";
import { 
    createTask as apiCreateTask,
    deleteTask as apiDeleteTask,
    getTasks as apiGetTasks,
    updateTask as apiUpdateTask,
} from "../api/taskService";

export type TaskContextType = {
    tasks: TaskDto[];
    createTask: (task: CreateTaskDto) => Promise<void>;
    deleteTask: (taskId: number) => Promise<void>;
    updateTask: (task: UpdateTaskDto) => Promise<void>;
    completeTask: (taskId: number) => Promise<void>;
    unCompleteTask: (taskId: number) => Promise<void>;
    getTasks: () => Promise<void>;
};

const TaskContext = createContext<TaskContextType>({
    tasks: [],
    createTask: async () => {},
    deleteTask: async () => {},
    updateTask: async () => {},
    completeTask: async () => {},
    unCompleteTask: async () => {},
    getTasks: async () => {},
});

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
    const [tasks, setTasks] = useState<TaskDto[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await apiGetTasks();
                setTasks(response);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    const getTasks = async () => {
        try {
            const response = await apiGetTasks();
            setTasks(response)
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const createTask = async (task: CreateTaskDto) => {
        try {
            await apiCreateTask(task);
            await getTasks(); // Refresh the task list after creating a new task
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const deleteTask = async (taskId: number) => {
        try {
            await apiDeleteTask(taskId);
            await getTasks(); // Refresh the task list after deleting a task
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const updateTask = async (task: UpdateTaskDto) => {
        try {
            await apiUpdateTask(task);
            await getTasks(); // Refresh the task list after updating a task
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const completeTask = async (taskId: number) => {
        try {
            const task = tasks.find((t) => t.id === taskId);
            if (!task) throw new Error("Task not found");
            await apiUpdateTask({ ...task, isCompleted: true });
            await getTasks(); // Refresh the task list after completing a task
        } catch (error) {
            console.error("Error completing task:", error);
        }
    };

    const unCompleteTask = async (taskId: number) => {
        try {
            const task = tasks.find((t) => t.id === taskId);
            if (!task) throw new Error("Task not found");
            await apiUpdateTask({ ...task, isCompleted: false });
            await getTasks();
        } catch (error) {
            console.error("Error uncompleting task:", error);
        }
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                createTask,
                deleteTask,
                updateTask,
                completeTask,
                unCompleteTask,
                getTasks,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}

export default TaskContext;

