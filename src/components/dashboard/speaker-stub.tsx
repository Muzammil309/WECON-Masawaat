"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, FileUp, BarChart3, Star } from "lucide-react"
import Link from "next/link"

export function SpeakerDashboardStub() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Materials Uploaded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Slides, PDFs, links</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Avg. interactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg. Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">Post-session feedback</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar className="h-4 w-4" /> My Sessions</CardTitle>
            <CardDescription>Manage upcoming and past sessions (coming soon)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild>
              <Link href="/speaker/sessions">View Sessions</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileUp className="h-4 w-4" /> Upload Materials</CardTitle>
            <CardDescription>Slides and resources (coming soon)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" asChild>
              <Link href="/speaker/materials">Manage Files</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Engagement & Feedback</CardTitle>
          <CardDescription>Metrics and ratings (coming soon)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">We will visualize engagement and feedback here.</div>
        </CardContent>
      </Card>
    </div>
  )
}

