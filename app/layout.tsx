import './globals.css'
import { Inter } from "next/font/google";
import { Metadata } from 'next';
import { Navbar } from '@/components/nav/NavBar';
import QueryProvider from '@/components/QueryProvider';

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
			<body className={inter.className}>
      <QueryProvider>
        <main>
          <Navbar/>
          {children}
        </main>
        </QueryProvider>
      </body>
    </html>
  )
}
