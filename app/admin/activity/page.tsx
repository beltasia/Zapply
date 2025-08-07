"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ActivityDashboard from "@/components/admin/activity-dashboard"
import PermissionGuard from "@/components/admin/permission-guard"
import { useAdmin } from "@/contexts/admin-context"

export default function ActivityMonitorPage() {
  const { currentAdmin } = useAdmin()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-2xl font-bold text-primary">
                Zapply Admin
              </Link>
              <Badge variant="secondary">Activity Monitor</Badge>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/admin" className="text-muted-foreground hover:text-primary">Dashboard</Link>
              <Link href="/admin/activity" className="text-foreground hover:text-primary">Activity</Link>
              <Link href="/admin/roles" className="text-muted-foreground hover:text-primary">Roles</Link>
              <Link href="/" className="text-muted-foreground hover:text-primary">View Site</Link>
            </nav>
            <Button asChild>
              <Link href="/admin">Back to Admin</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Activity Monitor</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and analytics of admin activities across the platform
          </p>
        </div>

        <PermissionGuard permission="audit.view">
          <ActivityDashboard />
        </PermissionGuard>
      </div>
    </div>
  )
}
