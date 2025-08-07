"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PERMISSIONS, getPermissionsByCategory } from "@/lib/roles"

interface RoleFormProps {
  role?: any
  onSave: (roleData: any) => void
  onCancel: () => void
}

export default function RoleForm({ role, onSave, onCancel }: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    permissions: [] as string[]
  })

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || '',
        description: role.description || '',
        color: role.color || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        permissions: role.permissions || []
      })
    }
  }, [role])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }))
  }

  const handleCategoryToggle = (categoryPermissions: string[], allSelected: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter(p => !categoryPermissions.includes(p))
        : [...new Set([...prev.permissions, ...categoryPermissions])]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const permissionsByCategory = getPermissionsByCategory(PERMISSIONS)

  const colorOptions = [
    { value: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Red' },
    { value: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Blue' },
    { value: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Green' },
    { value: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Yellow' },
    { value: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', label: 'Purple' },
    { value: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', label: 'Gray' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Role Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Content Manager"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Badge Color</Label>
          <select
            id="color"
            value={formData.color}
            onChange={(e) => handleInputChange('color', e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background rounded-md"
          >
            {colorOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe the role and its responsibilities..."
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Permissions</Label>
          <p className="text-sm text-muted-foreground">Select the permissions for this role</p>
        </div>

        <div className="space-y-4">
          {Object.entries(permissionsByCategory).map(([category, permissions]) => {
            const categoryPermissionIds = permissions.map(p => p.id)
            const selectedInCategory = categoryPermissionIds.filter(id => formData.permissions.includes(id))
            const allSelected = selectedInCategory.length === categoryPermissionIds.length
            const someSelected = selectedInCategory.length > 0

            return (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{category}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={allSelected}
                        onCheckedChange={() => handleCategoryToggle(categoryPermissionIds, allSelected)}
                        className={someSelected && !allSelected ? "data-[state=checked]:bg-primary/50" : ""}
                      />
                      <Label htmlFor={`category-${category}`} className="text-xs">
                        {allSelected ? 'Deselect All' : 'Select All'}
                      </Label>
                    </div>
                  </div>
                  <CardDescription>
                    {selectedInCategory.length} of {permissions.length} permissions selected
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 gap-3">
                    {permissions.map(permission => (
                      <div key={permission.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.id, checked as boolean)
                          }
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor={permission.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permission.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1">
          {role ? 'Update Role' : 'Create Role'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  )
}
