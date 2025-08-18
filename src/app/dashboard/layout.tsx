"use client"
import Link from "next/link"
import {
  LayoutDashboard,
  Home,
  Settings,
  LifeBuoy,
  PanelLeft,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/icons"
import { UserNav } from "@/components/user-nav"
import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo className="w-7 h-7 text-primary" />
            <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">
              Landed
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard" isActive tooltip="Dashboard">
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 flex flex-col gap-4">
          <Separator />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Configuración">
                <Settings />
                Configuración
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Ayuda">
                <LifeBuoy />
                Ayuda
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <Separator />
          <UserNav />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 sm:p-6 bg-background/95">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
