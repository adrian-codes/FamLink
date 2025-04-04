import type { Metadata } from 'next';
import '../styles/globals.css';
import { AuthProvider } from './context/AuthContext';

export const metadata: Metadata = {
  title: 'FamLink - Family Management Made Simple',
  description: 'Organize your family life with FamLink. Manage chores, schedules, and events with AI-powered features.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-inter">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}