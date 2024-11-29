'use client'
import { Toaster } from 'react-hot-toast'

const ToastProvider = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    return (
        <>
            <Toaster />
            {children}
        </>
    )
}
export default ToastProvider
