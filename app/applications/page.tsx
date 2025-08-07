"use client"

import { useState } from "react"
import { Calendar, MapPin, DollarSign, Clock, Eye, MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import UserMenu from "@/components/auth/user-menu"

// Mock application data
const applications = [
  {
    id: "1",
    jobTitle: "Software Developer",
    company: "TechZim Solutions",
    location: "Harare",
    salaryUSD: 800,
    appliedDate: "2024-01-15",
    status: "interview",
    progress: 75,
    nextStep: "Technical Interview scheduled for Jan 20",
    notes: "Great conversation with HR. Technical round next."
  },
  {
    id: "2",
    jobTitle: "Marketing Manager",
    company: "Delta Corporation",
    location: "Bulawayo",
    salaryUSD: 1200,
    appliedDate: "2024-01-10",
    status: "pending",
    progress: 25,
    nextStep: "Application under review",
    notes: "Applied through company website"
  },
  {
    id: "3",
    jobTitle: "Data Analyst",
    company: "Zimbank",
    location: "Harare",
    salaryUSD: 700,
    appliedDate: "2024-01-05",
    status: "rejected",
    progress: 100,
    nextStep: "Application closed",
    notes: "Position filled by internal candidate"
  },
  {
    id: "4",
    jobTitle: "UI/UX Designer",
    company: "Creative Agency",
    location: "Harare",
    salaryUSD: 600,
    appliedDate: "2024-01-12",
    status: "accepted",
    progress: 100,
    nextStep: "Start date: February 1, 2024",
    notes: "Offer accepted! Contract signed."
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "accepted":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "rejected":
      return <XCircle className="h-4 w-4 text-red-500" />
    case "interview":
      return <AlertCircle className="h-4 w-4 text-blue-500" />
    default:
      return <Clock className="h-4 w-4 text-yellow-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "accepted":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "interview":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    default:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
  }
}

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredApplications = applications.filter(app => {
    if (activeTab === "all") return true
    return app.status === activeTab
  })

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === "pending").length,
    interview: applications.filter(app => app.status === "interview").length,
    accepted: applications.filter(app => app.status === "accepted").length,
    rejected: applications.filter(app => app.status === "rejected").length
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              Zapply
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-muted-foreground hover:text-primary">Jobs</Link>
              <Link href="/applications" className="text-foreground hover:text-primary">My Applications</Link>
              <Link href="/profile" className="text-muted-foreground hover:text-primary">Profile</Link>
            </nav>
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Applications</h1>
          <p className="text-muted-foreground">Track your job applications and their progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.interview}</div>
              <div className="text-sm text-muted-foreground">Interview</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
              <div className="text-sm text-muted-foreground">Accepted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="interview">Interview</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold">{application.jobTitle}</h3>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(application.status)}
                            <Badge className={getStatusColor(application.status)}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground font-medium mb-2">{application.company}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {application.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${application.salaryUSD} USD
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Applied: {new Date(application.appliedDate).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Application Progress</span>
                            <span className="text-sm text-muted-foreground">{application.progress}%</span>
                          </div>
                          <Progress value={application.progress} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">Next Step:</span>
                            <span className="text-sm text-muted-foreground">{application.nextStep}</span>
                          </div>
                          
                          {application.notes && (
                            <div className="flex items-start gap-2">
                              <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="text-sm text-muted-foreground">{application.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2">
                        <Button variant="outline" size="sm" className="flex-1 md:flex-none" asChild>
                          <Link href={`/job/${application.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Job
                          </Link>
                        </Button>
                        {application.status === "interview" && (
                          <Button size="sm" className="flex-1 md:flex-none">
                            Schedule Interview
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No applications found for this category.
                </p>
                <Button asChild>
                  <Link href="/">Browse Jobs</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
