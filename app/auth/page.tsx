'use client'
import { auth, db } from '@/utils/firebase'
import { Box, Button, Container, TextField, Typography } from '@mui/material'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { useAuth } from '@/providers/context/auth-context'

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState<null | string>(null)
    const [password, setPassword] = useState<null | string>(null)
    const [error, setError] = useState('')
    const { user, loading } = useAuth()
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            if (!email || !password) {
                setError('Please enter email and password')
                return
            }
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password)
            } else {
                const userCred = await createUserWithEmailAndPassword(auth, email, password)
                const { user } = userCred
                const userRef = doc(db, 'users', user.uid)
                await setDoc(userRef, {
                    email: user.email,
                    createdAt: new Date().toISOString(),
                    tasks: [],
                })
            }
            router.replace('/dashboard')
        } catch (error) {
            setError((error as Error).message)
        }
    }

    useEffect(() => {
        if (!loading && user) {
            router.replace('/dashboard')
        }
    }, [user, loading, router])

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
            }}
        >
            <form onSubmit={handleSubmit}>
                <Box
                    sx={{
                        width: '100%',
                        padding: '2rem',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        {isLogin ? 'Login' : 'Sign Up'}
                    </Typography>
                    <TextField
                        placeholder="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        onChange={(e) => setEmail(e.target.value)}
                        slotProps={{
                            input: {
                                style: {
                                    backgroundColor: 'white',
                                },
                            },
                            htmlInput: {
                                style: {
                                    WebkitBoxShadow: '0 0 0 100px white inset',
                                    WebkitTextFillColor: 'black',
                                },
                            },
                        }}
                    />
                    <TextField
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        slotProps={{
                            input: {
                                style: {
                                    backgroundColor: 'white',
                                },
                            },
                            htmlInput: {
                                style: {
                                    WebkitBoxShadow: '0 0 0 100px white inset',
                                    WebkitTextFillColor: 'black',
                                },
                            },
                        }}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: '1rem' }}>
                        {isLogin ? 'Login' : 'Sign Up'}
                    </Button>
                    {error && (
                        <Typography color="error" sx={{ textAlign: 'center', marginTop: '1rem' }}>
                            {error}
                        </Typography>
                    )}
                    {!error && <span style={{ display: 'block', marginTop: '56px' }} />}
                    <Typography variant="body2" align="center" sx={{ marginTop: '1rem', color: 'gray' }}>
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <Button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            color="primary"
                            sx={{ textTransform: 'none', fontWeight: 'bold' }}
                            variant="text"
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </Button>
                    </Typography>
                </Box>
            </form>
        </Container>
    )
}
