import { useContext } from "react"
import TaskFocusContext, { TaskFocusContextType } from "../context/TaskFocusContext"

export const useTaskFocus = (): TaskFocusContextType => {
    const context = useContext(TaskFocusContext)
    if (!context) {
        throw new Error('useTaskFocus debe usarse dentro de un TaskProvider')
    }
    return context
}