"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CafeForm } from "./cafe-form"
import { mockCafes } from "@/lib/data/cafes"
import type { Cafe } from "@/lib/types"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Star, MapPin, Clock, Filter } from "lucide-react"
import { isOpenNow, getPriceLevelSymbol } from "@/lib/utils/cafe-utils"

export function CafeManagement() {
  const [cafes, setCafes] = useState<Cafe[]>(mockCafes)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const filteredCafes = cafes.filter(
    (cafe) =>
      cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cafe.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddCafe = () => {
    setSelectedCafe(null)
    setIsEditing(false)
    setIsFormOpen(true)
  }

  const handleEditCafe = (cafe: Cafe) => {
    setSelectedCafe(cafe)
    setIsEditing(true)
    setIsFormOpen(true)
  }

  const handleDeleteCafe = (cafeId: string) => {
    setCafes(cafes.filter((cafe) => cafe.id !== cafeId))
  }

  const handleSaveCafe = (cafeData: Partial<Cafe>) => {
    if (isEditing && selectedCafe) {
      setCafes(cafes.map((cafe) => (cafe.id === selectedCafe.id ? { ...cafe, ...cafeData } : cafe)))
    } else {
      const newCafe: Cafe = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rating: 0,
        reviewCount: 0,
        ...cafeData,
      } as Cafe
      setCafes([...cafes, newCafe])
    }
    setIsFormOpen(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Café Management</h1>
          <p className="text-muted-foreground">Manage your study cafés and their information.</p>
        </div>
        <Button onClick={handleAddCafe}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Café
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Cafés</p>
                <p className="text-2xl font-bold">{cafes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Clock className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open Now</p>
                <p className="text-2xl font-bold">{cafes.filter((cafe) => isOpenNow(cafe.hours)).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {(cafes.reduce((sum, cafe) => sum + cafe.rating, 0) / cafes.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Eye className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Study Friendly</p>
                <p className="text-2xl font-bold">{cafes.filter((cafe) => cafe.studyFriendly).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cafés..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Cafés Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Cafés ({filteredCafes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Study Friendly</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCafes.map((cafe) => (
                <TableRow key={cafe.id}>
                  <TableCell className="font-medium">{cafe.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">{cafe.address}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{cafe.rating}</span>
                      <span className="text-muted-foreground">({cafe.reviewCount})</span>
                    </div>
                  </TableCell>
                  <TableCell>{getPriceLevelSymbol(cafe.priceLevel)}</TableCell>
                  <TableCell>
                    <Badge variant={isOpenNow(cafe.hours) ? "default" : "secondary"}>
                      {isOpenNow(cafe.hours) ? "Open" : "Closed"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={cafe.studyFriendly ? "default" : "outline"}>
                      {cafe.studyFriendly ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(`/cafe/${cafe.id}`, "_blank")}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditCafe(cafe)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteCafe(cafe.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Café Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Café" : "Add New Café"}</DialogTitle>
          </DialogHeader>
          <CafeForm cafe={selectedCafe} onSave={handleSaveCafe} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
