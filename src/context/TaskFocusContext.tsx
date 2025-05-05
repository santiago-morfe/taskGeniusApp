// contexto para almasenal las tarea en focus

import { createContext, useState } from 'react'
import { TaskDto } from '../types/Task'

export type TaskFocusContextType = {
    taskFocus: TaskDto | null
    setTaskFocus: (task: TaskDto | null) => void
}
const TaskFocusContext = createContext<TaskFocusContextType>({
    taskFocus: null,
    setTaskFocus: () => {},
})
export const TaskFocusProvider = ({ children }: { children: React.ReactNode }) => {
    const [taskFocus, setTaskFocus] = useState<TaskDto | null>(null)

    return (
        <TaskFocusContext.Provider value={{ taskFocus, setTaskFocus }}>
            {children}
        </TaskFocusContext.Provider>
    )
}
export default TaskFocusContext