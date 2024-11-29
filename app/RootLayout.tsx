import { roboto } from '@/app/fonts'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${roboto.variable}`}>{children}</body>
        </html>
    )
}
