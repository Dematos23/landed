"use client"

import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  GripVertical,
  Plus,
  Layers,
  Settings,
  Eye,
  Tablet,
  Smartphone,
  Monitor,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const HeroPreview = () => (
  <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Your Amazing Product</h1>
    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">A compelling tagline that captures attention and explains the core benefit.</p>
    <div className="flex justify-center gap-4">
      <Button size="lg" className="bg-primary hover:bg-primary/90">Get Started</Button>
      <Button size="lg" variant="outline">Learn More</Button>
    </div>
  </div>
);

const FeaturesPreview = () => (
  <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
     <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Features</h2>
     <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mx-auto mb-4">
                <Layers className="h-6 w-6"/>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Feature One</h3>
            <p className="text-gray-600 dark:text-gray-300">Briefly describe a key feature and its benefit.</p>
        </div>
         <div className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mx-auto mb-4">
                <Settings className="h-6 w-6"/>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Feature Two</h3>
            <p className="text-gray-600 dark:text-gray-300">Briefly describe a key feature and its benefit.</p>
        </div>
         <div className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mx-auto mb-4">
                <Eye className="h-6 w-6"/>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Feature Three</h3>
            <p className="text-gray-600 dark:text-gray-300">Briefly describe a key feature and its benefit.</p>
        </div>
     </div>
  </div>
);


export default function DesignerPage({ params }: { params: { pageId: string } }) {
  const isNew = params.pageId === 'new';

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 sticky top-0 z-40">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="flex-1 text-lg font-semibold truncate">
          {isNew ? "New Landing Page" : "Editing: Acme Inc. Launch"}
        </h1>
        <div className="hidden md:flex items-center gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon"><Monitor className="h-4 w-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Desktop</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon"><Tablet className="h-4 w-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Tablet</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon"><Smartphone className="h-4 w-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Mobile</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
        <Separator orientation="vertical" className="h-8 hidden md:block" />
        <div className="flex items-center gap-2">
          <Button variant="outline">Save Draft</Button>
          <Button>Publish</Button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r bg-card hidden md:flex flex-col">
          <Card className="border-none rounded-none">
            <CardHeader>
              <CardTitle>Components</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {["Hero Section", "Features", "CTA", "Testimonials", "FAQ", "Footer"].map(
                (component) => (
                  <Button
                    key={component}
                    variant="ghost"
                    className="justify-start gap-2"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    {component}
                  </Button>
                )
              )}
            </CardContent>
          </Card>
        </aside>
        <main className="flex-1 overflow-auto bg-muted/40">
          <div className="mx-auto max-w-5xl my-8 space-y-4 p-4">
            <HeroPreview />
            <FeaturesPreview />
            <div className="flex justify-center">
              <Button variant="outline" className="rounded-full">
                <Plus className="mr-2 h-4 w-4" /> Add Section
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
