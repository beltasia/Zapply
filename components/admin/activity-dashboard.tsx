"use client"

import { useState } from "react"
import { Search, Filter, Download, Wifi, WifiOff, Activity, Clock, AlertTriangle, Users, TrendingUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useActivityMonitor } from "@/hooks/use-activity-monitor"
import { AdminActivity, ACTIVITY_CATEGORIES, SEVERITY_COLORS, STATUS_COLORS } from "@/lib/activity-types"

interface ActivityDashboardProps {
  className?: string
}

export default function ActivityDashboard({ className }: ActivityDashboardProps) {
  const { activities, stats, isConnected, exportToCsv } = useActivityMonitor()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedActivity, setSelectedActivity] = useState<AdminActivity | null>(null)

  const itemsPerPage = 20

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = searchTerm === "" || 
      activity.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.resource?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || activity.category === categoryFilter
    const matchesSeverity = severityFilter === "all" || activity.severity === severityFilter
    const matchesStatus = statusFilter === "all" || activity.status === statusFilter

    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus
  })

  // Paginate activities
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage)
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className={className}>
      {/* Connection Status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isConnected 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {isConnected ? 'Live Monitoring' : 'Disconnected'}
          </div>
          <span className="text-sm text-muted-foreground">
            {filteredActivities.length} activities
          </span>
        </div>
        <Button onClick={() => exportToCsv(filteredActivities)} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.activeAdmins}</div>
              <div className="text-sm text-muted-foreground">Active Admins</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Activity className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.recentActivity}</div>
              <div className="text-sm text-muted-foreground">Recent Activity</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.failedActions}</div>
              <div className="text-sm text-muted-foreground">Failed Actions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{stats.criticalActions}</div>
              <div className="text-sm text-muted-foreground">Critical Actions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{stats.totalActivities}</div>
              <div className="text-sm text-muted-foreground">Total Activities</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Activity Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(ACTIVITY_CATEGORIES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("")
                setCategoryFilter("all")
                setSeverityFilter("all")
                setStatusFilter("all")
                setCurrentPage(1)
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Real-time admin activity monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedActivities.map((activity) => (
                  <TableRow key={activity.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="text-sm">
                      {formatTimestamp(activity.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{activity.adminName}</div>
                        <div className="text-xs text-muted-foreground">{activity.adminEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {activity.action}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {ACTIVITY_CATEGORIES[activity.category]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {activity.resource || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${STATUS_COLORS[activity.status]}`}>
                        {activity.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${SEVERITY_COLORS[activity.severity]}`}>
                        {activity.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {activity.ipAddress}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm">
                        {activity.details}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs mt-1 h-6 px-2"
                            onClick={() => setSelectedActivity(activity)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Activity Details</DialogTitle>
                          </DialogHeader>
                          {selectedActivity && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Timestamp</label>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(selectedActivity.timestamp).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Duration</label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedActivity.duration}ms
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Admin</label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedActivity.adminName} ({selectedActivity.adminEmail})
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">IP Address</label>
                                  <p className="text-sm text-muted-foreground font-mono">
                                    {selectedActivity.ipAddress}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Details</label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {selectedActivity.details}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Metadata</label>
                                <ScrollArea className="h-32 w-full border rounded p-3 mt-1">
                                  <pre className="text-xs">
                                    {JSON.stringify(selectedActivity.metadata, null, 2)}
                                  </pre>
                                </ScrollArea>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredActivities.length)} of {filteredActivities.length} activities
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {filteredActivities.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No activities found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
