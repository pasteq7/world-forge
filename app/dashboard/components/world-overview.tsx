"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useWorldStore } from "@/store/world-store"
import { PieChart, Users, MapPin, Calendar, Package, Clock, Shield } from "lucide-react"
import { formatEntityType } from "@/lib/utils"
import { useWorldOverview } from "../hooks/useWorldOverview"

export function WorldOverview() {
  const entities = useWorldStore((state) => state.entities)
  const stats = useWorldOverview(entities)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          World Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{formatEntityType('character')}</span>
            </div>
            <span className="font-bold">{stats.character}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{formatEntityType('location')}</span>
            </div>
            <span className="font-bold">{stats.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>{formatEntityType('faction')}</span>
            </div>
            <span className="font-bold">{stats.faction}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span>{formatEntityType('item')}</span>
            </div>
            <span className="font-bold">{stats.item}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatEntityType('event')}</span>
            </div>
            <span className="font-bold">{stats.event}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatEntityType('timePeriod')}</span>
            </div>
            <span className="font-bold">{stats.timePeriod}</span>
          </div>
          

        </div>
      </CardContent>
    </Card>
  )
} 