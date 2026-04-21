import type { Metadata } from "next";
import "./globals.css";
import DashboardLayout from "@/components/DashboardLayout";

export const metadata: Metadata = {
  title: "SMART HR - Intelligent Management",
  description: "Next-generation Human Resources Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
