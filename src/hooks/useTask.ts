import { useContext } from "react"
import  TaskContext, {TaskContextType } from "../context/TaskContext"

export const useTask = (): TaskContextType => {
    const context = useContext(TaskContext)
    if (!context) {
        throw new Error('useTask debe usarse dentro de un TaskProvider')
    }
    return context
}