import type { Metadata } from "next";
import "./globals.css";
import DashboardLayout from "@/components/DashboardLayout";

export const metadata: Metadata = {
  title: "Annassim 2 — Gestion RH",
  description: "Plateforme interne de gestion des ressources humaines - Lotissement Annassim 2",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { NotificationProvider } from "@/components/NotificationProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NotificationProvider>
            <DashboardLayout>{children}</DashboardLayout>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
