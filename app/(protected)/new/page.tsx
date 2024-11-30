'use client'
import ProtectedRoute from '@/components/protected-route'
import { db } from '@/utils/firebase'
import { fetchUsers } from '@/utils/helper'
import { Task, User } from '@/utils/types'
import { Box, Button, CircularProgress, Container, MenuItem, TextField, Typography } from '@mui/material'
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function NewTaskForm() {
    const [description, setDescription] = useState('')
    const [assignedTo, setAssignedTo] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState<User[]>([])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!description || !image || !assignedTo) {
            toast.error('Description, Assigned To and image are required!', {
                ariaProps: {
                    role: 'alert',
                    'aria-live': 'assertive',
                },
            })
            return
        }

        setLoading(true)

        try {
            // Create FormData to upload the image to Imgur
            const formData = new FormData()
            formData.append('image', image)

            const res = await fetch('https://api.imgur.com/3/image', {
                method: 'POST',
                headers: {
                    Authorization: `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID}`,
                },
                body: formData,
            })

            const data = await res.json()

            if (data.success) {
                const imageURL = data.data.link

                const taskDoc: Task = {
                    imageURL: imageURL,
                    description,
                    assignedTo: assignedTo,
                    status: 'Pending',
                    annotations: [],
                    createdAt: new Date().toISOString(),
                }

                // Save task to Firestore
                const taskDocRef = await addDoc(collection(db, 'tasks'), taskDoc)

                // Update the assigned user's tasks array
                if (assignedTo) {
                    const userDocRef = doc(db, 'users', assignedTo)
                    await updateDoc(userDocRef, {
                        tasks: arrayUnion(taskDocRef.id),
                    })
                }

                toast.success('Task created successfully!', {
                    ariaProps: {
                        role: 'alert',
                        'aria-live': 'assertive',
                    },
                })
                setDescription('')
                setAssignedTo('')
                setImage(null)
            } else {
                toast.error('Failed to upload image to Imgur.', {
                    ariaProps: {
                        role: 'alert',
                        'aria-live': 'assertive',
                    },
                })
            }
            setLoading(false)
        } catch (error) {
            console.error('Error adding task:', error)
            toast.error('Error creating task. Please try again later.', {
                ariaProps: {
                    role: 'alert',
                    'aria-live': 'assertive',
                },
            })
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
            .then((users) => setUsers(users))
            .catch((error) => {
                console.error('Error fetching users:', error)
                toast.error('Error fetching users: ' + (error as Error).message, {
                    ariaProps: {
                        role: 'alert',
                        'aria-live': 'assertive',
                    },
                })
            })
    }, [])

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
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        width: '100%',
                        maxWidth: 400,
                        mx: 'auto',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        border: '1px solid #ccc',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h5" textAlign="center">
                        Create New Task
                    </Typography>
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Assign To"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        fullWidth
                        select
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {users.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.email}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button variant="contained" component="label">
                        Upload Image
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    setImage(file)
                                }
                            }}
                        />
                    </Button>
                    {image && <Typography>Selected: {image.name}</Typography>}
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Submit Task'}
                    </Button>
                </Box>
            </Container>
        </ProtectedRoute>
    )
}
