import { TITLE } from '@/app/constants'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

export default function ButtonAppBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                            {TITLE}
                        </Link>
                    </Typography>

                    <Button
                        aria-label="create a new task"
                        style={{ color: 'white' }}
                        variant="outlined"
                        component={Link}
                        href="/new"
                    >
                        NEW TASK
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
