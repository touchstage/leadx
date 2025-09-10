import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, Target, FileText, Users, Star, Eye } from "lucide-react"

// Mock analytics data
const analyticsData = {
  overview: {
    totalRevenue: 3400,
    totalSales: 20,
    avgRating: 4.8,
    totalViews: 127,
    revenueChange: 12.5,
    salesChange: 8.2,
    ratingChange: 0.3,
    viewsChange: 15.7,
  },
  topPerforming: [
    {
      id: "1",
      title: "Fintech companies in UAE looking for CRM solutions",
      sales: 12,
      revenue: 1800,
      views: 45,
      rating: 4.8,
    },
    {
      id: "2", 
      title: "B2B SaaS companies hiring VP Sales in Europe",
      sales: 8,
      revenue: 1600,
      views: 32,
      rating: 4.9,
    }
  ],
  recentActivity: [
    { type: "sale", title: "Fintech companies in UAE", amount: 150, time: "2 hours ago" },
    { type: "view", title: "B2B SaaS companies hiring", amount: 0, time: "4 hours ago" },
    { type: "sale", title: "Healthcare tech partnerships", amount: 175, time: "1 day ago" },
    { type: "rating", title: "Fintech companies in UAE", amount: 5, time: "2 days ago" },
  ]
}

export default function AnalyticsPage() {
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
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-stone-900">Analytics</h1>
                  <p className="text-stone-600 mt-1">Track your performance and earnings on LeadX</p>
                </div>
              </div>

              {/* Overview Stats */}
              <div className="px-4 lg:px-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-stone-600">Total Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-stone-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-stone-900">{analyticsData.overview.totalRevenue}</div>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{analyticsData.overview.revenueChange}% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-stone-600">Total Sales</CardTitle>
                      <Target className="h-4 w-4 text-stone-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-stone-900">{analyticsData.overview.totalSales}</div>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{analyticsData.overview.salesChange}% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-stone-600">Average Rating</CardTitle>
                      <Star className="h-4 w-4 text-stone-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-stone-900">{analyticsData.overview.avgRating}</div>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{analyticsData.overview.ratingChange} from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-stone-600">Total Views</CardTitle>
                      <Eye className="h-4 w-4 text-stone-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-stone-900">{analyticsData.overview.totalViews}</div>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{analyticsData.overview.viewsChange}% from last month
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Chart */}
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue & Sales Trend</CardTitle>
                    <CardDescription>Your performance over the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartAreaInteractive />
                  </CardContent>
                </Card>
              </div>

              {/* Top Performing Intel */}
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Intel</CardTitle>
                    <CardDescription>Your best-selling intel listings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.topPerforming.map((intel, index) => (
                        <div key={intel.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-stone-100 rounded-full text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-stone-900">{intel.title}</p>
                              <div className="flex items-center gap-4 text-sm text-stone-500 mt-1">
                                <span>{intel.sales} sales</span>
                                <span>{intel.views} views</span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span>{intel.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-stone-900">${intel.revenue}</p>
                            <p className="text-sm text-stone-500">revenue</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest platform interactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${
                              activity.type === 'sale' ? 'bg-green-100 text-green-600' :
                              activity.type === 'view' ? 'bg-blue-100 text-blue-600' :
                              'bg-yellow-100 text-yellow-600'
                            }`}>
                              {activity.type === 'sale' ? <DollarSign className="h-4 w-4" /> :
                               activity.type === 'view' ? <Eye className="h-4 w-4" /> :
                               <Star className="h-4 w-4" />}
                            </div>
                            <div>
                              <p className="font-medium text-stone-900">
                                {activity.type === 'sale' ? 'Sale' : 
                                 activity.type === 'view' ? 'View' : 'Rating'} - {activity.title}
                              </p>
                              <p className="text-sm text-stone-500">{activity.time}</p>
                            </div>
                          </div>
                          {activity.amount > 0 && (
                            <div className="text-right">
                              <p className="font-semibold text-stone-900">
                                {activity.type === 'rating' ? `${activity.amount} stars` : `$${activity.amount}`}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
