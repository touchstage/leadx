"use client";

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, Settings, Command } from "lucide-react"
import { useUser, SignOutButton } from "@clerk/nextjs"
import Link from "next/link"
import { NotificationCenter } from "@/components/notification-center"
import { useSpotlight } from "@/hooks/use-spotlight"

export function SiteHeader() {
  const { user, isLoaded } = useUser();
  const { openSpotlight } = useSpotlight();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={openSpotlight}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          </Button>
          <NotificationCenter />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
          <Separator orientation="vertical" className="mx-2 h-4" />
          {isLoaded && user ? (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {user.fullName || user.emailAddresses[0]?.emailAddress}
              </Badge>
              <SignOutButton>
                <Button variant="ghost" size="sm">
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          ) : isLoaded ? (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          ) : (
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          )}
        </div>
      </div>
    </header>
  )
}
