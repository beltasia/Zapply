"use client"

import { TrendingUp, Users, Briefcase, Eye, DollarSign, MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AdminStatsProps {
  jobs: any[]
}

export default function AdminStats({ jobs }: AdminStatsProps) {
  const totalJobs = jobs.length
  const activeJobs = jobs.filter(job => job.status === 'active').length
  const totalApplications = jobs.reduce((sum, job) => sum + job.applications, 0)
  const totalViews = jobs.reduce((sum, job) => sum + job.views, 0)
  const avgSalary = jobs.reduce((sum, job) => sum + job.salaryUSD, 0) / jobs.length

  // Location distribution
  const locationStats = jobs.reduce((acc, job) => {
    acc[job.location] = (acc[job.location] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Job type distribution
  const typeStats = jobs.reduce((acc, job) => {
    acc[job.type] = (acc[job.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              {activeJobs} active jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              {(totalApplications / totalJobs).toFixed(1)} avg per job
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {(totalViews / totalJobs).toFixed(0)} avg per job
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgSalary.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              USD per month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Jobs by Location</CardTitle>
            <CardDescription>Distribution of jobs across Zimbabwe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(locationStats)
              .sort(([,a], [,b]) => b - a)
              .map(([location, count]) => (
                <div key={location} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{location}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{count} jobs</span>
                  </div>
                  <Progress value={(count / totalJobs) * 100} className="h-2" />
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jobs by Type</CardTitle>
            <CardDescription>Employment type distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(typeStats)
              .sort(([,a], [,b]) => b - a)
              .map(([type, count]) => (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{type}</span>
                    <span className="text-sm text-muted-foreground">{count} jobs</span>
                  </div>
                  <Progress value={(count / totalJobs) * 100} className="h-2" />
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New job posted: Software Developer at TechZim</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">15 new applications received</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Job scraping completed: 23 new jobs added</p>
                <p className="text-xs text-muted-foreground">6 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
