"use client"

import { useState } from "react"
import { Shield, Users, Plus, Edit, Trash2, Eye, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ROLES, ADMIN_USERS, PERMISSIONS, getPermissionsByCategory } from "@/lib/roles"
import { useAdmin } from "@/contexts/admin-context"
import PermissionGuard from "@/components/admin/permission-guard"
import RoleForm from "@/components/admin/role-form"
import AdminUserForm from "@/components/admin/admin-user-form"

export default function RolesManagementPage() {
  const { currentAdmin } = useAdmin()
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null)
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false)
  const [isAdminFormOpen, setIsAdminFormOpen] = useState(false)
  const [roles, setRoles] = useState(ROLES)
  const [adminUsers, setAdminUsers] = useState(ADMIN_USERS)

  const handleRoleSave = (roleData: any) => {
    if (selectedRole) {
      setRoles(roles.map(role => 
        role.id === selectedRole.id ? { ...role, ...roleData } : role
      ))
    } else {
      const newRole = {
        ...roleData,
        id: `role_${Date.now()}`,
      }
      setRoles([...roles, newRole])
    }
    setIsRoleFormOpen(false)
    setSelectedRole(null)
  }

  const handleAdminSave = (adminData: any) => {
    if (selectedAdmin) {
      setAdminUsers(adminUsers.map(admin => 
        admin.id === selectedAdmin.id ? { ...admin, ...adminData } : admin
      ))
    } else {
      const newAdmin = {
        ...adminData,
        id: `admin_${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
      setAdminUsers([...adminUsers, newAdmin])
    }
    setIsAdminFormOpen(false)
    setSelectedAdmin(null)
  }

  const getRoleStats = (roleId: string) => {
    return adminUsers.filter(admin => admin.role === roleId).length
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-2xl font-bold text-primary">
                Zapply Admin
              </Link>
              <Badge variant="secondary">Role Management</Badge>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/admin" className="text-muted-foreground hover:text-primary">Dashboard</Link>
              <PermissionGuard permission="audit.view">
                <Link href="/admin/activity" className="text-muted-foreground hover:text-primary">Activity</Link>
              </PermissionGuard>
              <Link href="/admin/roles" className="text-foreground hover:text-primary">Roles</Link>
              <Link href="/" className="text-muted-foreground hover:text-primary">View Site</Link>
            </nav>
            <Button asChild>
              <Link href="/admin">Back to Admin</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Role & Permission Management</h1>
          <p className="text-muted-foreground">Manage admin roles, permissions, and user assignments</p>
        </div>

        <Tabs defaultValue="roles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Admin Users
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Permissions
            </TabsTrigger>
          </TabsList>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Admin Roles ({roles.length})</h2>
              <PermissionGuard permission="roles.manage">
                <Dialog open={isRoleFormOpen} onOpenChange={setIsRoleFormOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedRole(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedRole ? 'Edit Role' : 'Create New Role'}
                      </DialogTitle>
                    </DialogHeader>
                    <RoleForm
                      role={selectedRole}
                      onSave={handleRoleSave}
                      onCancel={() => {
                        setIsRoleFormOpen(false)
                        setSelectedRole(null)
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </PermissionGuard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <Card key={role.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                      <Badge className={role.color}>
                        {getRoleStats(role.id)} users
                      </Badge>
                    </div>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Permissions ({role.permissions.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map(permissionId => {
                            const permission = PERMISSIONS.find(p => p.id === permissionId)
                            return permission ? (
                              <Badge key={permissionId} variant="outline" className="text-xs">
                                {permission.name}
                              </Badge>
                            ) : null
                          })}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{role.name} Permissions</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {Object.entries(getPermissionsByCategory(
                                PERMISSIONS.filter(p => role.permissions.includes(p.id))
                              )).map(([category, permissions]) => (
                                <div key={category}>
                                  <h4 className="font-medium mb-2">{category}</h4>
                                  <div className="grid grid-cols-1 gap-2">
                                    {permissions.map(permission => (
                                      <div key={permission.id} className="flex items-center gap-2 p-2 border rounded">
                                        <Shield className="h-4 w-4 text-green-500" />
                                        <div>
                                          <p className="text-sm font-medium">{permission.name}</p>
                                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>

                        <PermissionGuard permission="roles.manage">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedRole(role)
                              setIsRoleFormOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </PermissionGuard>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Admin Users Tab */}
          <TabsContent value="admins" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Admin Users ({adminUsers.length})</h2>
              <PermissionGuard permission="admins.create">
                <Dialog open={isAdminFormOpen} onOpenChange={setIsAdminFormOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedAdmin(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedAdmin ? 'Edit Admin User' : 'Create Admin User'}
                      </DialogTitle>
                    </DialogHeader>
                    <AdminUserForm
                      admin={selectedAdmin}
                      roles={roles}
                      onSave={handleAdminSave}
                      onCancel={() => {
                        setIsAdminFormOpen(false)
                        setSelectedAdmin(null)
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </PermissionGuard>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admin User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminUsers.map((admin) => {
                      const role = roles.find(r => r.id === admin.role)
                      return (
                        <TableRow key={admin.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{admin.name}</div>
                              <div className="text-sm text-muted-foreground">{admin.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {role && (
                              <Badge className={role.color}>
                                {role.name}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={admin.status === 'active' ? 'default' : 'secondary'}>
                              {admin.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(admin.lastLogin).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <PermissionGuard permission="admins.edit">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAdmin(admin)
                                    setIsAdminFormOpen(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </PermissionGuard>
                              <PermissionGuard permission="admins.delete">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  disabled={admin.id === currentAdmin?.id}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </PermissionGuard>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">System Permissions</h2>
              <p className="text-muted-foreground">All available permissions in the system</p>
            </div>

            <div className="space-y-6">
              {Object.entries(getPermissionsByCategory(PERMISSIONS)).map(([category, permissions]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category}</CardTitle>
                    <CardDescription>{permissions.length} permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {permissions.map(permission => (
                        <div key={permission.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <Shield className="h-5 w-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium">{permission.name}</h4>
                            <p className="text-sm text-muted-foreground">{permission.description}</p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {permission.id}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
