import './globals.css';
import { Cutive, Inter } from 'next/font/google';
import type { Metadata } from 'next'
import Script from 'next/script';
 
export const metadata: Metadata = {
    title: "Chatbot Charades - AI word guessing game",
    description: "Test your wordplay skills with ChatBot Charades. Give clever prompts to make the chatbot say the hidden word. Can you outsmart the AI and master the art of linguistic creativity?",
    alternates: {
        canonical: "https://chatbotcharades.com",
    },
}

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
        <Script
          src={`${process.env.NEXT_PUBLIC_UMAMI_SERVER_URL}/script.js`}
          data-website-id={`${process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}`}
          strategy="afterInteractive"
        />
            <body>{children}</body>
        </html>
    );
}
