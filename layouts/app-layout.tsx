import { Box } from '@mui/material'

import ButtonAppBar from '@/components/surface/app-bar'

const AppLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Box>
                <ButtonAppBar />
            </Box>
            <Box component="main" sx={{ p: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
                {children}
            </Box>
        </Box>
    )
}
export default AppLayout
