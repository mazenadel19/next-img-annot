'use client'
import { createContext, useMemo } from 'react'

export const FirebaseContext = createContext({})
function FirebaseProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const memoizedContextValue = useMemo(() => ({}), [])
    return <FirebaseContext.Provider value={memoizedContextValue}>{children}</FirebaseContext.Provider>
}
export default FirebaseProvider
