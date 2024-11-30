'use client'

import { useAuth } from '@/providers/context/auth-context'
import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/auth')
        }
    }, [user, loading, router])

    if (loading) {
        return <CircularProgress />
    }

    return <>{user ? children : 'Not authorized'}</>
}
