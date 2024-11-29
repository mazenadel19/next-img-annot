import type { Metadata } from 'next'
import { roboto } from '@/app/fonts'
import MuiProvider from '@/providers/mui-provider'
import AppLayout from '@/layouts/app-layout'
import FirebaseProvider from '@/providers/context/firebase-context'
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
                        <AppLayout>
                            <FirebaseProvider>{children}</FirebaseProvider>
                        </AppLayout>
                    </ToastProvider>
                </MuiProvider>
            </body>
        </html>
    )
}
