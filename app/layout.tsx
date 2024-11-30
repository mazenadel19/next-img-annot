import type { Metadata } from 'next'
import { roboto } from '@/app/fonts'
import MuiProvider from '@/providers/mui-provider'
import AppLayout from '@/layouts/app-layout'
import { AuthProvider } from '@/providers/context/auth-context'
import ToastProvider from '@/providers/react-hot-toast-provider'
import { TITLE, DESCRIPTION } from './constants'
import './globals.css'

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${roboto.variable}`}>
                <MuiProvider>
                    <ToastProvider>
                        <AuthProvider>
                            <AppLayout>{children}</AppLayout>
                        </AuthProvider>
                    </ToastProvider>
                </MuiProvider>
            </body>
        </html>
    )
}
