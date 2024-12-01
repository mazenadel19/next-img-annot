'use client'
import ProtectedRoute from '@/components/protected-route'
import TasksList from '@/components/tasks-list'
import { useAuth } from '@/providers/context/auth-context'
import { fetchTasks } from '@/utils/helper'
import { Task } from '@/utils/types'
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material'
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

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
            toast.error('Error loading more tasks: ' + (error as Error).message, {
                ariaProps: {
                    role: 'alert',
                    'aria-live': 'assertive',
                },
            })
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
                toast.error('Error fetching tasks: ' + (error as Error).message, {
                    ariaProps: {
                        role: 'alert',
                        'aria-live': 'assertive',
                    },
                })
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

                {loading ? <CircularProgress /> : <TasksList tasks={tasks} />}
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
