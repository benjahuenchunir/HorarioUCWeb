import './globals.css'
import { Inter as FontSans } from "next/font/google";
import { Metadata } from 'next';
import { Navbar } from '@/components/nav/NavBar';
import QueryProvider from '@/components/QueryProvider';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "HorarioUC",
  description: "Arma tu horario rapidamente",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Navbar />
            {children} <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
