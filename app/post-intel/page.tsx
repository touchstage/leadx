"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, DollarSign, Tag, Upload, ArrowRight, Shuffle, Sparkles, Loader2, X, Target, FileText, TrendingUp, Star, Eye, Edit, Trash2, Plus, User, MessageCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RequestDetailsModal } from "@/components/RequestDetailsModal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { gsap } from "gsap"

const PRICE_OPTIONS = [
  { value: 0, label: "Free - Community intel" },
  { value: 25, label: "$25 - Basic intel" },
  { value: 50, label: "$50 - Standard intel" },
  { value: 100, label: "$100 - Premium intel" },
  { value: 150, label: "$150 - High-value intel" },
  { value: 200, label: "$200 - Exclusive intel" },
  { value: 300, label: "$300 - Premium exclusive" },
]

const CATEGORIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Manufacturing",
  "Real Estate",
  "Education",
  "Government",
  "Non-profit",
  "Other"
]

interface FormData {
  title: string
  description: string
  category: string
  priceCredits: number
  additionalDetails: string
  attachments: string
}

export default function PostIntelPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  
  // Hero-like animated input state
  const SUGGESTIONS = [
    "Intro to VP Engineering at a mid-market SaaS (₹4–6 Cr ARR)",
    "Fintech companies in UAE replacing CRM this quarter",
    "B2B SaaS actively budgeting for cybersecurity in Q4",
    "Healthcare providers seeking AI imaging partners",
  ]
  const [index, setIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const textRef = React.useRef<HTMLDivElement>(null)
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "Technology",
    priceCredits: 50,
    additionalDetails: "",
    attachments: "",
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [aiEvaluation, setAiEvaluation] = useState<{
    valueScore: number
    marketDemand: string
    suggestedPrice: number
    reasoning: string
  } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState("post")
  const [intelRequests, setIntelRequests] = useState<any[]>([])
  const [isLoadingRequests, setIsLoadingRequests] = useState(false)
  const [myIntel, setMyIntel] = useState<any[]>([])
  const [isLoadingMyIntel, setIsLoadingMyIntel] = useState(false)
  const [selectedIntel, setSelectedIntel] = useState<any>(null)
  const [showIntelModal, setShowIntelModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [intelToDelete, setIntelToDelete] = useState<any>(null)
  
  // Modal state for request details
  const [requestDetailsModal, setRequestDetailsModal] = useState<{
    isOpen: boolean
    request: any
  }>({
    isOpen: false,
    request: null
  })

  // Fetch intel requests for the user's posted intel
  const fetchIntelRequests = async () => {
    if (!user?.id) {
      setIntelRequests([])
      return
    }
    
    setIsLoadingRequests(true)
    try {
      const response = await fetch('/api/intel/requests?status=PENDING')
      if (response.ok) {
        const data = await response.json()
        setIntelRequests(data.requests || [])
      } else if (response.status === 401) {
        // User not authenticated, redirect to login
        window.location.href = '/login?callbackUrl=/post-intel'
      } else {
        console.error('Failed to fetch intel requests:', response.status)
        setIntelRequests([])
      }
    } catch (error) {
      console.error('Error fetching intel requests:', error)
      setIntelRequests([])
    } finally {
      setIsLoadingRequests(false)
    }
  }

  // Fetch requests when switching to requests tab
  useEffect(() => {
    if (activeTab === "requests" && user?.id) {
      fetchIntelRequests()
    }
  }, [activeTab, user?.id])

  // Fetch my intel when switching to my-intel tab
  useEffect(() => {
    if (activeTab === "my-intel" && user?.id) {
      fetchMyIntel()
    }
  }, [activeTab, user?.id])

  // Respond to intel request
  const respondToRequest = async (requestId: string, response: string) => {
    try {
      const res = await fetch('/api/intel/requests/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, response })
      })

      if (res.ok) {
        setMessage("Response sent successfully!")
        // Refresh the requests list
        fetchIntelRequests()
      } else {
        const errorData = await res.json()
        setMessage(errorData.error || "Failed to send response")
      }
    } catch (error) {
      console.error('Error responding to request:', error)
      setMessage("An error occurred while sending response")
    }
  }

  // Animate hero-like suggestion text
  const animateText = (text: string) => {
    if (!textRef.current || isAnimating) return
    setIsAnimating(true)
    textRef.current.innerHTML = ""
    const words = text.split(" ")
    words.forEach((word, i) => {
      const span = document.createElement("span")
      span.textContent = word
      span.style.opacity = "0"
      span.style.marginRight = "0.25em"
      textRef.current?.appendChild(span)
      gsap.to(span, { opacity: 1, duration: 0.1, delay: i * 0.05, ease: "power2.out" })
    })
    setTimeout(() => setIsAnimating(false), words.length * 50 + 500)
  }

  // Fetch user's posted intel
  const fetchMyIntel = async () => {
    if (!user?.id) {
      setMyIntel([])
      return
    }

    try {
      setIsLoadingMyIntel(true)
      const response = await fetch("/api/intel/list?my=true")
      
      if (response.status === 401) {
        router.push("/login?callbackUrl=/post-intel")
        return
      }
      
      if (!response.ok) {
        throw new Error("Failed to fetch intel")
      }
      
      const data = await response.json()
      setMyIntel(data.intel || [])
    } catch (error) {
      console.error("Error fetching intel:", error)
    } finally {
      setIsLoadingMyIntel(false)
    }
  }

  // Handle viewing intel details
  const handleViewIntel = (intel: any) => {
    setSelectedIntel(intel)
    setShowIntelModal(true)
  }

  // Handle editing intel
  const handleEditIntel = (intel: any) => {
    setSelectedIntel(intel)
    setShowIntelModal(true)
  }

  // Handle deleting intel
  const handleDeleteIntel = (intel: any) => {
    setIntelToDelete(intel)
    setShowDeleteConfirm(true)
  }

  // Confirm delete intel
  const confirmDeleteIntel = async () => {
    if (!intelToDelete) return

    try {
      const response = await fetch(`/api/intel/delete/${intelToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove from local state
        setMyIntel(prev => prev.filter(item => item.id !== intelToDelete.id))
        setMessage("Intel deleted successfully!")
        setShowDeleteConfirm(false)
        setIntelToDelete(null)
      } else {
        const errorData = await response.json()
        setMessage(errorData.error || "Failed to delete intel")
      }
    } catch (error) {
      console.error("Error deleting intel:", error)
      setMessage("Failed to delete intel")
    }
  }

  // Update intel
  const handleUpdateIntel = async (updatedIntel: any) => {
    try {
      const response = await fetch(`/api/intel/update/${selectedIntel.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedIntel)
      })

      if (response.ok) {
        // Update local state
        setMyIntel(prev => prev.map(item => 
          item.id === selectedIntel.id ? { ...item, ...updatedIntel } : item
        ))
        setMessage("Intel updated successfully!")
        setShowIntelModal(false)
        setSelectedIntel(null)
      } else {
        const errorData = await response.json()
        setMessage(errorData.error || "Failed to update intel")
      }
    } catch (error) {
      console.error("Error updating intel:", error)
      setMessage("Failed to update intel")
    }
  }

  useEffect(() => {
    if (!formData.title && !isFocused) {
      animateText(SUGGESTIONS[index % SUGGESTIONS.length])
    }
  }, [index, isFocused])

  useEffect(() => {
    if (!isFocused) {
      const id = setInterval(() => setIndex((i) => i + 1), 5000)
      return () => clearInterval(id)
    }
  }, [isFocused])

  const handleNewSuggestion = () => {
    if (textRef.current) {
      gsap.to(textRef.current, {
        rotationY: 180,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          setIndex((i) => i + 1)
          gsap.to(textRef.current, { rotationY: 0, duration: 0.3, ease: "power2.inOut" })
        },
      })
    } else {
      setIndex((i) => i + 1)
    }
  }

  const handleContinueToForm = () => {
    if (!formData.title.trim()) {
      alert("Please enter a title for your intel before continuing")
      return
    }
    setShowModal(true)
  }

  const evaluateIntel = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please provide both title and description before evaluation")
      return
    }

    setIsEvaluating(true)
    setAiEvaluation(null)

    try {
      // Simulate AI evaluation (replace with actual AI API call)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock AI evaluation based on content
      const title = formData.title.toLowerCase()
      const description = formData.description.toLowerCase()
      
      let valueScore = 50 // Base score
      let marketDemand = "Medium"
      let suggestedPrice = 50
      let reasoning = ""

      // Analyze content for value indicators
      if (title.includes("vp") || title.includes("c-suite") || title.includes("executive")) {
        valueScore += 30
        marketDemand = "High"
        suggestedPrice = 200
        reasoning = "Executive-level intel has high demand and premium pricing potential."
      }
      
      if (title.includes("budget") || title.includes("funding") || title.includes("investment")) {
        valueScore += 25
        marketDemand = "High"
        suggestedPrice = Math.max(suggestedPrice, 150)
        reasoning += " Budget and funding information is highly valuable to sales teams."
      }
      
      if (title.includes("replacing") || title.includes("switching") || title.includes("migration")) {
        valueScore += 20
        marketDemand = "High"
        suggestedPrice = Math.max(suggestedPrice, 100)
        reasoning += " Active replacement/migration intel indicates immediate sales opportunities."
      }
      
      if (title.includes("saas") || title.includes("tech") || title.includes("software")) {
        valueScore += 15
        reasoning += " Technology sector intel has consistent market demand."
      }
      
      if (description.includes("confirmed") || description.includes("verified") || description.includes("active")) {
        valueScore += 20
        suggestedPrice = Math.max(suggestedPrice, 75)
        reasoning += " Verified/confirmed information significantly increases value."
      }
      
      if (description.includes("timeline") || description.includes("quarter") || description.includes("deadline")) {
        valueScore += 15
        reasoning += " Timeline information adds urgency and value."
      }

      // Cap the score and adjust price accordingly
      valueScore = Math.min(valueScore, 100)
      if (valueScore >= 80) {
        marketDemand = "Very High"
        suggestedPrice = Math.max(suggestedPrice, 200)
      } else if (valueScore >= 60) {
        marketDemand = "High"
        suggestedPrice = Math.max(suggestedPrice, 100)
      } else if (valueScore < 40) {
        marketDemand = "Low"
        suggestedPrice = Math.min(suggestedPrice, 25)
      }

      setAiEvaluation({
        valueScore,
        marketDemand,
        suggestedPrice,
        reasoning: reasoning || "Standard intel with moderate market value."
      })

      // Auto-update the price if it's significantly different
      if (Math.abs(suggestedPrice - formData.priceCredits) > 25) {
        setFormData(prev => ({ ...prev, priceCredits: suggestedPrice }))
      }

    } catch (error) {
      console.error("AI evaluation failed:", error)
      alert("AI evaluation failed. Please try again.")
    } finally {
      setIsEvaluating(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Check authentication
    if (!user) {
      window.location.href = '/sign-in?redirect_url=/post-intel'
      return
    }

    setIsSubmitting(true)
    setMessage("")

    try {
      const res = await fetch("/api/intel/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priceCredits: formData.priceCredits,
          additionalDetails: formData.additionalDetails,
          attachments: formData.attachments,
        }),
      })

      if (res.ok) {
        const result = await res.json()
        setMessage("Intel posted successfully!")
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "Technology",
          priceCredits: 50,
          additionalDetails: "",
          attachments: "",
        })
        setShowModal(false)
        // Optionally redirect to the intel page
        // router.push(`/intel/${result.id}`)
      } else {
        const errorData = await res.json()
        setMessage(errorData.error || "Failed to create intel listing. Please try again.")
      }
    } catch (error) {
      console.error("Error creating intel:", error)
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded) {
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
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900 mx-auto"></div>
              <p className="mt-2 text-stone-600">Loading...</p>
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
            <div className="flex flex-col items-center py-6 md:py-8">
              {/* Centered Header */}
              <div className="w-full max-w-3xl px-6 text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => router.back()}
                  className="mb-4 -ml-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <h1 className="text-6xl sm:text-7xl lg:text-7xl font-medium text-stone-900 leading-[1.1] tracking-tight">
                  {activeTab === "post" ? "Post Intel" : activeTab === "my-intel" ? "My Intel" : "Manage Intel Requests"}
                </h1>
                <p className="text-lg sm:text-xl text-stone-500 mt-6 font-normal leading-relaxed max-w-3xl mx-auto">
                  {activeTab === "post" 
                    ? "Share your verified sales intelligence. Escrow-protected. No subscriptions, just results."
                    : activeTab === "my-intel"
                    ? "Manage your posted intel listings and track their performance."
                    : "View and respond to requests for more details about your posted intel."
                  }
                </p>
              </div>

              {/* Segment Control */}
              <div className="w-full max-w-3xl px-6 mt-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-14 bg-stone-100/50 rounded-full p-1.5">
                    <TabsTrigger 
                      value="post" 
                      className="rounded-full h-11 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-stone-900 data-[state=inactive]:text-stone-600 hover:text-stone-800 transition-all duration-200"
                    >
                      Post Intel
                    </TabsTrigger>
                    <TabsTrigger 
                      value="my-intel" 
                      className="rounded-full h-11 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-stone-900 data-[state=inactive]:text-stone-600 hover:text-stone-800 transition-all duration-200"
                    >
                      My Intel
                    </TabsTrigger>
                    <TabsTrigger 
                      value="requests" 
                      className="rounded-full h-11 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-stone-900 data-[state=inactive]:text-stone-600 hover:text-stone-800 transition-all duration-200"
                    >
                      Requests on Posted Intel
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="post" className="mt-8">
                    {/* Hero-style Title Input */}
                    <div className="w-full max-w-3xl px-6 mt-12">
                      <style jsx>{`
                        [contenteditable]:empty:before {
                          content: attr(data-placeholder);
                          color: #a8a29e;
                          pointer-events: none;
                        }
                      `}</style>
                      
                      <div className="relative">
                        <div
                          ref={textRef}
                          contentEditable
                          data-placeholder="Enter your intel title..."
                          className="w-full text-4xl sm:text-5xl lg:text-6xl font-medium text-stone-900 leading-[1.1] tracking-tight outline-none border-none bg-transparent resize-none min-h-[4rem]"
                          onInput={(e) => {
                            const value = e.currentTarget.textContent || ""
                            setFormData(prev => ({ ...prev, title: value }))
                          }}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          suppressContentEditableWarning={true}
                        />
                        
                        <div className="flex items-center justify-between mt-6">
                          <Button
                            variant="ghost"
                            onClick={handleNewSuggestion}
                            className="text-stone-500 hover:text-stone-700"
                            disabled={isAnimating}
                          >
                            <Shuffle className="mr-2 h-4 w-4" />
                            New Suggestion
                          </Button>
                          
                          <Button
                            onClick={handleContinueToForm}
                            disabled={!formData.title.trim()}
                            className="h-12 px-8 bg-stone-900 text-white hover:bg-stone-800 rounded-full text-base font-medium"
                          >
                            Continue to Details
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="my-intel" className="mt-8">
                    {/* My Intel Section */}
                    <div className="w-full max-w-3xl px-6">
                      <div className="relative rounded-2xl bg-white shadow-lg border-2 border-stone-200 p-8 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-pink-50/30 animate-pulse opacity-50"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-stone-900">My Intel Listings</h3>
                            <Badge variant="outline" className="ml-auto">{myIntel.length} Total</Badge>
                          </div>

                          {isLoadingMyIntel ? (
                            <div className="flex items-center justify-center py-12">
                              <Loader2 className="h-8 w-8 animate-spin text-stone-500" />
                            </div>
                          ) : myIntel.length === 0 ? (
                            <div className="text-center py-12">
                              <FileText className="h-16 w-16 mx-auto mb-4 text-stone-300" />
                              <h3 className="text-lg font-semibold text-stone-900 mb-2">No Intel Posted Yet</h3>
                              <p className="text-stone-600 mb-6 max-w-md mx-auto">
                                Start sharing your sales intelligence with the community. Post your first intel to begin earning.
                              </p>
                              <Button onClick={() => setActiveTab("post")}>
                                <Plus className="h-4 w-4 mr-2" />
                                Post Your First Intel
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {/* Stats Cards */}
                              <div className="grid gap-4 md:grid-cols-4 mb-6">
                                <Card className="border-2 border-stone-200 bg-white shadow-sm">
                                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-stone-600">Total Listings</CardTitle>
                                    <FileText className="h-4 w-4 text-stone-500" />
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold text-stone-900">{myIntel.length}</div>
                                  </CardContent>
                                </Card>
                                <Card className="border-2 border-stone-200 bg-white shadow-sm">
                                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-stone-600">Published</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                      {myIntel.filter(i => i.status === 'PUBLISHED').length}
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card className="border-2 border-stone-200 bg-white shadow-sm">
                                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-stone-600">Drafts</CardTitle>
                                    <Eye className="h-4 w-4 text-stone-500" />
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold text-stone-900">
                                      {myIntel.filter(i => i.status === 'DRAFT').length}
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card className="border-2 border-stone-200 bg-white shadow-sm">
                                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-stone-600">Total Value</CardTitle>
                                    <Star className="h-4 w-4 text-yellow-500" />
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold text-yellow-600">
                                      ${myIntel.reduce((sum, i) => sum + i.priceCredits, 0)}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Intel Listings */}
                              <div className="space-y-4">
                                {myIntel.map((item) => (
                                  <Card key={item.id} className="border-2 border-stone-200 bg-white shadow-sm hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-2">
                                            <CardTitle className="text-xl">{item.title}</CardTitle>
                                            <Badge variant={item.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                                              {item.status}
                                            </Badge>
                                          </div>
                                          <CardDescription className="text-base">
                                            {item.description}
                                          </CardDescription>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-2xl font-bold text-stone-900">
                                            {item.priceCredits === 0 ? 'Free' : `$${item.priceCredits}`}
                                          </p>
                                          <p className="text-sm text-stone-500">price</p>
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6 text-sm text-stone-600">
                                          <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            <span>{item.category}</span>
                                          </div>
                                          <span>Posted {new Date(item.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleViewIntel(item)}
                                          >
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                          </Button>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleEditIntel(item)}
                                          >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                          </Button>
                                          <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="text-red-600 hover:text-red-700"
                                            onClick={() => handleDeleteIntel(item)}
                                          >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                          </Button>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="requests" className="mt-8">
                    {/* Intel Requests Section */}
                    <div className="w-full max-w-3xl px-6">
                      <div className="relative rounded-2xl bg-white shadow-lg border-2 border-stone-200 p-8 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-50/30 via-blue-50/20 to-purple-50/30 animate-pulse opacity-50"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                              <Target className="h-4 w-4 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-stone-900">Requests for Your Posted Intel</h3>
                            <Badge variant="outline" className="ml-auto">{intelRequests.length} Active</Badge>
                          </div>

                          {isLoadingRequests ? (
                            <div className="flex items-center justify-center py-12">
                              <Loader2 className="h-8 w-8 animate-spin text-stone-500" />
                            </div>
                          ) : intelRequests.length === 0 ? (
                            <div className="text-center py-12">
                              <Target className="h-16 w-16 mx-auto mb-4 text-stone-300" />
                              <h3 className="text-lg font-semibold text-stone-900 mb-2">No Requests Yet</h3>
                              <p className="text-stone-600 mb-6 max-w-md mx-auto">
                                When people request more details about your posted intel, you'll see them here.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {intelRequests.map((request) => (
                                <Card key={request.id} className="border-2 border-stone-200 bg-white shadow-sm hover:shadow-lg transition-shadow">
                                  <CardHeader>
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <CardTitle className="text-xl">{request.intel?.title}</CardTitle>
                                          <Badge variant="outline" className="text-green-600 border-green-200">
                                            {request.status}
                                          </Badge>
                                        </div>
                                        <CardDescription className="text-base">
                                          {request.message}
                                        </CardDescription>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-lg font-bold text-stone-900">
                                          ${request.bountyCredits}
                                        </p>
                                        <p className="text-sm text-stone-500">bounty</p>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-6 text-sm text-stone-600">
                                        <div className="flex items-center gap-2">
                                          <User className="h-4 w-4" />
                                          <span>{request.requester?.name}</span>
                                        </div>
                                        <span>Requested {new Date(request.createdAt).toLocaleDateString()}</span>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => {
                                            setRequestDetailsModal({
                                              isOpen: true,
                                              request: request
                                            })
                                          }}
                                        >
                                          <MessageCircle className="h-4 w-4 mr-1" />
                                          Respond
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Intel Details Modal */}
      <Dialog open={showIntelModal} onOpenChange={setShowIntelModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Intel Details
            </DialogTitle>
            <DialogDescription>
              {selectedIntel ? `Viewing: ${selectedIntel.title}` : "Intel information"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedIntel && (
            <div className="space-y-6">
              {/* Intel Information */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-stone-600">Title</Label>
                  <Input 
                    value={selectedIntel.title} 
                    readOnly
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-stone-600">Description</Label>
                  <Textarea 
                    value={selectedIntel.description} 
                    readOnly
                    className="mt-1 min-h-[100px]"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-stone-600">Category</Label>
                    <Input 
                      value={selectedIntel.category} 
                      readOnly
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-stone-600">Price</Label>
                    <Input 
                      value={`$${selectedIntel.priceCredits}`} 
                      readOnly
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-stone-600">Status</Label>
                    <Input 
                      value={selectedIntel.status} 
                      readOnly
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-stone-600">Created</Label>
                    <Input 
                      value={new Date(selectedIntel.createdAt).toLocaleDateString()} 
                      readOnly
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowIntelModal(false)}>
                  Close
                </Button>
                <Button onClick={() => handleEditIntel(selectedIntel)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Intel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Intel
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this intel? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {intelToDelete && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-900">{intelToDelete.title}</h4>
                <p className="text-sm text-red-700 mt-1">{intelToDelete.description}</p>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmDeleteIntel}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Intel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Request Details Modal */}
      {requestDetailsModal.request && (
        <RequestDetailsModal
          isOpen={requestDetailsModal.isOpen}
          onClose={() => setRequestDetailsModal({ isOpen: false, request: null })}
          request={requestDetailsModal.request}
        />
      )}
    </SidebarProvider>
  )
}
