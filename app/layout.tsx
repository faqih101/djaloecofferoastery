'use client';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Djaloe Coffee Roastery</title>
        <meta name="description" content="Specialty Coffee Roastery · Bintaro, Indonesia. Single origin terbaik dari penjuru Nusantara." />
      </head>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
