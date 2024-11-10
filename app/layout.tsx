import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AppSidebar } from '@/components/app-sidebar'
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import { SidebarProvider } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background flex custom-scrollbar")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <div className="flex flex-1 h-screen custom-scrollbar">
              <AppSidebar />
              <main className="flex-1 custom-scrollbar">
                {children}
              </main>
            </div>
          </SidebarProvider>
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
} 