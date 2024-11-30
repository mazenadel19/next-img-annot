'use client'
import { TITLE } from '@/app/constants'
import { useAuth } from '@/providers/context/auth-context'
import { auth } from '@/utils/firebase'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { signOut } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export default function ButtonAppBar() {
    const router = useRouter()
    const { user, loading } = useAuth()

    async function logout() {
        try {
            await signOut(auth)
            router.replace('/auth')
        } catch (error) {
            toast.error((error as Error).message, {
                ariaProps: {
                    role: 'alert',
                    'aria-live': 'assertive',
                },
            })
        }
    }

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/auth')
        }
    }, [user, loading, router])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                            {TITLE}
                        </Link>
                    </Typography>

                    {user && (
                        <>
                            <Button
                                aria-label="create a new task"
                                style={{ color: 'white' }}
                                variant="outlined"
                                component={Link}
                                href="/new"
                            >
                                NEW TASK
                            </Button>
                            <Button aria-label="logout" style={{ color: 'white' }} variant="outlined" onClick={logout}>
                                Logout
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    )
}
