"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PERMISSIONS, getPermissionsByCategory } from '@/lib/roles'

interface RoleFormProps {
  role?: any
  onSave: (roleData: any) => void
  onCancel: () => void
}

export default function RoleForm({ role, onSave, onCancel }: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
    permissions: role?.permissions || [],
    color: role?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  })

  const permissionsByCategory = getPermissionsByCategory(PERMISSIONS)

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(id => id !== permissionId)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

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
        <div>
          <Label htmlFor="name">Role Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="color">Badge Color</Label>
          <select
            id="color"
            value={formData.color}
            onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
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

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div>
        <Label className="text-base font-semibold">Permissions</Label>
        <div className="mt-4 space-y-6">
          {Object.entries(permissionsByCategory).map(([category, permissions]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{category}</CardTitle>
                <CardDescription className="text-xs">
                  {permissions.length} permissions available
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {role ? 'Update Role' : 'Create Role'}
        </Button>
      </div>
    </form>
  )
}
