'use client'
import ProtectedRoute from '@/components/protected-route'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/utils/firebase'
import { Box, Button, Typography, Paper, Container } from '@mui/material'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Task } from '@/utils/types'
import { useAuth } from '@/providers/context/auth-context'

const TaskDetails = ({ params: { id } }: { params: { id: string } }) => {
    const router = useRouter()
    const [task, setTask] = useState<Task | null>(null)
    const [annotations, setAnnotations] = useState<Task['annotations'][]>([])
    const { user } = useAuth()

    const handleSaveAnnotations = async () => {
        if (!user?.uid || !id || !task) {
            return
        }
        try {
            const taskDocRef = doc(db, 'tasks', id as string)
            await updateDoc(taskDocRef, {
                annotations,
                status: 'Completed',
            })

            const userDocRef = doc(db, 'users', user?.uid)
            const userDoc = await getDoc(userDocRef)

            if (userDoc.exists()) {
                const userTasks: string[] = userDoc.data().tasks
                const currentTaskIndex = userTasks.findIndex((taskId: string) => taskId === id)

                if (currentTaskIndex >= 0) {
                    let nextPendingTaskId: string | null = null

                    for (let i = currentTaskIndex + 1; i < userTasks.length; i++) {
                        const nextTaskDocRef = doc(db, 'tasks', userTasks[i])
                        const nextTaskDoc = await getDoc(nextTaskDocRef)

                        if (nextTaskDoc.exists() && nextTaskDoc.data().status === task.status) {
                            nextPendingTaskId = userTasks[i]
                            break
                        }
                    }

                    if (nextPendingTaskId) {
                        router.push(`/dashboard/${nextPendingTaskId}`)
                    } else {
                        toast.success(`No more ${task.status} tasks available.`, {
                            ariaProps: {
                                role: 'alert',
                                'aria-live': 'assertive',
                            },
                        })
                        router.push('/dashboard')
                    }
                } else {
                    toast.success('No more tasks available.', {
                        ariaProps: {
                            role: 'alert',
                            'aria-live': 'assertive',
                        },
                    })
                    router.push('/dashboard')
                }
            } else {
                toast.error('User not found', {
                    ariaProps: {
                        role: 'alert',
                        'aria-live': 'assertive',
                    },
                })
            }
        } catch (error) {
            toast.error('Error while saving annotations: ' + (error as Error).message, {
                ariaProps: {
                    role: 'alert',
                    'aria-live': 'assertive',
                },
            })
        }
    }

    useEffect(() => {
        if (!id) {
            return
        }
        const fetchTask = async () => {
            try {
                const taskDocRef = doc(db, 'tasks', id as string)
                const taskDoc = await getDoc(taskDocRef)
                if (taskDoc.exists()) {
                    setTask(taskDoc.data() as Task)
                    setAnnotations(taskDoc.data().annotations || [])
                } else {
                    toast.error('Task not found', {
                        ariaProps: {
                            role: 'alert',
                            'aria-live': 'assertive',
                        },
                    })
                }
            } catch (error) {
                toast.error('Error while loading the task: ' + (error as Error).message, {
                    ariaProps: {
                        role: 'alert',
                        'aria-live': 'assertive',
                    },
                })
            }
        }
        fetchTask()
    }, [id])

    return (
        <ProtectedRoute>
            <Container
                maxWidth="sm"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    padding: 3,
                }}
            >
                {task && (
                    <Paper
                        sx={{
                            padding: 2,
                            position: 'relative',
                            flex: '1',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Box sx={{ position: 'relative', width: '100%', flex: 1, marginBottom: 2 }}>
                            <Image
                                src={task.imageURL}
                                alt="Task Image"
                                fill
                                style={{
                                    borderRadius: '0.375rem',
                                    objectFit: 'cover',
                                }}
                                priority
                            />
                        </Box>

                        <Typography variant="h5" title={task.description}>
                            Description:{' '}
                            {task.description.length > 60 ? task.description.slice(0, 60) + '...' : task.description}
                        </Typography>
                        <Typography variant="h6">Status: {task.status}</Typography>
                        {(task.status === 'Pending' || task.status === 'InProgress') && (
                            <Box display="flex" justifyContent="flex-end">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveAnnotations}
                                    sx={{ marginTop: 2 }}
                                >
                                    Next
                                </Button>
                            </Box>
                        )}
                    </Paper>
                )}
            </Container>
        </ProtectedRoute>
    )
}

export default TaskDetails
