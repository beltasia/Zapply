"use client"

import { useState, useEffect } from 'react'
import { Camera, MapPin, Phone, Mail, Briefcase, GraduationCap, Award, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/auth-context'
import { updateUserProfile } from '@/lib/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const zimbabweLocations = [
  "Harare", "Bulawayo", "Chitungwiza", "Mutare", "Gweru", 
  "Kwekwe", "Kadoma", "Masvingo", "Chinhoyi", "Marondera"
]

const skillSuggestions = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C#", 
  "PHP", "SQL", "MongoDB", "PostgreSQL", "AWS", "Azure", "Docker", 
  "Marketing", "Sales", "Accounting", "Finance", "HR", "Project Management",
  "Graphic Design", "UI/UX Design", "Content Writing", "Digital Marketing"
]

export default function ProfilePage() {
  const { user, userProfile, loading: authLoading, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [newSkill, setNewSkill] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    skills: [] as string[],
    experience: '',
    education: ''
  })

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        skills: userProfile.skills || [],
        experience: userProfile.experience || '',
        education: userProfile.education || ''
      })
    }
  }, [userProfile])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    redirect('/auth/sign-in')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const success = await updateUserProfile(user.uid, formData)
    
    if (success) {
      setSuccess('Profile updated successfully!')
      await refreshProfile()
    } else {
      setError('Failed to update profile. Please try again.')
    }
    
    setLoading(false)
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
              <Link href="/profile" className="text-foreground hover:text-primary">Profile</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and job preferences</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
              <Alert>
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>Your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="e.g., +263 77 123 4567"
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                    <Select 
                      value={formData.location} 
                      onValueChange={(value) => handleInputChange('location', value)}
                      disabled={loading}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select your location" />
                      </SelectTrigger>
                      <SelectContent>
                        {zimbabweLocations.map(location => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Skills
                </CardTitle>
                <CardDescription>Add your professional skills and competencies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    disabled={loading}
                  />
                  <Button type="button" onClick={addSkill} disabled={loading}>
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skillSuggestions.slice(0, 8).map(skill => (
                    <Button
                      key={skill}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!formData.skills.includes(skill)) {
                          setFormData(prev => ({
                            ...prev,
                            skills: [...prev.skills, skill]
                          }))
                        }
                      }}
                      disabled={loading || formData.skills.includes(skill)}
                    >
                      {skill}
                    </Button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                        disabled={loading}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Experience
                </CardTitle>
                <CardDescription>Describe your professional experience</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="Describe your work experience, previous roles, achievements..."
                  rows={4}
                  disabled={loading}
                />
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
                <CardDescription>Your educational background and qualifications</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  placeholder="List your educational qualifications, degrees, certifications..."
                  rows={4}
                  disabled={loading}
                />
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/">Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
