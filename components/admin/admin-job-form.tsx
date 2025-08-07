"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from 'lucide-react'

const zimbabweLocations = [
  "Harare", "Bulawayo", "Chitungwiza", "Mutare", "Gweru", 
  "Kwekwe", "Kadoma", "Masvingo", "Chinhoyi", "Marondera"
]

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"]

const skillSuggestions = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C#", 
  "PHP", "SQL", "MongoDB", "PostgreSQL", "AWS", "Azure", "Docker", 
  "Marketing", "Sales", "Accounting", "Finance", "HR", "Project Management",
  "Graphic Design", "UI/UX Design", "Content Writing", "Digital Marketing"
]

interface AdminJobFormProps {
  job?: any
  onSave: (jobData: any) => void
  onCancel: () => void
}

export default function AdminJobForm({ job, onSave, onCancel }: AdminJobFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salaryUSD: '',
    salaryZWL: '',
    type: '',
    status: 'active',
    description: '',
    requirements: [] as string[],
    benefits: [] as string[]
  })

  const [newRequirement, setNewRequirement] = useState('')
  const [newBenefit, setNewBenefit] = useState('')

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        salaryUSD: job.salaryUSD?.toString() || '',
        salaryZWL: job.salaryZWL?.toString() || '',
        type: job.type || '',
        status: job.status || 'active',
        description: job.description || '',
        requirements: job.requirements || [],
        benefits: job.benefits || []
      })
    }
  }, [job])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }))
      setNewRequirement('')
    }
  }

  const removeRequirement = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req !== requirement)
    }))
  }

  const addBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }))
      setNewBenefit('')
    }
  }

  const removeBenefit = (benefit: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(ben => ben !== benefit)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const jobData = {
      ...formData,
      salaryUSD: parseInt(formData.salaryUSD) || 0,
      salaryZWL: parseInt(formData.salaryZWL) || 0
    }
    
    onSave(jobData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Software Developer"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            placeholder="e.g., TechZim Solutions"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
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

        <div className="space-y-2">
          <Label htmlFor="type">Job Type *</Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              {jobTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salaryUSD">Salary (USD) *</Label>
          <Input
            id="salaryUSD"
            type="number"
            value={formData.salaryUSD}
            onChange={(e) => handleInputChange('salaryUSD', e.target.value)}
            placeholder="800"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salaryZWL">Salary (ZWL)</Label>
          <Input
            id="salaryZWL"
            type="number"
            value={formData.salaryZWL}
            onChange={(e) => handleInputChange('salaryZWL', e.target.value)}
            placeholder="1200000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Job Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe the job role, responsibilities, and requirements..."
          rows={6}
          required
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label>Requirements</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              placeholder="Add a requirement..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
            />
            <Button type="button" onClick={addRequirement}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {skillSuggestions.slice(0, 8).map(skill => (
              <Button
                key={skill}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!formData.requirements.includes(skill)) {
                    setFormData(prev => ({
                      ...prev,
                      requirements: [...prev.requirements, skill]
                    }))
                  }
                }}
                disabled={formData.requirements.includes(skill)}
              >
                {skill}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.requirements.map(requirement => (
              <Badge key={requirement} variant="secondary" className="px-3 py-1">
                {requirement}
                <button
                  type="button"
                  onClick={() => removeRequirement(requirement)}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label>Benefits</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              placeholder="Add a benefit..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
            />
            <Button type="button" onClick={addBenefit}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.benefits.map(benefit => (
              <Badge key={benefit} variant="secondary" className="px-3 py-1">
                {benefit}
                <button
                  type="button"
                  onClick={() => removeBenefit(benefit)}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1">
          {job ? 'Update Job' : 'Create Job'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  )
}
