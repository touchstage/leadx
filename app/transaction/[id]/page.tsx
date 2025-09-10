"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  DollarSign,
  User,
  Calendar,
  FileText,
  Send,
  RefreshCw
} from "lucide-react"

interface Transaction {
  id: string
  creditsSpent: number
  platformFee: number
  status: string
  createdAt: string
  buyer: {
    id: string
    name: string
    image: string
    reputationScore: number
  }
  seller: {
    id: string
    name: string
    image: string
    reputationScore: number
  }
  intel: {
    id: string
    title: string
    description: string
    category: string
  }
  isBuyer: boolean
  isSeller: boolean
  canProvideUpdate: boolean
  canStartConversation: boolean
  canRefund: boolean
  latestUpdate: any
  latestMessage: any
  conversationId: string
}

export default function TransactionDetailsPage() {
  const params = useParams()
  const transactionId = params.id as string
  
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Update form state
  const [updateForm, setUpdateForm] = useState({
    title: '',
    content: ''
  })
  
  // Message form state
  const [messageForm, setMessageForm] = useState({
    content: ''
  })
  
  // Conversation and updates state
  const [conversation, setConversation] = useState<any>(null)
  const [updates, setUpdates] = useState<any[]>([])

  useEffect(() => {
    fetchTransactionDetails()
  }, [transactionId])

  const fetchTransactionDetails = async () => {
    try {
      const response = await fetch(`/api/transactions/manage?type=all`)
      const data = await response.json()
      
      const foundTransaction = data.transactions.find((t: Transaction) => t.id === transactionId)
      if (foundTransaction) {
        setTransaction(foundTransaction)
        
        // Fetch conversation and updates if available
        if (foundTransaction.conversationId) {
          fetchConversation(foundTransaction.conversationId)
        }
        fetchUpdates(transactionId)
      }
    } catch (error) {
      console.error('Error fetching transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations?transactionId=${transactionId}`)
      const data = await response.json()
      setConversation(data.conversation)
    } catch (error) {
      console.error('Error fetching conversation:', error)
    }
  }

  const fetchUpdates = async (transactionId: string) => {
    try {
      const response = await fetch(`/api/intel/updates?transactionId=${transactionId}`)
      const data = await response.json()
      setUpdates(data.updates)
    } catch (error) {
      console.error('Error fetching updates:', error)
    }
  }

  const handleReleaseFunds = async () => {
    try {
      const response = await fetch('/api/transactions/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId,
          action: 'release'
        })
      })
      
      if (response.ok) {
        fetchTransactionDetails()
      }
    } catch (error) {
      console.error('Error releasing funds:', error)
    }
  }

  const handleRefund = async () => {
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId,
          reason: 'Customer requested refund'
        })
      })
      
      if (response.ok) {
        fetchTransactionDetails()
      }
    } catch (error) {
      console.error('Error processing refund:', error)
    }
  }

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/intel/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId,
          ...updateForm
        })
      })
      
      if (response.ok) {
        setUpdateForm({ title: '', content: '' })
        fetchUpdates(transactionId)
      }
    } catch (error) {
      console.error('Error submitting update:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId,
          ...messageForm
        })
      })
      
      if (response.ok) {
        setMessageForm({ content: '' })
        if (conversation) {
          fetchConversation(conversation.id)
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ESCROW':
        return <Clock className="h-4 w-4" />
      case 'RELEASED':
        return <CheckCircle className="h-4 w-4" />
      case 'REFUNDED':
        return <RefreshCw className="h-4 w-4" />
      case 'DISPUTED':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ESCROW':
        return 'bg-yellow-100 text-yellow-800'
      case 'RELEASED':
        return 'bg-green-100 text-green-800'
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800'
      case 'DISPUTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900 mx-auto"></div>
              <p className="mt-2 text-stone-600">Loading transaction details...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (!transaction) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-stone-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-stone-900 mb-2">Transaction Not Found</h2>
              <p className="text-stone-600">The transaction you're looking for doesn't exist or you don't have access to it.</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Header */}
              <div className="px-4 lg:px-6">
                <div className="max-w-4xl mx-auto mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-4xl font-bold text-stone-900">Transaction Details</h1>
                      <p className="text-lg text-stone-600 mt-2">Manage your transaction and communication</p>
                    </div>
                    <Badge className={`${getStatusColor(transaction.status)} flex items-center gap-1`}>
                      {getStatusIcon(transaction.status)}
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Transaction Overview */}
              <div className="px-4 lg:px-6">
                <div className="max-w-4xl mx-auto">
                  <Card className="border-2 border-stone-200 bg-white shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Transaction Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Intel Title</Label>
                          <p className="font-medium">{transaction.intel.title}</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Badge variant="outline">{transaction.intel.category}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Amount Paid</Label>
                          <p className="text-2xl font-bold text-stone-900">{transaction.creditsSpent} credits</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Platform Fee</Label>
                          <p className="text-lg text-stone-600">{transaction.platformFee} credits</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Seller Earnings</Label>
                          <p className="text-lg font-semibold text-green-600">{transaction.creditsSpent - transaction.platformFee} credits</p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Buyer</Label>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{transaction.buyer.name}</span>
                            <Badge variant="outline">Rep: {transaction.buyer.reputationScore}</Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Seller</Label>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{transaction.seller.name}</span>
                            <Badge variant="outline">Rep: {transaction.seller.reputationScore}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Transaction Date</Label>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t">
                        {transaction.isSeller && transaction.status === 'ESCROW' && (
                          <Button onClick={handleReleaseFunds} className="bg-green-600 hover:bg-green-700">
                            Release Funds
                          </Button>
                        )}
                        {transaction.canRefund && (
                          <Button onClick={handleRefund} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                            Request Refund
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Tabs for Updates and Conversation */}
              <div className="px-4 lg:px-6">
                <div className="max-w-4xl mx-auto">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="updates">Updates</TabsTrigger>
                      <TabsTrigger value="conversation">Conversation</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="updates" className="space-y-4">
                      <Card className="border-2 border-stone-200 bg-white shadow-lg">
                        <CardHeader>
                          <CardTitle>Intel Updates</CardTitle>
                          <CardDescription>
                            {transaction.canProvideUpdate 
                              ? "Provide updates about the intel you sold"
                              : "Updates will be available 5 days after purchase"
                            }
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {transaction.canProvideUpdate && (
                            <form onSubmit={handleSubmitUpdate} className="space-y-4 mb-6">
                              <div className="space-y-2">
                                <Label htmlFor="update-title">Update Title</Label>
                                <Input
                                  id="update-title"
                                  value={updateForm.title}
                                  onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                                  placeholder="Brief title for the update"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="update-content">Update Content</Label>
                                <Textarea
                                  id="update-content"
                                  value={updateForm.content}
                                  onChange={(e) => setUpdateForm({ ...updateForm, content: e.target.value })}
                                  placeholder="Provide additional information or updates about the intel..."
                                  rows={4}
                                />
                              </div>
                              <Button type="submit" className="bg-stone-900 hover:bg-stone-800">
                                Submit Update
                              </Button>
                            </form>
                          )}
                          
                          <div className="space-y-4">
                            {updates.length === 0 ? (
                              <p className="text-stone-500 text-center py-8">No updates available yet</p>
                            ) : (
                              updates.map((update) => (
                                <div key={update.id} className="border rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold">{update.title}</h4>
                                    <span className="text-sm text-stone-500">
                                      {new Date(update.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-stone-700">{update.content}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="conversation" className="space-y-4">
                      <Card className="border-2 border-stone-200 bg-white shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            Conversation
                          </CardTitle>
                          <CardDescription>
                            Communicate with the other party about this transaction
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {transaction.canStartConversation && (
                            <form onSubmit={handleSendMessage} className="space-y-4 mb-6">
                              <div className="space-y-2">
                                <Label htmlFor="message-content">Message</Label>
                                <Textarea
                                  id="message-content"
                                  value={messageForm.content}
                                  onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                                  placeholder="Type your message here..."
                                  rows={3}
                                />
                              </div>
                              <Button type="submit" className="bg-stone-900 hover:bg-stone-800">
                                <Send className="h-4 w-4 mr-2" />
                                Send Message
                              </Button>
                            </form>
                          )}
                          
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {conversation?.messages?.length === 0 ? (
                              <p className="text-stone-500 text-center py-8">No messages yet</p>
                            ) : (
                              conversation?.messages?.map((message: any) => (
                                <div key={message.id} className={`flex ${message.senderId === transaction.buyer.id ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                    message.senderId === transaction.buyer.id 
                                      ? 'bg-stone-900 text-white' 
                                      : 'bg-stone-100 text-stone-900'
                                  }`}>
                                    <p className="text-sm">{message.content}</p>
                                    <p className={`text-xs mt-1 ${
                                      message.senderId === transaction.buyer.id 
                                        ? 'text-stone-300' 
                                        : 'text-stone-500'
                                    }`}>
                                      {new Date(message.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </CardContent>
                      </Card>
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
