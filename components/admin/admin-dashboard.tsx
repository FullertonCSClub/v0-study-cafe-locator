"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { mockCafes, mockReviews } from "@/lib/data/cafes"
import { Coffee, MessageSquare, Users, TrendingUp, Star, AlertCircle } from "lucide-react"

export function AdminDashboard() {
  const totalCafes = mockCafes.length
  const totalReviews = mockReviews.length
  const averageRating = mockCafes.reduce((sum, cafe) => sum + cafe.rating, 0) / mockCafes.length
  const studyFriendlyCafes = mockCafes.filter((cafe) => cafe.studyFriendly).length

  const recentActivity = [
    {
      id: 1,
      type: "review",
      message: "New review for The Study Grind",
      time: "2 minutes ago",
      status: "new",
    },
    {
      id: 2,
      type: "cafe",
      message: "Café hours updated for Campus Corner Café",
      time: "1 hour ago",
      status: "updated",
    },
    {
      id: 3,
      type: "review",
      message: "Review flagged for inappropriate content",
      time: "3 hours ago",
      status: "flagged",
    },
    {
      id: 4,
      type: "cafe",
      message: "New café application submitted",
      time: "5 hours ago",
      status: "pending",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "review":
        return <MessageSquare className="h-4 w-4" />
      case "cafe":
        return <Coffee className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-green-500"
      case "updated":
        return "bg-blue-500"
      case "flagged":
        return "bg-red-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your study cafés.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Data</Button>
          <Button>Add New Café</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cafés</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCafes}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Friendly</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyFriendlyCafes}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((studyFriendlyCafes / totalCafes) * 100)}% of all cafés
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Cafés */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Cafés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCafes
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5)
                .map((cafe, index) => (
                  <div key={cafe.id} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{cafe.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{cafe.rating}</span>
                        <span>({cafe.reviewCount} reviews)</span>
                      </div>
                    </div>
                    {cafe.studyFriendly && (
                      <Badge variant="outline" className="text-xs">
                        Study Friendly
                      </Badge>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Coffee className="h-6 w-6" />
              <span>Add New Café</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <MessageSquare className="h-6 w-6" />
              <span>Moderate Reviews</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">API Response Time</span>
              <div className="flex items-center gap-2">
                <Progress value={85} className="w-20 h-2" />
                <span className="text-sm text-muted-foreground">120ms</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Performance</span>
              <div className="flex items-center gap-2">
                <Progress value={92} className="w-20 h-2" />
                <span className="text-sm text-muted-foreground">Excellent</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Search Index Status</span>
              <div className="flex items-center gap-2">
                <Progress value={100} className="w-20 h-2" />
                <span className="text-sm text-muted-foreground">Up to date</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
