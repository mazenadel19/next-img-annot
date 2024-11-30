'use client'

import { useAuth } from '@/providers/context/auth-context'
import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading) {
            router.replace(user ? '/dashboard' : '/auth')
        }
    }, [user, loading, router])

    return <CircularProgress />
}
