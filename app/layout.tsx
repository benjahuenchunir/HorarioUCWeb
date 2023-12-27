import './globals.css'
import { Inter as FontSans } from "next/font/google";
import { Metadata } from 'next';
import { Navbar } from '@/components/nav/NavBar';
import QueryProvider from '@/components/QueryProvider';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/ThemeProvider';

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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Navbar />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
