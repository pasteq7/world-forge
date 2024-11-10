"use client"

import { Home, Network, Clock, Map, Settings, FileInput ,    } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  
} from "@/components/ui/sidebar"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { SettingsDialog } from "@/components/settings/settings-dialog"
import lotrData from "@/LOTRimport.json"
import { useWorldStore } from "@/store/world-store"

export function AppSidebar() {
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const navigationItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/",
    },
    {
      title: "Relationships",
      icon: Network,
      href: "/relationships",
    },
    {
      title: "Timeline",
      icon: Clock,
      href: "/timeline",
    },
    {
      title: "Map",
      icon: Map,
      href: "/map",
    },
  ]

  return (
    <>
      <Sidebar className="border-r bg-background/60 backdrop-blur-xl">
        <SidebarContent className="p-4">
          {/* Brand/Logo Section */}
          <div className="flex items-center gap-2 px-2 mb-6">
            <span className="font-semibold text-lg">WorldBuilder</span>
          </div>

          <SidebarGroup>
            <SidebarGroupContent className="space-y-1">
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="w-full px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors group"
                    >
                      <a href={item.href} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator className="my-6" />

          <SidebarGroup>
            <div className="px-2 mb-2">
              <span className="text-xs font-medium text-muted-foreground">Demo</span>
            </div>
            <SidebarGroupContent className="space-y-1">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => useWorldStore.getState().importWorld(JSON.stringify(lotrData))}
                    className="w-full px-2 py-2 rounded-lg border border-dashed border-primary/20 hover:border-primary hover:bg-primary/10 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <FileInput   className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Use Middle-earth Data</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator className="my-6" />

          <SidebarGroup>
            <SidebarGroupContent className="space-y-1">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setShowSettingsDialog(true)}
                    className="w-full px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium">Settings</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SettingsDialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog} />
    </>
  )
} 