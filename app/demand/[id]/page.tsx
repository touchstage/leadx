import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, User, Tag } from "lucide-react";

interface DemandPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DemandPage({ params }: DemandPageProps) {
  const { id } = await params;
  const demand = await prisma.demand.findUnique({
    where: { id },
    include: {
      buyer: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!demand) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-900 mb-2">{demand.title}</h1>
          <p className="text-lg text-stone-600">Posted by {demand.buyer.name || demand.buyer.email}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-stone-700 leading-relaxed">{demand.description}</p>
              </CardContent>
            </Card>

            {demand.additionalDetails && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-700 leading-relaxed">{demand.additionalDetails}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Demand Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-stone-500" />
                  <div>
                    <p className="text-sm text-stone-500">Bounty</p>
                    <p className="font-semibold text-lg">${demand.bountyCredits}</p>
                  </div>
                </div>

                {demand.deadline && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-stone-500" />
                    <div>
                      <p className="text-sm text-stone-500">Deadline</p>
                      <p className="font-semibold">{demand.deadline} days</p>
                    </div>
                  </div>
                )}

                {demand.category && (
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-stone-500" />
                    <div>
                      <p className="text-sm text-stone-500">Category</p>
                      <Badge variant="secondary">{demand.category}</Badge>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-stone-500" />
                  <div>
                    <p className="text-sm text-stone-500">Status</p>
                    <Badge variant={demand.status === "OPEN" ? "default" : "secondary"}>
                      {demand.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-stone-600 mb-4">
                  This demand is currently open for fulfillment. Sellers can submit their intel to fulfill this request.
                </p>
                <div className="space-y-2">
                  <button className="w-full bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors">
                    Submit Fulfillment
                  </button>
                  <button className="w-full border border-stone-300 text-stone-700 px-4 py-2 rounded-lg hover:bg-stone-50 transition-colors">
                    Share Demand
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}