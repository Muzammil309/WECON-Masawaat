"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Ticket, QrCode, Sparkles } from "lucide-react"
import Link from "next/link"

export function AttendeeDashboardStub() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Registered Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Events you are attending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Valid tickets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">Personalized for you</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Schedule</CardTitle>
            <CardDescription>Your personal agenda (coming soon)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild>
              <Link href="/events">Browse Events</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><QrCode className="h-4 w-4" /> Check‑in QR</CardTitle>
            <CardDescription>Show this at venue (coming soon)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-36 rounded-md bg-muted/50 border border-dashed grid place-items-center text-muted-foreground">QR placeholder</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Recommendations</CardTitle>
          <CardDescription>Suggested events & sessions (coming soon)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">We will surface tailored suggestions here.</div>
        </CardContent>
      </Card>
    </div>
  )
}

