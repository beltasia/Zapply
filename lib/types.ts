export interface Job {
  id: string
  title: string
  company: string
  location: string
  salaryUSD: number
  salaryZWL: number
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
  posted: string
  description: string
  requirements: string[]
  source: string
  benefits?: string[]
  companyInfo?: {
    size: string
    industry: string
    founded: string
    website: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Application {
  id: string
  jobId: string
  userId: string
  status: 'pending' | 'interview' | 'accepted' | 'rejected'
  appliedDate: Date
  progress: number
  nextStep: string
  notes?: string
  coverLetter?: string
  resume?: string
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  location?: string
  skills: string[]
  experience: string
  education: string
  resume?: string
  createdAt: Date
  updatedAt: Date
}

export interface SearchFilters {
  query: string
  location: string
  jobType: string
  salaryMin?: number
  salaryMax?: number
  source?: string
}
