import type { Metadata } from "next"
import { AdminProvider } from "@/contexts/admin-context"

export const metadata: Metadata = {
  title: "Admin Dashboard - Zapply",
  description: "Administrative interface for managing Zapply job platform",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProvider>
      {children}
    </AdminProvider>
  )
}
