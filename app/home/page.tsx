"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Upload, Sparkles, ArrowRight, Loader2, DollarSign, TrendingUp, Target, FileText, Bell } from "lucide-react"
import { notify } from "@/lib/notifications"

interface DashboardData {
  stats: {
    creditsBalance: number
    reputationScore: number
    intelCount: number
    demandsCount: number
    totalEarnings: number
    totalSpent: number
    recentActivity: number
    memberSince: string
  }
  monthlyEarnings: Array<{
    month: string
    earnings: number
  }>
  topPerformingIntel: Array<{
    id: string
    title: string
    sales: number
    revenue: number
  }>
}

interface PlatformStats {
  activeIntelListings: number
  totalValueTraded: number
  averageRating: number
  totalUsers: number
  totalDemands: number
}

export default function HomePage() {
  const [activeAction, setActiveAction] = useState<"find" | "sell" | null>(null)
  const [query, setQuery] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true)
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null)
  const [isLoadingPlatformStats, setIsLoadingPlatformStats] = useState(true)

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/user/dashboard')
        if (response.ok) {
          const data = await response.json()
          setDashboardData(data)
        } else if (response.status === 401) {
          // User not authenticated, that's okay for home page
          setDashboardData(null)
        } else if (response.status >= 500) {
          // Only log server errors, not client errors
          console.error('Server error fetching dashboard data:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoadingDashboard(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Fetch platform stats
  useEffect(() => {
    const fetchPlatformStats = async () => {
      try {
        const response = await fetch('/api/platform/stats')
        if (response.ok) {
          const data = await response.json()
          setPlatformStats(data)
        }
      } catch (error) {
        console.error('Error fetching platform stats:', error)
        setPlatformStats(null)
      } finally {
        setIsLoadingPlatformStats(false)
      }
    }

    fetchPlatformStats()
  }, [])

  const handleAnalyze = async () => {
    if (!query.trim()) return
    
    setIsAnalyzing(true)
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock results based on action type
      if (activeAction === "find") {
        setResults([
          {
            id: "1",
            title: "Fintech companies in UAE looking for CRM solutions",
            description: "Found 15+ companies actively evaluating CRM platforms",
            price: 150,
            seller: "SalesPro_UAE",
            rating: 4.8,
            relevance: 95
          },
          {
            id: "2", 
            title: "B2B SaaS companies hiring VP Sales in Europe",
            description: "8 European companies with confirmed VP Sales openings",
            price: 200,
            seller: "EuroSalesIntel",
            rating: 4.9,
            relevance: 87
          }
        ])
      } else {
        setResults([
          {
            id: "1",
            title: "Similar intel requests found",
            description: "3 active requests match your intel",
            bounty: 300,
            buyer: "CyberSales_Pro",
            deadline: "7 days",
            relevance: 92
          },
          {
            id: "2",
            title: "Market analysis",
            description: "Your intel could be priced at $150-200 based on similar listings",
            category: "Technology",
            potentialEarnings: 175,
            relevance: 88
          }
        ])
      }
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAction = () => {
    setActiveAction(null)
    setQuery("")
    setResults([])
  }

  if (activeAction) {
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
                    <Button 
                      variant="ghost" 
                      onClick={resetAction}
                      className="mb-4"
                    >
                      ← Back to Home
                    </Button>
                    <h1 className="text-3xl font-bold text-stone-900">
                      {activeAction === "find" ? "Find Intel" : "Sell Intel"}
                    </h1>
                    <p className="text-stone-600 mt-1">
                      {activeAction === "find" 
                        ? "Describe what intel you're looking for and we'll find the best matches"
                        : "Tell us about your intel and we'll help you find buyers and set pricing"
                      }
                    </p>
                  </div>
                </div>

                {/* AI Input Box */}
                <div className="px-4 lg:px-6">
                  <Card className="max-w-4xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        AI-Powered Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-stone-700 mb-2 block">
                            {activeAction === "find" 
                              ? "What intel are you looking for?"
                              : "Describe your intel"
                            }
                          </label>
                          <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={
                              activeAction === "find"
                                ? "e.g., Companies in UAE looking for cybersecurity solutions, or Healthcare companies hiring VP Sales..."
                                : "e.g., I have a list of 20 fintech companies in Singapore that are actively looking for payment processing solutions..."
                            }
                            className="w-full p-4 border border-stone-300 rounded-lg resize-none"
                            rows={4}
                          />
                        </div>
                        
                        <Button 
                          onClick={handleAnalyze}
                          disabled={!query.trim() || isAnalyzing}
                          className="w-full"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Analyze with AI
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Results */}
                {results.length > 0 && (
                  <div className="px-4 lg:px-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Analysis Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {results.map((result) => (
                            <div key={result.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-stone-900">{result.title}</h3>
                                  <p className="text-stone-600 mt-1">{result.description}</p>
                                  <div className="flex items-center gap-4 text-sm text-stone-500 mt-2">
                                    {result.price && <span>Price: ${result.price}</span>}
                                    {result.bounty && <span>Bounty: ${result.bounty}</span>}
                                    {result.seller && <span>Seller: {result.seller}</span>}
                                    {result.buyer && <span>Buyer: {result.buyer}</span>}
                                    {result.rating && <span>Rating: {result.rating}/5</span>}
                                    {result.deadline && <span>Deadline: {result.deadline}</span>}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-green-600">
                                    {result.relevance}% match
                                  </Badge>
                                  <Button size="sm">
                                    {activeAction === "find" ? "View Details" : "Post Intel"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
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
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-stone-900">Welcome to LeadX</h1>
                        <p className="text-stone-600 mt-1">Choose what you'd like to do today</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          notify.info(
                            "Demo Notification",
                            "This is a demo of the new notification system! Try the spotlight search with Cmd+K.",
                            {
                              label: "Try Spotlight Search",
                              onClick: () => {
                                // Trigger spotlight search
                                const event = new KeyboardEvent('keydown', {
                                  key: 'k',
                                  metaKey: true,
                                  bubbles: true
                                });
                                document.dispatchEvent(event);
                              }
                            }
                          );
                        }}
                        className="flex items-center gap-2"
                      >
                        <Bell className="h-4 w-4" />
                        Demo Notification
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard Stats - Only show if user is authenticated */}
              {!isLoadingDashboard && dashboardData && (
                <div className="px-4 lg:px-6">
                  <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-stone-900 mb-4">Your Dashboard</h2>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card className="rounded-xl border-2 border-stone-200 bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-stone-600">Credits Balance</CardTitle>
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                            <DollarSign className="h-3 w-3 text-blue-600" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-stone-900">{dashboardData.stats.creditsBalance}</div>
                          <p className="text-xs text-stone-500 mt-1">Available credits</p>
                        </CardContent>
                      </Card>

                      <Card className="rounded-xl border-2 border-stone-200 bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-stone-600">Total Earnings</CardTitle>
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">{dashboardData.stats.totalEarnings}</div>
                          <p className="text-xs text-stone-500 mt-1">From intel sales</p>
                        </CardContent>
                      </Card>

                      <Card className="rounded-xl border-2 border-stone-200 bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-stone-600">Intel Posted</CardTitle>
                          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                            <FileText className="h-3 w-3 text-purple-600" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-stone-900">{dashboardData.stats.intelCount}</div>
                          <p className="text-xs text-stone-500 mt-1">Active listings</p>
                        </CardContent>
                      </Card>

                      <Card className="rounded-xl border-2 border-stone-200 bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-stone-600">Reputation Score</CardTitle>
                          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                            <Target className="h-3 w-3 text-amber-600" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-stone-900">{dashboardData.stats.reputationScore}</div>
                          <p className="text-xs text-stone-500 mt-1">Community rating</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* Main Actions */}
              <div className="px-4 lg:px-6">
                <div className="max-w-4xl mx-auto">
                  <div className="grid gap-6 md:grid-cols-2">
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-stone-200 bg-white hover:border-blue-300"
                    onClick={() => setActiveAction("find")}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Search className="h-6 w-6 text-blue-600" />
                        </div>
                        Find Intel
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-stone-600 mb-4">
                        Describe what intel you need and our AI will find the best matches from our platform
                      </p>
                      <Button className="w-full">
                        Start Finding
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-stone-200 bg-white hover:border-green-300"
                    onClick={() => setActiveAction("sell")}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Upload className="h-6 w-6 text-green-600" />
                        </div>
                        Sell Intel
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-stone-600 mb-4">
                        Share your intel and our AI will help you find buyers and set the right price
                      </p>
                      <Button variant="outline" className="w-full">
                        Start Selling
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                  </div>
                </div>
              </div>

              {/* Platform Stats */}
              <div className="px-4 lg:px-6">
                <div className="max-w-4xl mx-auto">
                  {isLoadingPlatformStats ? (
                    <div className="grid gap-4 md:grid-cols-3">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="border-2 border-stone-200 bg-white shadow-sm">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-center h-16">
                              <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : platformStats ? (
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card className="border-2 border-stone-200 bg-white shadow-sm">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-stone-900">
                            {platformStats.activeIntelListings.toLocaleString()}
                          </div>
                          <div className="text-sm text-stone-500">Active Intel Listings</div>
                        </CardContent>
                      </Card>
                      <Card className="border-2 border-stone-200 bg-white shadow-sm">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-stone-900">
                            ${(platformStats.totalValueTraded / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-sm text-stone-500">Total Value Traded</div>
                        </CardContent>
                      </Card>
                      <Card className="border-2 border-stone-200 bg-white shadow-sm">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-stone-900">
                            {platformStats.averageRating.toFixed(1)}
                          </div>
                          <div className="text-sm text-stone-500">Average Rating</div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card className="border-2 border-stone-200 bg-white shadow-sm">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-stone-900">0</div>
                          <div className="text-sm text-stone-500">Active Intel Listings</div>
                        </CardContent>
                      </Card>
                      <Card className="border-2 border-stone-200 bg-white shadow-sm">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-stone-900">$0.0M</div>
                          <div className="text-sm text-stone-500">Total Value Traded</div>
                        </CardContent>
                      </Card>
                      <Card className="border-2 border-stone-200 bg-white shadow-sm">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-stone-900">0.0</div>
                          <div className="text-sm text-stone-500">Average Rating</div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
