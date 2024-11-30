'use client'
import ProtectedRoute from '@/components/protected-route'
import { useAuth } from '@/providers/context/auth-context'
import { db } from '@/utils/firebase'
// import { createBulkDummyTasks } from '@/utils/helper'
import { Task } from '@/utils/types'
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material'
import {
    collection,
    DocumentData,
    getDocs,
    limit,
    orderBy,
    query,
    QueryDocumentSnapshot,
    startAfter,
    where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

const Dashboard = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(false)
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null) // Track the last document for pagination
    const [statusFilter, setStatusFilter] = useState<Task['status']>('Pending') // Set status filter for fetching tasks
    const { user } = useAuth()

    const loadMoreTasks = async () => {
        if (!lastDoc) {
            return
        }

        setLoading(true)
        try {
            const tasksQuery = query(
                collection(db, 'tasks'),
                where('assignedTo', '==', user?.uid),
                where('status', '==', statusFilter),
                orderBy('status'),
                startAfter(lastDoc),
                limit(10)
            )

            const snapshot = await getDocs(tasksQuery)
            const newTasks = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Task[]

            setTasks((prevTasks) => [...prevTasks, ...newTasks])
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]) // Update the last document for pagination
            setLoading(false)
        } catch (error) {
            console.error('Error fetching more tasks:', error)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!user?.uid || !statusFilter) {
            return
        }

        // Fetch tasks based on user and status
        const fetchTasks = async () => {
            setLoading(true)
            try {
                const tasksQuery = query(
                    collection(db, 'tasks'),
                    where('assignedTo', '==', user?.uid),
                    where('status', '==', statusFilter),
                    orderBy('status'),
                    limit(10)
                )

                const snapshot = await getDocs(tasksQuery)
                const newTasks = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Task[]

                setTasks(newTasks)
                setLastDoc(snapshot.docs[snapshot.docs.length - 1]) // Set the last document for pagination
                setLoading(false)
            } catch (error) {
                console.error('Error fetching tasks:', error)
                setLoading(false)
            }
        }
        fetchTasks() // Initially load tasks
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

                <Box sx={{ mb: 2 }}>
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
                                sx={{ borderBottom: '1px solid #ccc', paddingBottom: 2, marginBottom: 2 }}
                            >
                                <Typography variant="h6">{task.description}</Typography>
                                <Typography>Status: {task.status}</Typography>
                            </Box>
                        ))}
                        {tasks.length > 0 && lastDoc && (
                            <Button onClick={loadMoreTasks} variant="outlined">
                                Load More
                            </Button>
                        )}
                    </>
                )}
            </Container>
        </ProtectedRoute>
    )
}

export default Dashboard
