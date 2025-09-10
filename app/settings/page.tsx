import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, CreditCard, Globe } from "lucide-react"

export default function SettingsPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Header */}
              <div className="px-4 lg:px-6">
                <div className="max-w-4xl mx-auto mb-8">
                  <h1 className="text-4xl font-bold text-stone-900">Settings</h1>
                  <p className="text-lg text-stone-600 mt-2">Manage your account preferences and privacy settings</p>
                </div>
              </div>

              {/* Profile Settings */}
              <div className="px-4 lg:px-6">
                <div className="max-w-4xl mx-auto">
                  <Card className="border-2 border-stone-200 bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>Update your personal information and profile details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john@example.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" defaultValue="Acme Corp" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" defaultValue="Sales Manager" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        placeholder="Tell us about yourself and your expertise..."
                        defaultValue="Experienced sales professional with 10+ years in B2B sales and market intelligence."
                      />
                    </div>
                    <Button className="rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium px-6 py-2">Save Changes</Button>
                  </CardContent>
                </Card>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="px-4 lg:px-6">
                <div className="max-w-4xl mx-auto">
                  <Card className="border-2 border-stone-200 bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </CardTitle>
                    <CardDescription>Configure how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-stone-500">Receive notifications via email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>New Intel Matches</Label>
                        <p className="text-sm text-stone-500">Get notified when new intel matches your interests</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Demand Fulfillments</Label>
                        <p className="text-sm text-stone-500">Get notified when someone fulfills your demands</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Sales Updates</Label>
                        <p className="text-sm text-stone-500">Get notified about your intel sales and earnings</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Marketing Emails</Label>
                        <p className="text-sm text-stone-500">Receive updates about new features and tips</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="px-4 lg:px-6">
                <div className="max-w-4xl mx-auto">
                  <Card className="border-2 border-stone-200 bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Privacy & Security
                    </CardTitle>
                    <CardDescription>Manage your privacy and security preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Public Profile</Label>
                        <p className="text-sm text-stone-500">Make your profile visible to other users</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Activity</Label>
                        <p className="text-sm text-stone-500">Display your recent activity on your profile</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Allow Direct Messages</Label>
                        <p className="text-sm text-stone-500">Let other users send you direct messages</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button className="rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium px-6 py-2">Update Password</Button>
                  </CardContent>
                </Card>
                </div>
              </div>

              {/* Payment Settings */}
              <div className="px-4 lg:px-6">
                <div className="max-w-4xl mx-auto">
                  <Card className="border-2 border-stone-200 bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment & Billing
                    </CardTitle>
                    <CardDescription>Manage your payment methods and billing information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Default Payment Method</Label>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-stone-500" />
                            <div>
                              <p className="font-medium">**** **** **** 4242</p>
                              <p className="text-sm text-stone-500">Expires 12/25</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Billing Address</Label>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input placeholder="Street Address" />
                        <Input placeholder="City" />
                        <Input placeholder="State" />
                        <Input placeholder="ZIP Code" />
                      </div>
                    </div>
                    <Button className="rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium px-6 py-2">Update Payment Info</Button>
                  </CardContent>
                </Card>
                </div>
              </div>

              {/* Account Actions */}
              <div className="px-4 lg:px-6">
                <div className="max-w-4xl mx-auto">
                  <Card className="border-2 border-stone-200 bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Account Actions
                    </CardTitle>
                    <CardDescription>Manage your account and data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Export Data</p>
                        <p className="text-sm text-stone-500">Download a copy of your data</p>
                      </div>
                      <Button variant="outline" className="rounded-xl">Export</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm text-stone-500">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="destructive" className="rounded-xl">Delete</Button>
                    </div>
                  </CardContent>
                </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
