"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Target, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"

interface HistoryData {
  requests: any[]
  purchases: any[]
  sales: any[]
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
    case "fulfilled":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
    case "fulfilled":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<HistoryData>({
    requests: [],
    purchases: [],
    sales: []
  })
  const [isLoading, setIsLoading] = useState(true)

  // Fetch history data
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await fetch('/api/user/history')
        if (response.ok) {
          const data = await response.json()
          setHistoryData(data)
        } else {
          console.error('Failed to fetch history data')
        }
      } catch (error) {
        console.error('Error fetching history data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistoryData()
  }, [])

  if (isLoading) {
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
                <div className="px-4 lg:px-6">
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold text-stone-900">History</h1>
                    <p className="text-lg text-stone-600 mt-2">Track your requests, purchases, and sales activity</p>
                  </div>
                </div>
                <div className="px-4 lg:px-6">
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 mx-auto mb-4 text-stone-400 animate-spin" />
                    <p className="text-stone-500">Loading your history...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

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
                <div className="max-w-4xl mx-auto">
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold text-stone-900">History</h1>
                    <p className="text-lg text-stone-600 mt-2">Track your requests, purchases, and sales activity</p>
                  </div>
                </div>
              </div>

              {/* Content Tabs */}
              <div className="px-4 lg:px-6">
                <div className="max-w-4xl mx-auto">
                  <Tabs defaultValue="requests" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-14 bg-stone-100/50 rounded-full p-1.5">
                    <TabsTrigger 
                      value="requests" 
                      className="rounded-full h-11 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-stone-900 data-[state=inactive]:text-stone-600 hover:text-stone-800 transition-all duration-200 flex items-center gap-2"
                    >
                      <Target className="h-4 w-4" />
                      My Requests ({historyData.requests.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="purchases" 
                      className="rounded-full h-11 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-stone-900 data-[state=inactive]:text-stone-600 hover:text-stone-800 transition-all duration-200 flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Purchases ({historyData.purchases.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="sales" 
                      className="rounded-full h-11 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-stone-900 data-[state=inactive]:text-stone-600 hover:text-stone-800 transition-all duration-200 flex items-center gap-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      Sales ({historyData.sales.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="requests" className="mt-8">
                    <div className="grid gap-6">
                      {historyData.requests.length > 0 ? (
                        historyData.requests.map((item) => (
                        <Card key={item.id} className="hover:shadow-xl transition-all duration-300 rounded-2xl border-2 border-stone-200 bg-white overflow-hidden">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg line-clamp-2 text-stone-900 font-semibold">{item.title}</CardTitle>
                                <div className="flex items-center gap-6 text-sm text-stone-500 mt-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                      <DollarSign className="h-3 w-3 text-green-600" />
                                    </div>
                                    <span className="font-medium">${item.bounty} bounty</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                      <Clock className="h-3 w-3 text-blue-600" />
                                    </div>
                                    <span className="font-medium">{item.date}</span>
                                  </div>
                                  {item.deadline && (
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                                        <AlertCircle className="h-3 w-3 text-orange-600" />
                                      </div>
                                      <span className="font-medium">Due: {item.deadline}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="ml-4 flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(item.status)}
                                  <Badge className={`${getStatusColor(item.status)} rounded-full px-3 py-1 text-sm font-medium`}>
                                  {item.status}
                                </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          {item.fulfillment && (
                            <CardContent className="pt-0">
                              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-100">
                                <h4 className="font-semibold text-stone-900 mb-2">Fulfillment Details</h4>
                                <p className="text-stone-600 mb-4 leading-relaxed">{item.fulfillment.intel}</p>
                                <div className="flex items-center gap-6 text-sm text-stone-500">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center">
                                      <FileText className="h-3 w-3" />
                                    </div>
                                    <span className="font-medium">{item.fulfillment.seller}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                                      <CheckCircle className="h-3 w-3 text-amber-600" />
                                    </div>
                                    <span className="font-medium">{item.fulfillment.rating}/5 rating</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          )}
                        </Card>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <Target className="w-12 h-12 mx-auto mb-4 text-stone-300" />
                          <p className="text-stone-500">No requests found</p>
                          <p className="text-sm text-stone-400 mt-1">Your demand requests will appear here</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="purchases" className="mt-8">
                    <div className="grid gap-6">
                      {historyData.purchases.length > 0 ? (
                        historyData.purchases.map((item) => (
                        <Card key={item.id} className="hover:shadow-xl transition-all duration-300 rounded-2xl border-2 border-stone-200 bg-white overflow-hidden">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg line-clamp-2 text-stone-900 font-semibold">{item.title}</CardTitle>
                                <div className="flex items-center gap-6 text-sm text-stone-500 mt-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center">
                                      <FileText className="h-3 w-3" />
                                    </div>
                                    <span className="font-medium">{item.seller}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                      <DollarSign className="h-3 w-3 text-green-600" />
                                    </div>
                                    <span className="font-medium">{item.price === 0 ? 'Free' : `$${item.price}`}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                      <Clock className="h-3 w-3 text-blue-600" />
                                    </div>
                                    <span className="font-medium">{item.date}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                                      <CheckCircle className="h-3 w-3 text-amber-600" />
                                    </div>
                                    <span className="font-medium">{item.rating}/5 rating</span>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4 flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(item.status)}
                                  <Badge className={`${getStatusColor(item.status)} rounded-full px-3 py-1 text-sm font-medium`}>
                                  {item.status}
                                </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <FileText className="w-12 h-12 mx-auto mb-4 text-stone-300" />
                          <p className="text-stone-500">No purchases found</p>
                          <p className="text-sm text-stone-400 mt-1">Your intel purchases will appear here</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="sales" className="mt-8">
                    <div className="grid gap-6">
                      {historyData.sales.length > 0 ? (
                        historyData.sales.map((item) => (
                        <Card key={item.id} className="hover:shadow-xl transition-all duration-300 rounded-2xl border-2 border-stone-200 bg-white overflow-hidden">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg line-clamp-2 text-stone-900 font-semibold">{item.title}</CardTitle>
                                <div className="flex items-center gap-6 text-sm text-stone-500 mt-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center">
                                      <FileText className="h-3 w-3" />
                                    </div>
                                    <span className="font-medium">{item.buyer}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                      <DollarSign className="h-3 w-3 text-green-600" />
                                    </div>
                                    <span className="font-medium">{item.price === 0 ? 'Free' : `$${item.price}`}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                      <Clock className="h-3 w-3 text-blue-600" />
                                    </div>
                                    <span className="font-medium">{item.date}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                                      <CheckCircle className="h-3 w-3 text-amber-600" />
                                    </div>
                                    <span className="font-medium">{item.rating}/5 rating</span>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4 flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(item.status)}
                                  <Badge className={`${getStatusColor(item.status)} rounded-full px-3 py-1 text-sm font-medium`}>
                                  {item.status}
                                </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <DollarSign className="w-12 h-12 mx-auto mb-4 text-stone-300" />
                          <p className="text-stone-500">No sales found</p>
                          <p className="text-sm text-stone-400 mt-1">Your intel sales will appear here</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
