"use client"

import { useState } from "react"
import { Search, MapPin, DollarSign, Clock, Filter, Share2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import UserMenu from "@/components/auth/user-menu"

// Mock job data with Zimbabwe-specific fields
const mockJobs = [
  {
    id: "1",
    title: "Software Developer",
    company: "TechZim Solutions",
    location: "Harare",
    salaryUSD: 800,
    salaryZWL: 1200000,
    type: "Full-time",
    posted: "2 hours ago",
    description: "Looking for a skilled software developer to join our growing team...",
    requirements: ["React", "TypeScript", "Node.js"],
    source: "VacancyMail"
  },
  {
    id: "2",
    title: "Marketing Manager",
    company: "Delta Corporation",
    location: "Bulawayo",
    salaryUSD: 1200,
    salaryZWL: 1800000,
    type: "Full-time",
    posted: "4 hours ago",
    description: "Seeking an experienced marketing manager to lead our campaigns...",
    requirements: ["Marketing", "Digital Marketing", "Analytics"],
    source: "JobsZW"
  },
  {
    id: "3",
    title: "Accountant",
    company: "Zimbank",
    location: "Harare",
    salaryUSD: 600,
    salaryZWL: 900000,
    type: "Full-time",
    posted: "1 day ago",
    description: "Join our finance team as an experienced accountant...",
    requirements: ["ACCA", "Excel", "Financial Reporting"],
    source: "VacancyMail"
  },
  {
    id: "4",
    title: "Nurse",
    company: "Parirenyatwa Hospital",
    location: "Harare",
    salaryUSD: 400,
    salaryZWL: 600000,
    type: "Full-time",
    posted: "3 days ago",
    description: "Qualified nurse needed for our medical team...",
    requirements: ["Nursing Degree", "Registration", "Experience"],
    source: "HealthJobs"
  }
]

const zimbabweLocations = [
  "All Locations",
  "Harare",
  "Bulawayo",
  "Chitungwiza",
  "Mutare",
  "Gweru",
  "Kwekwe",
  "Kadoma",
  "Masvingo",
  "Chinhoyi",
  "Marondera"
]

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedType, setSelectedType] = useState("All Types")
  const [filteredJobs, setFilteredJobs] = useState(mockJobs)

  const handleSearch = () => {
    let filtered = mockJobs
    
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    if (selectedLocation !== "All Locations") {
      filtered = filtered.filter(job => job.location === selectedLocation)
    }
    
    if (selectedType !== "All Types") {
      filtered = filtered.filter(job => job.type === selectedType)
    }
    
    setFilteredJobs(filtered)
  }

  const shareOnWhatsApp = (job: typeof mockJobs[0]) => {
    const message = `Check out this job opportunity:\n\n*${job.title}* at ${job.company}\nLocation: ${job.location}\nSalary: $${job.salaryUSD} USD / ZWL ${job.salaryZWL.toLocaleString()}\n\nFound on Zapply - Zimbabwe's Job Search Platform`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
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
              <Link href="/" className="text-foreground hover:text-primary">Jobs</Link>
              <Link href="/applications" className="text-muted-foreground hover:text-primary">My Applications</Link>
              <Link href="/profile" className="text-muted-foreground hover:text-primary">Profile</Link>
            </nav>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Find Your Dream Job in Zimbabwe
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Discover opportunities from top employers across Zimbabwe
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg p-4 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Job title, company, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-foreground"
                />
              </div>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {zimbabweLocations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} className="w-full md:w-auto">
                Search Jobs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Filter Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filter Jobs</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Job Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Types">All Types</SelectItem>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Job Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Types">All Types</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Job Listings */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {filteredJobs.length} Jobs Found
              </h2>
              <Select defaultValue="recent">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="salary-high">Highest Salary</SelectItem>
                  <SelectItem value="salary-low">Lowest Salary</SelectItem>
                  <SelectItem value="company">Company A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <Link href={`/job/${job.id}`} className="hover:text-primary">
                            <h3 className="text-lg font-semibold">{job.title}</h3>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => shareOnWhatsApp(job)}
                            className="md:hidden"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <p className="text-muted-foreground font-medium mb-2">{job.company}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${job.salaryUSD} USD / ZWL {job.salaryZWL.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.posted}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.requirements.slice(0, 3).map((req) => (
                            <Badge key={req} variant="secondary" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                          {job.requirements.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{job.requirements.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{job.type}</Badge>
                            <span className="text-xs text-muted-foreground">
                              via {job.source}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2">
                        <Button className="flex-1 md:flex-none" asChild>
                          <Link href={`/job/${job.id}`}>View Details</Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => shareOnWhatsApp(job)}
                          className="hidden md:flex"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No jobs found matching your criteria.</p>
                <Button onClick={() => {
                  setSearchTerm("")
                  setSelectedLocation("All Locations")
                  setSelectedType("All Types")
                  setFilteredJobs(mockJobs)
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  )
}
