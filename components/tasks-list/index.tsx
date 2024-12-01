import { Task } from '@/utils/types'
import { Box, Button, Typography } from '@mui/material'
import Link from 'next/link'

const TasksList = ({ tasks }: { tasks: Task[] }) => {
    if (tasks.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                    No tasks found
                </Typography>
            </Box>
        )
    }

    return (
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
    )
}
export default TasksList
