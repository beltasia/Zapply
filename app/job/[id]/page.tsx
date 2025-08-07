"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, DollarSign, Clock, Share2, Bookmark, Building, Users, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useParams } from "next/navigation"
import UserMenu from "@/components/auth/user-menu"

// Mock job data
const jobDetails = {
  id: "1",
  title: "Software Developer",
  company: "TechZim Solutions",
  location: "Harare",
  salaryUSD: 800,
  salaryZWL: 1200000,
  type: "Full-time",
  posted: "2 hours ago",
  description: `We are looking for a skilled Software Developer to join our growing team at TechZim Solutions. The ideal candidate will have experience in modern web technologies and a passion for creating innovative solutions.

Key Responsibilities:
• Develop and maintain web applications using React and TypeScript
• Collaborate with cross-functional teams to define and implement new features
• Write clean, maintainable, and efficient code
• Participate in code reviews and contribute to technical discussions
• Stay up-to-date with emerging technologies and industry trends

What We Offer:
• Competitive salary in USD and ZWL
• Flexible working arrangements
• Professional development opportunities
• Health insurance coverage
• Annual leave and public holidays`,
  requirements: ["React", "TypeScript", "Node.js", "MongoDB", "Git", "Agile"],
  source: "VacancyMail",
  companyInfo: {
    size: "50-100 employees",
    industry: "Technology",
    founded: "2018",
    website: "www.techzim.co.zw"
  },
  benefits: [
    "Health Insurance",
    "Flexible Hours",
    "Remote Work Options",
    "Professional Development",
    "Annual Bonus"
  ]
}

export default function JobDetailPage() {
  const params = useParams()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)

  const shareOnWhatsApp = () => {
    const message = `Check out this job opportunity:\n\n*${jobDetails.title}* at ${jobDetails.company}\nLocation: ${jobDetails.location}\nSalary: $${jobDetails.salaryUSD} USD / ZWL ${jobDetails.salaryZWL.toLocaleString()}\n\nFound on Zapply - Zimbabwe's Job Search Platform`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleApply = () => {
    setApplicationSubmitted(true)
    // Here you would typically send the application to your backend
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
              <Link href="/applications" className="text-muted-foreground hover:text-primary">My Applications</Link>
              <Link href="/profile" className="text-muted-foreground hover:text-primary">Profile</Link>
            </nav>
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{jobDetails.title}</h1>
                    <p className="text-lg text-muted-foreground font-medium mb-4">{jobDetails.company}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {jobDetails.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ${jobDetails.salaryUSD} USD / ZWL {jobDetails.salaryZWL.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {jobDetails.posted}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge>{jobDetails.type}</Badge>
                      <Badge variant="outline">via {jobDetails.source}</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                    >
                      <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={shareOnWhatsApp}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {jobDetails.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {jobDetails.requirements.map((req) => (
                    <Badge key={req} variant="secondary">
                      {req}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {jobDetails.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Button */}
            <Card>
              <CardContent className="p-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full mb-4" disabled={applicationSubmitted}>
                      {applicationSubmitted ? "Application Submitted" : "Apply Now"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Apply for {jobDetails.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Enter your full name" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter your email" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="Enter your phone number" />
                      </div>
                      <div>
                        <Label htmlFor="cover-letter">Cover Letter</Label>
                        <Textarea 
                          id="cover-letter" 
                          placeholder="Tell us why you're interested in this position..."
                          rows={4}
                        />
                      </div>
                      <Button onClick={handleApply} className="w-full">
                        Submit Application
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="w-full" onClick={shareOnWhatsApp}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share on WhatsApp
                </Button>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Company Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Company Size</span>
                  <span className="text-sm font-medium">{jobDetails.companyInfo.size}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Industry</span>
                  <span className="text-sm font-medium">{jobDetails.companyInfo.industry}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Founded</span>
                  <span className="text-sm font-medium">{jobDetails.companyInfo.founded}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Website</span>
                  <a href={`https://${jobDetails.companyInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
                    {jobDetails.companyInfo.website}
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Similar Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-1">Frontend Developer</h4>
                    <p className="text-xs text-muted-foreground mb-2">WebDev Zimbabwe</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Harare</span>
                      <span className="text-xs font-medium">$700 USD</span>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-1">Full Stack Developer</h4>
                    <p className="text-xs text-muted-foreground mb-2">Digital Solutions</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Bulawayo</span>
                      <span className="text-xs font-medium">$900 USD</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View More Similar Jobs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
