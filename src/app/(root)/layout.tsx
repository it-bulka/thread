import type { Metadata } from "next";
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { inter } from '@/assets/fonts';
import "../globals.css";
import { ClerkProviderWrapper } from '@/components/ClerkProvider';
import { Topbar, LeftSidebar, RightSidebar, BottomSidebar } from '@/components/shared';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "Thread auth",
  description: "Auth page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ClerkProviderWrapper>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} text-bg-reverse-1 bg-bg-1`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Topbar />

            <main className='flex flex-row'>
              <LeftSidebar />
              <section className='main-container'>
                <div className='w-full max-w-4xl'>{children}</div>
              </section>
              <RightSidebar />
            </main>

            <BottomSidebar />
            <Toaster theme='dark' position='top-right' richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}
