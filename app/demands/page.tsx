import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Target, DollarSign, Calendar, Users, Plus, Search, Filter } from "lucide-react"
import Link from "next/link"

// Mock data for demands board
const mockDemands = [
  {
    id: "1",
    title: "Companies evaluating cybersecurity vendors",
    description: "Looking for companies in the financial services sector that are actively evaluating cybersecurity solutions.",
    category: "Technology",
    bountyCredits: 300,
    buyer: "CyberSales_Pro",
    deadline: 7,
    createdAt: "1 hour ago",
    fulfillments: 2,
  },
  {
    id: "2",
    title: "E-commerce platforms seeking payment solutions",
    description: "Need intel on e-commerce companies in Southeast Asia looking to integrate new payment gateways.",
    category: "E-commerce",
    bountyCredits: 250,
    buyer: "PayTechSolutions",
    deadline: 5,
    createdAt: "3 hours ago",
    fulfillments: 1,
  },
  {
    id: "3",
    title: "Manufacturing companies adopting IoT solutions",
    description: "Looking for manufacturing companies in Europe that are planning to implement IoT solutions in 2025.",
    category: "Manufacturing",
    bountyCredits: 400,
    buyer: "IoTInsights",
    deadline: 10,
    createdAt: "6 hours ago",
    fulfillments: 0,
  },
  {
    id: "4",
    title: "Healthcare providers seeking telemedicine platforms",
    description: "Need intel on healthcare providers in North America evaluating telemedicine platform solutions.",
    category: "Healthcare",
    bountyCredits: 350,
    buyer: "HealthTechIntel",
    deadline: 8,
    createdAt: "1 day ago",
    fulfillments: 3,
  }
]

export default function DemandsPage() {
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
                    <h1 className="text-3xl font-bold text-stone-900">Demands Board</h1>
                    <p className="text-stone-600 mt-1">Browse active demands and fulfill them to earn money</p>
                  </div>
                  <Button asChild>
                    <Link href="/post-demand">
                      <Plus className="h-4 w-4 mr-2" />
                      Post Demand
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="px-4 lg:px-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-4 w-4" />
                          <Input 
                            placeholder="Search demands by title, category, or description..." 
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stats */}
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
                      <CardTitle className="text-sm font-medium text-stone-600">Total Bounty</CardTitle>
                      <DollarSign className="h-4 w-4 text-stone-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-stone-900">
                        ${mockDemands.reduce((sum, d) => sum + d.bountyCredits, 0)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-stone-600">Avg Bounty</CardTitle>
                      <DollarSign className="h-4 w-4 text-stone-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-stone-900">
                        ${Math.round(mockDemands.reduce((sum, d) => sum + d.bountyCredits, 0) / mockDemands.length)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-stone-600">Active Buyers</CardTitle>
                      <Users className="h-4 w-4 text-stone-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-stone-900">
                        {new Set(mockDemands.map(d => d.buyer)).size}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Demands List */}
              <div className="px-4 lg:px-6">
                <div className="space-y-6">
                  {mockDemands.map((demand) => (
                    <Card key={demand.id} className="hover:shadow-lg transition-shadow border-blue-100">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{demand.title}</CardTitle>
                            <CardDescription className="text-base mb-3">
                              {demand.description}
                            </CardDescription>
                            <div className="flex items-center gap-4 text-sm text-stone-500">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>{demand.buyer}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                <span>{demand.category}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{demand.deadline} days left</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>{demand.fulfillments} fulfillments</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-6">
                            <div className="mb-2">
                              <p className="text-3xl font-bold text-blue-600">${demand.bountyCredits}</p>
                              <p className="text-sm text-stone-500">bounty</p>
                            </div>
                            <Badge variant="default">Active</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-stone-500">Posted {demand.createdAt}</p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/demand/${demand.id}`}>View Details</Link>
                            </Button>
                            <Button size="sm" asChild>
                              <Link href={`/demand/${demand.id}/fulfill`}>Fulfill Demand</Link>
                            </Button>
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