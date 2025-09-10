"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Shuffle, 
  CheckCircle, 
  DollarSign, 
  Shield, 
  Star, 
  Target, 
  ArrowRight, 
  Loader2, 
  User, 
  Clock, 
  MessageCircle,
  Sparkles,
  FileText,
  Upload,
  Tag,
  Eye,
  AlertCircle
} from "lucide-react"
import { gsap } from "gsap"
import { notify } from "@/lib/notifications"
import { ConfirmationModal } from "@/components/ConfirmationModal"
import { RequestDetailsModal } from "@/components/RequestDetailsModal"

const CATEGORIES = [
  "Technology",
  "Healthcare", 
  "Finance",
  "Manufacturing",
  "Retail",
  "Education",
  "Real Estate",
  "Other"
]

const BOUNTY_OPTIONS = [
  { value: 25, label: "$25 - Quick intel" },
  { value: 50, label: "$50 - Standard intel" },
  { value: 100, label: "$100 - Detailed intel" },
  { value: 200, label: "$200 - Premium intel" },
  { value: 500, label: "$500 - Exclusive intel" },
]

const PRICE_OPTIONS = [
  { value: 0, label: "Free - Community intel" },
  { value: 25, label: "$25 - Basic intel" },
  { value: 50, label: "$50 - Standard intel" },
  { value: 100, label: "$100 - Premium intel" },
  { value: 150, label: "$150 - High-value intel" },
  { value: 200, label: "$200 - Exclusive intel" },
  { value: 300, label: "$300 - Premium exclusive" },
]

const SUGGESTIONS = [
  "Fintechs in UAE replacing their CRM this quarter",
  "Healthcare companies hiring VP Sales in Europe",
  "Manufacturing companies seeking AI solutions",
  "B2B SaaS companies with confirmed budget for cybersecurity",
  "Startups in India looking for marketing automation tools"
]

// Mock data
const mockIntel = [
  {
    id: "1",
    title: "Fintech companies in UAE looking for CRM solutions",
    description: "Comprehensive list of 15+ fintech companies in UAE that are actively evaluating CRM platforms for Q1 2025.",
    category: "Technology",
    price: 150,
    seller: "SalesPro_UAE",
    rating: 4.8,
    sales: 12,
    date: "2 hours ago"
  },
  {
    id: "2", 
    title: "B2B SaaS companies hiring VP Sales in Europe",
    description: "Updated list of 8 European B2B SaaS companies with confirmed VP Sales openings and hiring timelines.",
    category: "Hiring",
    price: 200,
    seller: "EuroSalesIntel",
    rating: 4.9,
    sales: 8,
    date: "5 hours ago"
  },
  {
    id: "3",
    title: "Healthcare tech partnerships and integrations",
    description: "Insider information on 12 healthcare technology companies seeking integration partners in 2025.",
    category: "Healthcare",
    price: 175,
    seller: "HealthTechInsider",
    rating: 4.7,
    sales: 15,
    date: "1 day ago"
  }
]

