import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, User, Clock, FileText } from "lucide-react"

interface RequestDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  request: {
    id: string
    title: string
    description: string
    status: string
    bountyCredits: number
    deadline: number
    createdAt: string
    category?: string
  }
}

export function RequestDetailsModal({
  isOpen,
  onClose,
  request
}: RequestDetailsModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-800'
      case 'FULFILLED': return 'bg-blue-100 text-blue-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'DISPUTED': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex-1">{request.title}</span>
            <Badge className={getStatusColor(request.status)}>
              {request.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Request details and information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Description */}
          <div>
            <h4 className="font-medium text-stone-900 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Description
            </h4>
            <p className="text-stone-600 text-sm leading-relaxed">
              {request.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium">Bounty:</span>
                <span className="text-green-600 font-semibold">
                  {request.bountyCredits} credits
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="font-medium">Deadline:</span>
                <span className="text-stone-600">
                  {request.deadline > 0 ? `${request.deadline} days` : 'No deadline'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Created:</span>
                <span className="text-stone-600">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {request.category && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Category:</span>
                  <span className="text-stone-600">{request.category}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Information */}
          <div className="bg-stone-50 rounded-lg p-4">
            <h4 className="font-medium text-stone-900 mb-2">Status Information</h4>
            <p className="text-sm text-stone-600">
              {request.status === 'OPEN' && "This request is currently open and accepting fulfillments."}
              {request.status === 'FULFILLED' && "This request has been fulfilled and is no longer accepting new submissions."}
              {request.status === 'CANCELLED' && "This request has been cancelled by the requester."}
              {request.status === 'DISPUTED' && "This request is currently under dispute and being reviewed."}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
