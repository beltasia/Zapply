"use client"

import { useState, useMemo } from 'react'
import { Activity, Users, AlertTriangle, Clock, Download, Filter, Search, Wifi, WifiOff, Eye, Shield, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useActivityMonitor } from '@/hooks/use-activity-monitor'
import { ACTIVITY_ACTIONS, ActivityLog } from '@/lib/activity-types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const SEVERITY_COLORS = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const STATUS_COLORS = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
}

const CHART_COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#f97316']

export default function ActivityDashboard() {
  const { activities, liveActivities, stats, isConnected, loading, filterActivities, exportActivities, setIsConnected } = useActivityMonitor()
  
  const [filters, setFilters] = useState({
    adminId: '',
    category: '',
    severity: '',
    status: '',
    search: ''
  })
  
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const filteredActivities = useMemo(() => {
    return filterActivities(filters)
  }, [activities, filters, filterActivities])

  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredActivities.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredActivities, currentPage])

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage)

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      adminId: '',
      category: '',
      severity: '',
      status: '',
      search: ''
    })
    setCurrentPage(1)
  }

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(timestamp)
  }

  const getActionLabel = (action: string) => {
    return ACTIVITY_ACTIONS[action as keyof typeof ACTIVITY_ACTIONS]?.label || action
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Real-time Activity Monitor
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Wifi className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <WifiOff className="h-3 w-3 mr-1" />
                        Disconnected
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsConnected(!isConnected)}
                >
                  {isConnected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
              <CardDescription>Live admin activity feed</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {liveActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.severity === 'critical' ? 'bg-red-500' :
                          activity.severity === 'high' ? 'bg-orange-500' :
                          activity.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium">{activity.adminName}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.action} - {activity.resource}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={STATUS_COLORS[activity.status]} variant="outline">
                          {activity.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {liveActivities.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No recent activity</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Admins</p>
                  <p className="text-2xl font-bold">{stats?.activeAdmins || 0}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last 24h</p>
                  <p className="text-2xl font-bold">{stats?.activitiesLast24h || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Failed Actions</p>
                  <p className="text-2xl font-bold text-red-600">{stats?.failedActions || 0}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical Actions</p>
                  <p className="text-2xl font-bold text-orange-600">{stats?.criticalActions || 0}</p>
                </div>
                <Shield className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Trend (24h)</CardTitle>
            <CardDescription>Hourly activity distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats?.activityByHour || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Actions</CardTitle>
            <CardDescription>Most frequent admin actions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.topActions || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="action" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity by Category</CardTitle>
            <CardDescription>Distribution across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats?.activityByCategory || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ category, count }) => `${category}: ${count}`}
                >
                  {(stats?.activityByCategory || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Active Admins</CardTitle>
            <CardDescription>Admin activity ranking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(stats?.activityByAdmin || []).slice(0, 5).map((admin, index) => (
                <div key={admin.adminName} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{admin.adminName}</p>
                      <p className="text-xs text-muted-foreground">{admin.role.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{admin.count} actions</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                Showing {filteredActivities.length} of {activities.length} activities
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportActivities(filteredActivities)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="jobs">Jobs</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.severity} onValueChange={(value) => handleFilterChange('severity', value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>

          {/* Activity Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="text-sm">
                      {formatTimestamp(activity.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{activity.adminName}</p>
                        <p className="text-xs text-muted-foreground">{activity.adminRole.replace('_', ' ')}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{getActionLabel(activity.action)}</p>
                    </TableCell>
                    <TableCell>{activity.resource}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[activity.status]} variant="outline">
                        {activity.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={SEVERITY_COLORS[activity.severity]} variant="outline">
                        {activity.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono">{activity.ipAddress}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedActivity(activity)}>
                            <Eye className="h-4 w-4" />
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
                                  <p className="text-sm">{selectedActivity.timestamp.toLocaleString()}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Admin</label>
                                  <p className="text-sm">{selectedActivity.adminName} ({selectedActivity.adminRole})</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Action</label>
                                  <p className="text-sm">{getActionLabel(selectedActivity.action)}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Resource</label>
                                  <p className="text-sm">{selectedActivity.resource}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <Badge className={STATUS_COLORS[selectedActivity.status]} variant="outline">
                                    {selectedActivity.status}
                                  </Badge>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Severity</label>
                                  <Badge className={SEVERITY_COLORS[selectedActivity.severity]} variant="outline">
                                    {selectedActivity.severity}
                                  </Badge>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">IP Address</label>
                                  <p className="text-sm font-mono">{selectedActivity.ipAddress}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Resource ID</label>
                                  <p className="text-sm font-mono">{selectedActivity.resourceId}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Details</label>
                                <p className="text-sm bg-muted p-3 rounded">{selectedActivity.details}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">User Agent</label>
                                <p className="text-xs text-muted-foreground break-all">{selectedActivity.userAgent}</p>
                              </div>
                              {selectedActivity.metadata && (
                                <div>
                                  <label className="text-sm font-medium">Metadata</label>
                                  <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                                    {JSON.stringify(selectedActivity.metadata, null, 2)}
                                  </pre>
                                </div>
                              )}
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
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredActivities.length)} of {filteredActivities.length} activities
              </p>
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
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No activities found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
