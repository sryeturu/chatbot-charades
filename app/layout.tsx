import './globals.css';
import { Cutive, Inter } from 'next/font/google';

const cutive = Cutive({
    subsets: ['latin'],
    variable: '--font-cutive',
    weight: '400',
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${cutive.variable}`}>
            <body>{children}</body>
        </html>
    );
}
