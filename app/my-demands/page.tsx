import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, DollarSign, Calendar, Users, Plus } from "lucide-react"
import Link from "next/link"

// Mock data for user's demands
const mockDemands = [
  {
    id: "1",
    title: "Companies looking for CRM solutions in fintech",
    description: "Looking for fintech companies in UAE that are actively evaluating CRM platforms for Q1 2025.",
    category: "Technology",
    bountyCredits: 150,
    status: "OPEN",
    deadline: 5,
    createdAt: "2 days ago",
    fulfillments: 3,
  },
  {
    id: "2",
    title: "B2B SaaS companies hiring VP Sales in Europe",
    description: "Need intel on European B2B SaaS companies with confirmed VP Sales openings and hiring timelines.",
    category: "Hiring",
    bountyCredits: 200,
    status: "FULFILLED",
    deadline: 0,
    createdAt: "1 week ago",
    fulfillments: 1,
  },
  {
    id: "3",
    title: "Healthcare tech partnerships and integrations",
    description: "Looking for healthcare technology companies seeking integration partners in 2025.",
    category: "Healthcare",
    bountyCredits: 175,
    status: "OPEN",
    deadline: 3,
    createdAt: "3 days ago",
    fulfillments: 0,
  }
]

export default function MyDemandsPage() {
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
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-stone-900">My Demands</h1>
                    <p className="text-stone-600 mt-1">Manage your intel requests and track fulfillments</p>
                  </div>
                  <Button asChild>
                    <Link href="/post-demand">
                      <Plus className="h-4 w-4 mr-2" />
                      New Demand
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="px-4 lg:px-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-stone-600">Total Demands</CardTitle>
                      <Target className="h-4 w-4 text-stone-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-stone-900">{mockDemands.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-stone-600">Open Demands</CardTitle>
                      <Target className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {mockDemands.filter(d => d.status === 'OPEN').length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-stone-600">Fulfilled</CardTitle>
                      <Users className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {mockDemands.filter(d => d.status === 'FULFILLED').length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-stone-600">Total Spent</CardTitle>
                      <DollarSign className="h-4 w-4 text-stone-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-stone-900">
                        {mockDemands.reduce((sum, d) => sum + d.bountyCredits, 0)} credits
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Demands List */}
              <div className="px-4 lg:px-6">
                <div className="space-y-6">
                  {mockDemands.map((demand) => (
                    <Card key={demand.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{demand.title}</CardTitle>
                            <CardDescription className="text-base">
                              {demand.description}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant={demand.status === 'OPEN' ? 'default' : 'secondary'}>
                              {demand.status}
                            </Badge>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-stone-900">{demand.bountyCredits}</p>
                              <p className="text-sm text-stone-500">credits</p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 text-sm text-stone-600">
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              <span>{demand.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{demand.deadline > 0 ? `${demand.deadline} days left` : 'Expired'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{demand.fulfillments} fulfillments</span>
                            </div>
                            <span>Created {demand.createdAt}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/demand/${demand.id}`}>View Details</Link>
                            </Button>
                            {demand.status === 'OPEN' && (
                              <Button size="sm" asChild>
                                <Link href={`/demand/${demand.id}/fulfillments`}>View Fulfillments</Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
