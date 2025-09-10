"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export function DashboardRedirect() {
  const { user, isLoaded } = useUser();

  // Don't show anything while loading
  if (!isLoaded) {
    return null;
  }

  // Don't show anything if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <div className="bg-stone-900 text-white py-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-5 w-5" />
            <div>
              <p className="font-medium">Welcome back, {user.fullName || user.emailAddresses[0]?.emailAddress}!</p>
              <p className="text-sm text-stone-300">Access your dashboard to manage your intel and demands.</p>
            </div>
          </div>
          <Button asChild className="bg-white text-stone-900 hover:bg-stone-100">
            <Link href="/home">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
