"use client"

import { Activity } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ActivityDashboard from "@/components/admin/activity-dashboard"
import PermissionGuard from "@/components/admin/permission-guard"

export default function ActivityMonitorPage() {
  return (
    <PermissionGuard permission="audit.view">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-white dark:bg-gray-900 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/admin" className="text-2xl font-bold text-primary">
                  Zapply Admin
                </Link>
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Activity Monitor
                </Badge>
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
            <h1 className="text-3xl font-bold mb-2">Real-Time Activity Monitor</h1>
            <p className="text-muted-foreground">
              Monitor all admin activities in real-time with comprehensive logging and analytics
            </p>
          </div>

          <ActivityDashboard />
        </div>
      </div>
    </PermissionGuard>
  )
}
