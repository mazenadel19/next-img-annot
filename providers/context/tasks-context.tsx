'use client'
import { createContext, useMemo } from 'react'

export const TasksContext = createContext({})
function TasksProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const memoizedContextValue = useMemo(() => ({}), [])
    return <TasksContext.Provider value={memoizedContextValue}>{children}</TasksContext.Provider>
}
export default TasksProvider