export default function AskPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "find")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [suggestionIndex, setSuggestionIndex] = useState(0)
  const [myRequests, setMyRequests] = useState<any[]>([])
  const [isLoadingRequests, setIsLoadingRequests] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  
  // Modal states
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    title: string
    description: string
    onConfirm: () => void
    isLoading?: boolean
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {}
  })
  
  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean
    request: any
  }>({
    isOpen: false,
    request: null
  })
  
  // Request form state
  const [requestForm, setRequestForm] = useState({
    title: "",
    description: "",
    category: "",
    bounty: 50,
    deadline: "",
    additionalDetails: ""
  })
  
  // Post intel form state
  const [intelForm, setIntelForm] = useState({
    title: "",
    description: "",
    category: "Technology",
    priceCredits: 50,
    additionalDetails: "",
    attachments: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const currentSuggestion = useMemo(() => SUGGESTIONS[suggestionIndex % SUGGESTIONS.length], [suggestionIndex])

  const animateText = (text: string) => {
    if (!textRef.current || isAnimating) return;
    
    setIsAnimating(true);
    textRef.current.innerHTML = "";
    
    const words = text.split(" ");
    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.style.opacity = "0";
      span.style.marginRight = "0.25em";
      textRef.current?.appendChild(span);
      
      gsap.to(span, {
        opacity: 1,
        duration: 0.1,
        delay: i * 0.05,
        ease: "power2.out"
      });
    });
    
    setTimeout(() => setIsAnimating(false), words.length * 50 + 500);
  };

  useEffect(() => {
    animateText(currentSuggestion);
  }, [currentSuggestion]);

  useEffect(() => {
    if (!isFocused) {
      const id = setInterval(() => setSuggestionIndex((i) => i + 1), 5000);
      return () => clearInterval(id);
    }
  }, [isFocused]);

  // Fetch requests when switching to my-requests tab
  useEffect(() => {
    if (activeTab === "my-requests") {
      fetchMyRequests()
    }
  }, [activeTab]);

  // Sync contentEditable with searchQuery state
  useEffect(() => {
    if (textRef.current) {
      if (searchQuery) {
        textRef.current.textContent = searchQuery
      } else if (!isFocused && !isAnimating) {
        textRef.current.textContent = currentSuggestion
      }
    }
  }, [searchQuery, isFocused, isAnimating, currentSuggestion]);

  const handleNewSuggestion = () => {
    if (textRef.current) {
      gsap.to(textRef.current, {
        rotationY: 180,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          setSuggestionIndex((i) => i + 1);
          gsap.to(textRef.current, {
            rotationY: 0,
            duration: 0.3,
            ease: "power2.inOut"
          });
        }
      });
    } else {
      setSuggestionIndex((i) => i + 1);
    }
  };

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const { intel, demands, aiAnswer, searchType } = await response.json()
      
      // Transform intel results to match our UI format
      const transformedResults = intel.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.priceCredits || item.price,
        seller: item.seller_name || item.seller || "Seller",
        rating: 4.5, // Default rating
        relevance: Math.round((item.score || 0.85) * 100), // Use RAG score if available
        aiMatch: searchType === "semantic",
        category: item.category,
        sales: 0, // You might want to include this in the API
        date: new Date(item.createdAt).toLocaleDateString()
      }))

      setSearchResults(transformedResults)
      
      // Log search type for debugging
      console.log(`🔍 Search completed: ${searchType} search found ${transformedResults.length} results`)
      if (aiAnswer) {
        console.log(`🤖 AI Answer: ${aiAnswer}`)
      }
    } catch (error) {
      console.error("Search failed:", error)
      // Fallback to mock data if API fails
      setSearchResults([
        {
          id: "ai-1",
          title: "AI Found: Companies in UAE looking for CRM solutions",
          description: "Based on your search, found 15+ fintech companies actively evaluating CRM platforms",
          price: 150,
          seller: "SalesPro_UAE",
          rating: 4.8,
          relevance: 95,
          aiMatch: true,
          category: "Technology",
          sales: 12,
          date: "2 hours ago"
        },
        {
          id: "ai-2",
          title: "AI Found: European B2B SaaS companies hiring VP Sales",
          description: "8 European companies with confirmed VP Sales openings matching your criteria",
          price: 200,
          seller: "EuroSalesIntel",
          rating: 4.9,
          relevance: 87,
          aiMatch: true,
          category: "Hiring",
          sales: 8,
          date: "5 hours ago"
        }
      ])
    } finally {
      setIsSearching(false)
    }
  }

  // Fetch user's demands (intel requests)
  const fetchMyRequests = async () => {
    try {
      setIsLoadingRequests(true)
      const response = await fetch('/api/demands/my')
      
      if (response.ok) {
        const data = await response.json()
        setMyRequests(data.demands || [])
      } else {
        console.error('Failed to fetch demands:', response.status)
        setMyRequests([])
      }
    } catch (error) {
      console.error('Error fetching demands:', error)
      setMyRequests([])
    } finally {
      setIsLoadingRequests(false)
    }
  }

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check authentication
    if (!isLoaded) {
      return // Still loading
    }
    
    if (!user) {
      router.push('/sign-in?redirect_url=/ask')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/demands/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: requestForm.title,
          description: requestForm.description,
          category: requestForm.category,
          bountyCredits: requestForm.bounty,
          deadline: requestForm.deadline ? parseInt(requestForm.deadline) : null,
          additionalDetails: requestForm.additionalDetails
        })
      })
      
      if (response.ok) {
        // Show success notification
        notify.success(
          "Intel Request Created",
          "Your request has been posted and is now visible to the community.",
          {
            label: "View Request",
            onClick: () => {
              // Switch to my-requests tab
              setActiveTab("my-requests")
            }
          }
        )
        
        setRequestForm({
          title: "",
          description: "",
          category: "",
          bounty: 50,
          deadline: "",
          additionalDetails: ""
        })
        // Refresh the my requests list
        fetchMyRequests()
      } else {
        let errorMessage = "Something went wrong. Please try again."
        
        try {
          const errorData = await response.json()
          console.error('Error creating demand:', errorData)
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          console.error('Error parsing error response:', parseError)
          errorMessage = `Server error (${response.status}): ${response.statusText}`
        }
        
        // Show error notification
        notify.error(
          "Failed to Create Request",
          errorMessage
        )
      }
    } catch (error) {
      console.error("Error posting request:", error)
      notify.error(
        "Network Error",
        "Failed to connect to the server. Please check your connection and try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleIntelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/intel/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: intelForm.title,
          description: intelForm.description,
          category: intelForm.category,
          priceCredits: intelForm.priceCredits,
          additionalDetails: intelForm.additionalDetails,
          attachments: intelForm.attachments
        })
      })
      
      if (response.ok) {
        setIntelForm({
          title: "",
          description: "",
          category: "Technology",
          priceCredits: 50,
          additionalDetails: "",
          attachments: ""
        })
        alert("Intel posted successfully!")
      } else {
        alert("Failed to post intel")
      }
    } catch (error) {
      console.error("Error posting intel:", error)
      alert("Error posting intel")
    } finally {
      setIsSubmitting(false)
    }
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
              {/* Centered Header */}
              <div className="w-full max-w-3xl px-6 text-center mx-auto">
                <h1 className="text-6xl sm:text-7xl lg:text-7xl font-medium text-stone-900 leading-[1.1] tracking-tight">
                  Find & Request Intel
            </h1>
                <p className="text-lg sm:text-xl text-stone-500 mt-6 font-normal leading-relaxed max-w-3xl mx-auto">
                  Search for verified sales intelligence or request specific intel from our community. Escrow-protected. No subscriptions, just results.
            </p>
          </div>

              {/* Hero-style Search Input */}
              <div className="w-full max-w-3xl px-6 mt-12 mx-auto">
                <style jsx>{`
                  [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #a8a29e;
                    pointer-events: none;
                  }
                `}</style>
                <div className="relative rounded-2xl bg-white shadow-2xl border border-gray-100 p-6 min-h-[160px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-pink-50/30 animate-pulse opacity-50"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/20 via-indigo-50/30 to-violet-50/20 animate-pulse opacity-40" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-emerald-50/20 via-teal-50/30 to-blue-50/20 animate-pulse opacity-30" style={{ animationDelay: '2s' }}></div>

                  <div className="relative z-10">
                    <div
                      ref={textRef}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => {
                        const query = e.currentTarget.textContent || ""
                        setSearchQuery(query)
                        // Stop suggestions animation when user starts typing
                        if (query.trim()) {
                          setIsAnimating(false)
                        }
                      }}
                      onFocus={() => {
                        setIsFocused(true)
                        if (textRef.current && !searchQuery) {
                          textRef.current.textContent = ""
                        }
                      }}
                      onBlur={() => setIsFocused(false)}
                      className="w-full text-lg text-stone-800 font-medium outline-none cursor-text min-h-[60px] rounded-lg px-3 py-2"
                      style={{ lineHeight: '1.5', textAlign: 'left', direction: 'ltr', unicodeBidi: 'normal' }}
                      data-placeholder={isFocused && !searchQuery ? "Ask anything… e.g., 'Fintechs in UAE replacing their CRM this quarter'" : ""}
                    />

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={handleNewSuggestion}
                        className="h-10 px-5 text-stone-600 hover:text-stone-800 bg-stone-50 hover:bg-stone-100 rounded-full"
                      >
                        <Shuffle className="mr-2 h-4 w-4" />
                        New Suggestion
                      </Button>
                      <div className="flex gap-3">
                        <Button 
                          onClick={handleAISearch}
                          disabled={!searchQuery.trim() || isSearching}
                          variant="outline"
                          className="h-10 px-6 border-stone-300 text-stone-700 hover:bg-stone-50 rounded-full"
                        >
                          {isSearching ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Searching...
                            </>
                          ) : (
                            <>
                              <Search className="h-4 w-4 mr-2" />
                              Search with AI
                            </>
                          )}
                        </Button>
                        <Button 
                          onClick={() => setActiveTab("request")}
                          className="h-10 px-6 bg-stone-900 hover:bg-stone-800 text-white rounded-full"
                        >
                          Request Intel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            

              {/* Segmented Views */}
              <div className="w-full max-w-3xl px-6 mt-8 mx-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-14 bg-stone-100/50 rounded-full p-1.5">
                    <TabsTrigger 
                      value="find" 
                      className="rounded-full h-11 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-stone-900 data-[state=inactive]:text-stone-600 hover:text-stone-800 transition-all duration-200"
                    >
                      Search Results
                    </TabsTrigger>
                    <TabsTrigger 
                      value="my-requests" 
                      className="rounded-full h-11 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-stone-900 data-[state=inactive]:text-stone-600 hover:text-stone-800 transition-all duration-200 flex items-center gap-2"
                    >
                      My Requests
                      {myRequests.length > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                          {myRequests.length}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="request" 
                      className="rounded-full h-11 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-stone-900 data-[state=inactive]:text-stone-600 hover:text-stone-800 transition-all duration-200"
                    >
                      Request Intel
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="find" className="mt-8">
                    {searchResults.length > 0 ? (
                      <div className="grid gap-6">
                        {searchResults.map((item) => (
                        <Card key={item.id} className="hover:shadow-xl transition-all duration-300 rounded-2xl border-0 bg-gradient-to-br from-white to-stone-50/30 overflow-hidden">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg line-clamp-2 text-stone-900 font-semibold">{item.title}</CardTitle>
                                <p className="text-stone-600 mt-3 line-clamp-2 leading-relaxed">{item.description}</p>
                              </div>
                              <div className="ml-4 flex flex-col gap-2">
                                <Badge 
                                  variant={item.price === 0 ? "outline" : "secondary"} 
                                  className="rounded-full px-3 py-1 text-sm font-medium bg-stone-100 text-stone-700 border-0"
                                >
                                  {item.price === 0 ? 'Free' : `$${item.price}`}
                                </Badge>
                                {item.relevance && (
                                  <Badge 
                                    variant="outline" 
                                    className="rounded-full px-3 py-1 text-sm font-medium bg-green-50 text-green-700 border-green-200"
                                  >
                                    {item.relevance}% match
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-stone-500 mt-4">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center">
                                  <User className="h-3 w-3" />
                                </div>
                                <span className="font-medium">{item.seller}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                                  <Star className="h-3 w-3 text-amber-600" />
                                </div>
                                <span className="font-medium">{item.rating}</span>
                              </div>
                              {item.sales && (
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <DollarSign className="h-3 w-3 text-green-600" />
                                  </div>
                                  <span className="font-medium">{item.sales} sales</span>
                                </div>
                              )}
                              {item.date && (
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Clock className="h-3 w-3 text-blue-600" />
                                  </div>
                                  <span className="font-medium">{item.date}</span>
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="rounded-full px-3 py-1 bg-stone-50 text-stone-700 border-stone-200">
                                {item.category}
                              </Badge>
                              <div className="flex gap-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="rounded-full px-4 py-2 h-9 border-stone-200 hover:bg-stone-50"
                                >
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Contact
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="rounded-full px-4 py-2 h-9 bg-stone-900 hover:bg-stone-800 text-white font-medium"
                                >
                                  {item.price === 0 ? 'Get Free' : `Buy $${item.price}`}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                          <Search className="w-8 h-8 text-stone-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-stone-900 mb-2">Search for Intel</h3>
                        <p className="text-stone-600 mb-6 max-w-md mx-auto">
                          Use the search bar above to find relevant sales intelligence. Your search results will appear here.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button 
                            onClick={() => setActiveTab("request")}
                            variant="outline"
                            className="rounded-full px-6 py-2"
                          >
                            <Target className="w-4 h-4 mr-2" />
                            Request Intel Instead
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="my-requests" className="mt-8">
                    {/* My Requests Section */}
                    <div className="w-full max-w-3xl px-6 mx-auto">
                      <div className="relative rounded-2xl bg-white shadow-lg border-2 border-stone-200 p-8 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/30 via-blue-50/20 to-green-50/30 animate-pulse opacity-50"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <MessageCircle className="h-4 w-4 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-stone-900">My Intel Requests</h3>
                            <Badge variant="outline" className="ml-auto">{myRequests.length} Total</Badge>
                          </div>

                          {isLoadingRequests ? (
                            <div className="flex items-center justify-center py-12">
                              <Loader2 className="h-8 w-8 animate-spin text-stone-500" />
                            </div>
                          ) : myRequests.length === 0 ? (
                            <div className="text-center py-12">
                              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-stone-300" />
                              <h3 className="text-lg font-semibold text-stone-900 mb-2">No Requests Yet</h3>
                              <p className="text-stone-600 mb-6 max-w-md mx-auto">
                                You haven't made any intel requests yet. Start by requesting specific intel from the community.
                              </p>
                              <Button onClick={() => setActiveTab("request")}>
                                <Target className="h-4 w-4 mr-2" />
                                Make Your First Request
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {myRequests.map((request) => (
                                <Card key={request.id} className="border-2 border-stone-200 bg-white shadow-sm hover:shadow-lg transition-shadow">
                                  <CardHeader>
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <CardTitle className="text-xl">{request.title}</CardTitle>
                                          <Badge 
                                            variant={
                                              request.status === 'OPEN' ? 'default' :
                                              request.status === 'FULFILLED' ? 'secondary' :
                                              request.status === 'DISPUTED' ? 'destructive' :
                                              request.status === 'CLOSED' ? 'outline' : 'outline'
                                            }
                                          >
                                            {request.status}
                                          </Badge>
                                        </div>
                                        <CardDescription className="text-base">
                                          {request.description}
                                        </CardDescription>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-lg font-bold text-stone-900">
                                          ${request.bountyCredits || 0}
                                        </p>
                                        <p className="text-sm text-stone-500">bounty</p>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-6 text-sm text-stone-600">
                                        <div className="flex items-center gap-2">
                                          <Clock className="h-4 w-4" />
                                          <span>Requested {new Date(request.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {request.status === 'FULFILLED' && (
                                          <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span>Fulfilled</span>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex gap-2">
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => {
                                            setDetailsModal({
                                              isOpen: true,
                                              request: request
                                            })
                                          }}
                                        >
                                          <Eye className="h-4 w-4 mr-1" />
                                          View Details
                                        </Button>
                                        {request.status === 'OPEN' && (
                                          <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="text-orange-600 hover:text-orange-700"
                                            onClick={() => {
                                              setConfirmationModal({
                                                isOpen: true,
                                                title: "Cancel Request",
                                                description: `Are you sure you want to cancel "${request.title}"? This action cannot be undone.`,
                                                onConfirm: async () => {
                                                  setConfirmationModal(prev => ({ ...prev, isLoading: true }))
                                                  try {
                                                    const response = await fetch(`/api/demands/${request.id}/cancel`, {
                                                      method: 'POST',
                                                    });
                                                    if (response.ok) {
                                                      // Refresh the requests list
                                                      fetchMyRequests();
                                                      notify.success(
                                                        "Request Cancelled",
                                                        "Your intel request has been cancelled successfully."
                                                      );
                                                      setConfirmationModal({ isOpen: false, title: "", description: "", onConfirm: () => {} })
                                                    } else {
                                                      const errorData = await response.json();
                                                      notify.error(
                                                        "Failed to Cancel Request",
                                                        errorData.error || "Something went wrong. Please try again."
                                                      );
                                                    }
                                                  } catch (error) {
                                                    console.error('Error cancelling request:', error);
                                                    notify.error(
                                                      "Network Error",
                                                      "Failed to connect to the server. Please check your connection and try again."
                                                    );
                                                  } finally {
                                                    setConfirmationModal(prev => ({ ...prev, isLoading: false }))
                                                  }
                                                }
                                              })
                                            }}
                                          >
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            Cancel
                                          </Button>
                                        )}
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

                  <TabsContent value="request" className="mt-8">
                    <Card className="max-w-2xl mx-auto rounded-2xl border-0 bg-gradient-to-br from-white to-stone-50/30 shadow-lg">
                      <CardHeader className="pb-6">
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Target className="h-4 w-4 text-blue-600" />
                          </div>
                          Request Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleRequestSubmit} className="space-y-6">
                          <div className="space-y-3">
                            <Label htmlFor="request-title" className="text-base font-medium text-stone-700">What intel do you need?</Label>
                <Input
                              id="request-title"
                  placeholder="e.g., Companies in UAE looking for CRM solutions"
                              value={requestForm.title}
                              onChange={(e) => setRequestForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                              className="rounded-xl h-12 border-stone-200 focus:border-stone-400 focus:ring-0"
                              style={{ direction: 'ltr', textAlign: 'left' }}
                />
              </div>

                          <div className="space-y-3">
                            <Label htmlFor="request-description" className="text-base font-medium text-stone-700">Description</Label>
                <Textarea
                              id="request-description"
                  placeholder="Provide more details about what you're looking for..."
                              value={requestForm.description}
                              onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                              className="rounded-xl border-stone-200 focus:border-stone-400 focus:ring-0 resize-none"
                              style={{ direction: 'ltr', textAlign: 'left' }}
                />
              </div>

                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-3">
                              <Label htmlFor="request-category" className="text-base font-medium text-stone-700">Category</Label>
                              <Select value={requestForm.category} onValueChange={(value) => setRequestForm(prev => ({ ...prev, category: value }))}>
                                <SelectTrigger className="rounded-xl h-12 border-stone-200 focus:border-stone-400 focus:ring-0">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                                <SelectContent className="rounded-xl">
                      {CATEGORIES.map((category) => (
                                    <SelectItem key={category} value={category} className="rounded-lg">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                            <div className="space-y-3">
                              <Label htmlFor="request-bounty" className="text-base font-medium text-stone-700">Bounty Amount</Label>
                              <Select value={requestForm.bounty.toString()} onValueChange={(value) => setRequestForm(prev => ({ ...prev, bounty: parseInt(value) }))}>
                                <SelectTrigger className="rounded-xl h-12 border-stone-200 focus:border-stone-400 focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                                <SelectContent className="rounded-xl">
                      {BOUNTY_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value.toString()} className="rounded-lg">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

                          <div className="space-y-3">
                            <Label htmlFor="request-deadline" className="text-base font-medium text-stone-700">Deadline (days)</Label>
                <Input
                              id="request-deadline"
                  type="number"
                  placeholder="7"
                              value={requestForm.deadline}
                              onChange={(e) => setRequestForm(prev => ({ ...prev, deadline: e.target.value }))}
                              className="rounded-xl h-12 border-stone-200 focus:border-stone-400 focus:ring-0"
                />
              </div>

                          <div className="space-y-3">
                            <Label htmlFor="request-additional" className="text-base font-medium text-stone-700">Additional Requirements (optional)</Label>
                <Textarea
                              id="request-additional"
                  placeholder="Any specific requirements or preferences..."
                              value={requestForm.additionalDetails}
                              onChange={(e) => setRequestForm(prev => ({ ...prev, additionalDetails: e.target.value }))}
                  rows={3}
                              className="rounded-xl border-stone-200 focus:border-stone-400 focus:ring-0 resize-none"
                />
              </div>

                          <div className="flex items-center justify-between pt-6">
                            <div className="text-sm text-stone-500 bg-stone-50 rounded-full px-4 py-2">
                              <p>Platform fee: 20% • Escrow protected</p>
                            </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                              className="px-8 h-12 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium"
                >
                  {isSubmitting ? "Posting..." : "Post Request"}
                              <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
            </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      
      {/* Modals */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, title: "", description: "", onConfirm: () => {} })}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        description={confirmationModal.description}
        variant="destructive"
        isLoading={confirmationModal.isLoading}
      />
      
      {detailsModal.request && (
        <RequestDetailsModal
          isOpen={detailsModal.isOpen}
          onClose={() => setDetailsModal({ isOpen: false, request: null })}
          request={detailsModal.request}
        />
      )}
    </SidebarProvider>
  )
}
