'use client'
import { auth } from '@/utils/firebase'
import { Box, Button, Container, Link, TextField, Typography } from '@mui/material'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function SignUp() {
    const [email, setEmail] = useState<null | string>(null)
    const [password, setPassword] = useState<null | string>(null)
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            if (!email || !password) {
                setError('Please enter email and password')
                return
            }
            await createUserWithEmailAndPassword(auth, email, password)
            router.replace('/dashboard')
        } catch (error) {
            setError((error as Error).message)
        }
    }
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
                        Sign Up
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
                        Sign Up
                    </Button>
                    {error && (
                        <Typography color="error" sx={{ textAlign: 'center', marginTop: '1rem' }}>
                            {error}
                        </Typography>
                    )}
                    {!error && <span style={{ display: 'block', marginTop: '56px' }} />}
                    <Typography variant="body2" align="center" sx={{ marginTop: '1rem', color: 'gray' }}>
                        Already have an account?{' '}
                        <Link href="/login" color="primary" underline="hover">
                            Login
                        </Link>
                    </Typography>
                </Box>
            </form>
        </Container>
    )
}
