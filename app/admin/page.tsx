"use client"

import { useState } from "react"
import { BarChart3, Users, Briefcase, Plus, Settings, Eye, Edit, Trash2, Search, Filter, Shield, Activity } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"
import AdminJobForm from "@/components/admin/admin-job-form"
import AdminStats from "@/components/admin/admin-stats"
import AdminUserManagement from "@/components/admin/admin-user-management"
import PermissionGuard from "@/components/admin/permission-guard"
import { useAdmin } from "@/contexts/admin-context"

// Mock admin data
const mockJobs = [
  {
    id: "1",
    title: "Software Developer",
    company: "TechZim Solutions",
    location: "Harare",
    salaryUSD: 800,
    salaryZWL: 1200000,
    type: "Full-time",
    status: "active",
    applications: 15,
    views: 234,
    createdAt: "2024-01-15",
    source: "Manual"
  },
  {
    id: "2",
    title: "Marketing Manager",
    company: "Delta Corporation",
    location: "Bulawayo",
    salaryUSD: 1200,
    salaryZWL: 1800000,
    type: "Full-time",
    status: "active",
    applications: 8,
    views: 156,
    createdAt: "2024-01-14",
    source: "VacancyMail"
  },
  {
    id: "3",
    title: "Data Analyst",
    company: "Zimbank",
    location: "Harare",
    salaryUSD: 700,
    salaryZWL: 1050000,
    type: "Full-time",
    status: "paused",
    applications: 22,
    views: 189,
    createdAt: "2024-01-13",
    source: "JobsZW"
  },
  {
    id: "4",
    title: "Graphic Designer",
    company: "Creative Agency",
    location: "Harare",
    salaryUSD: 500,
    salaryZWL: 750000,
    type: "Contract",
    status: "expired",
    applications: 31,
    views: 298,
    createdAt: "2024-01-10",
    source: "Manual"
  }
]

export default function AdminDashboard() {
  const { currentAdmin } = useAdmin()
  const [jobs, setJobs] = useState(mockJobs)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedJob, setSelectedJob] = useState<typeof mockJobs[0] | null>(null)
  const [isJobFormOpen, setIsJobFormOpen] = useState(false)

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDeleteJob = (jobId: string) => {
    setJobs(jobs.filter(job => job.id !== jobId))
  }

  const handleEditJob = (job: typeof mockJobs[0]) => {
    setSelectedJob(job)
    setIsJobFormOpen(true)
  }

  const handleJobSave = (jobData: any) => {
    if (selectedJob) {
      // Update existing job
      setJobs(jobs.map(job => 
        job.id === selectedJob.id 
          ? { ...job, ...jobData, id: selectedJob.id }
          : job
      ))
    } else {
      // Create new job
      const newJob = {
        ...jobData,
        id: `job_${Date.now()}`,
        applications: 0,
        views: 0,
        createdAt: new Date().toISOString().split('T')[0],
        source: "Manual"
      }
      setJobs([newJob, ...jobs])
    }
    setIsJobFormOpen(false)
    setSelectedJob(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-primary">
                Zapply Admin
              </Link>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{currentAdmin?.name}</Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  {currentAdmin?.role.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/admin" className="text-foreground hover:text-primary">Dashboard</Link>
              <PermissionGuard permission="audit.view">
                <Link href="/admin/activity" className="text-muted-foreground hover:text-primary">
                  <Activity className="h-4 w-4 inline mr-1" />
                  Activity
                </Link>
              </PermissionGuard>
              <PermissionGuard permission="roles.manage">
                <Link href="/admin/roles" className="text-muted-foreground hover:text-primary">
                  <Shield className="h-4 w-4 inline mr-1" />
                  Roles
                </Link>
              </PermissionGuard>
              <Link href="/" className="text-muted-foreground hover:text-primary">View Site</Link>
            </nav>
            <Button asChild>
              <Link href="/">Exit Admin</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage jobs, users, and platform analytics</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <PermissionGuard permission="analytics.view">
              <AdminStats jobs={jobs} />
            </PermissionGuard>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <PermissionGuard permission="jobs.view">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <PermissionGuard permission="jobs.create">
                  <Dialog open={isJobFormOpen} onOpenChange={setIsJobFormOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setSelectedJob(null)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Job
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {selectedJob ? 'Edit Job' : 'Create New Job'}
                        </DialogTitle>
                      </DialogHeader>
                      <AdminJobForm
                        job={selectedJob}
                        onSave={handleJobSave}
                        onCancel={() => {
                          setIsJobFormOpen(false)
                          setSelectedJob(null)
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </PermissionGuard>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Job Listings ({filteredJobs.length})</CardTitle>
                  <CardDescription>Manage all job postings on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Salary (USD)</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Applications</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredJobs.map((job) => (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium">{job.title}</TableCell>
                            <TableCell>{job.company}</TableCell>
                            <TableCell>{job.location}</TableCell>
                            <TableCell>${job.salaryUSD}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(job.status)}>
                                {job.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{job.applications}</TableCell>
                            <TableCell>{job.views}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{job.source}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/job/${job.id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <PermissionGuard permission="jobs.edit">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditJob(job)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </PermissionGuard>
                                <PermissionGuard permission="jobs.delete">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDeleteJob(job.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </PermissionGuard>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {filteredJobs.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No jobs found matching your criteria.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </PermissionGuard>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <PermissionGuard permission="users.view">
              <AdminUserManagement />
            </PermissionGuard>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <PermissionGuard permission="settings.view">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                    <CardDescription>Configure platform-wide settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Site Name</label>
                        <Input defaultValue="Zapply" disabled={!currentAdmin || !currentAdmin.role.includes('admin')} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Contact Email</label>
                        <Input defaultValue="admin@zapply.com" disabled={!currentAdmin || !currentAdmin.role.includes('admin')} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Jobs Per Page</label>
                        <Select defaultValue="20" disabled={!currentAdmin || !currentAdmin.role.includes('admin')}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Default Currency</label>
                        <Select defaultValue="USD" disabled={!currentAdmin || !currentAdmin.role.includes('admin')}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="ZWL">ZWL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <PermissionGuard permission="settings.edit">
                      <Button>Save Settings</Button>
                    </PermissionGuard>
                  </CardContent>
                </Card>

                <PermissionGuard permission="settings.scraping">
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Scraping Settings</CardTitle>
                      <CardDescription>Configure automatic job scraping sources</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">VacancyMail</h4>
                            <p className="text-sm text-muted-foreground">Scrape jobs from VacancyMail</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">JobsZW</h4>
                            <p className="text-sm text-muted-foreground">Scrape jobs from JobsZW</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">HealthJobs</h4>
                            <p className="text-sm text-muted-foreground">Scrape healthcare jobs</p>
                          </div>
                          <Badge variant="secondary">Paused</Badge>
                        </div>
                      </div>
                      <Button>Configure Sources</Button>
                    </CardContent>
                  </Card>
                </PermissionGuard>
              </div>
            </PermissionGuard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
