'use client'
import ProtectedRoute from '@/components/protected-route'
import { useAuth } from '@/providers/context/auth-context'
import { fetchTasks } from '@/utils/helper'
import { Task } from '@/utils/types'
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material'
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Dashboard = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(false)
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null) // Track the last document for pagination
    const [statusFilter, setStatusFilter] = useState<Task['status']>('Pending')
    const { user } = useAuth()

    const loadMoreTasks = async () => {
        if (!lastDoc || !user?.uid) {
            return
        }

        setLoading(true)
        try {
            const { tasks: newTasks, nextLastDoc } = await fetchTasks(statusFilter, user?.uid, lastDoc)
            setTasks((prevTasks) => [...prevTasks, ...newTasks])
            setLastDoc(nextLastDoc)
        } catch (error) {
            console.error('Error loading more tasks:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!user?.uid) {
            return
        }

        const fetchInitialTasks = async () => {
            setLoading(true)
            try {
                const { tasks: fetchedTasks, nextLastDoc } = await fetchTasks(statusFilter, user.uid, null)
                setTasks(fetchedTasks)
                setLastDoc(nextLastDoc)
            } catch (error) {
                console.error('Error fetching tasks:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchInitialTasks()
    }, [statusFilter, user?.uid])

    return (
        <ProtectedRoute>
            <Container
                maxWidth="md"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    mt: 3,
                }}
            >
                <Typography variant="h4" align="center">
                    Dashboard
                </Typography>

                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={() => setStatusFilter('Pending')}>
                        Pending
                    </Button>
                    <Button variant="contained" onClick={() => setStatusFilter('InProgress')} sx={{ ml: 2 }}>
                        In Progress
                    </Button>
                    <Button variant="contained" onClick={() => setStatusFilter('Completed')} sx={{ ml: 2 }}>
                        Completed
                    </Button>
                </Box>

                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        {tasks.map((task) => (
                            <Box
                                key={task.id}
                                sx={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: 2,
                                    marginBottom: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: '#f9f9f9',
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                                        {task.description}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555' }}>
                                        Status: <strong>{task.status}</strong>
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component={Link}
                                    href={`/dashboard/${task.id}`}
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        textTransform: 'none',
                                    }}
                                >
                                    View Annotations
                                </Button>
                            </Box>
                        ))}
                    </>
                )}
                {tasks.length > 0 && lastDoc && (
                    <Button onClick={loadMoreTasks} variant="outlined" disabled={loading}>
                        {loading ? 'Loading...' : 'Load More'}
                    </Button>
                )}
            </Container>
        </ProtectedRoute>
    )
}

export default Dashboard
