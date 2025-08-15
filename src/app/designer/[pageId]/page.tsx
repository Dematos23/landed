
"use client"

import React, { useState, useRef } from 'react';
import Link from "next/link"
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
  Trash2,
  Star,
  ChevronDown,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from '@/lib/utils';

// --- Component Previews ---

const HeroPreview = () => (
  <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center pointer-events-none">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Your Amazing Product</h1>
    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">A compelling tagline that captures attention and explains the core benefit.</p>
    <div className="flex justify-center gap-4">
      <Button size="lg" className="bg-primary hover:bg-primary/90">Get Started</Button>
      <Button size="lg" variant="outline">Learn More</Button>
    </div>
  </div>
);

const FeaturesPreview = () => (
  <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 pointer-events-none">
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

const CtaPreview = () => (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 pointer-events-none">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Ready to Dive In?</h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Start your free trial today. No credit card required.</p>
            <Button size="lg" className="mt-6 bg-primary hover:bg-primary/90">
                Sign Up Now
            </Button>
        </div>
    </div>
);

const TestimonialsPreview = () => (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 pointer-events-none">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">What Our Customers Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-primary/5 dark:bg-gray-700 p-6 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300 italic">"This product has changed my life. I can't imagine working without it anymore."</p>
                <div className="flex items-center mt-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 mr-4"></div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Jane Doe</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">CEO, Acme Inc.</p>
                    </div>
                </div>
            </div>
            <div className="bg-primary/5 dark:bg-gray-700 p-6 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300 italic">"A must-have for any serious professional. The support is also top-notch!"</p>
                 <div className="flex items-center mt-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 mr-4"></div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">John Smith</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Lead Developer, Innovate Corp.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const FaqPreview = () => (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 pointer-events-none">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
            <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">What is the refund policy?</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">We offer a 30-day money-back guarantee, no questions asked.</p>
            </div>
            <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Can I upgrade my plan later?</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Yes, you can upgrade, downgrade, or cancel your plan at any time from your account dashboard.</p>
            </div>
            <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Is there a student discount?</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">We currently do not offer student discounts, but we have affordable plans for everyone.</p>
            </div>
        </div>
    </div>
);

const FooterPreview = () => (
    <div className="w-full bg-gray-900 text-white rounded-lg shadow-md p-8 pointer-events-none">
        <div className="flex justify-between items-center">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
            <div className="flex space-x-4">
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Terms of Service</a>
            </div>
        </div>
    </div>
);


// Map component names to their actual components
const componentMap: { [key: string]: React.ComponentType } = {
  'Hero Section': HeroPreview,
  'Features': FeaturesPreview,
  'CTA': CtaPreview,
  'Testimonials': TestimonialsPreview,
  'FAQ': FaqPreview,
  'Footer': FooterPreview,
};

const initialComponents = [
    { id: 1, name: 'Hero Section' },
    { id: 2, name: 'Features' },
]

type Component = {
    id: number;
    name: string;
}

export default function DesignerPage({ params }: { params: { pageId: string } }) {
  const isNew = params.pageId === 'new';
  const [components, setComponents] = useState<Component[]>(initialComponents);

  // Drag and drop state
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const addComponent = (componentName: string) => {
    const newComponent = {
      id: Date.now(),
      name: componentName,
    };
    setComponents(prev => [...prev, newComponent]);
  };
  
  const removeComponent = (id: number) => {
    setComponents(prev => prev.filter(c => c.id !== id));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
    // Visually indicate the drop zone
    const list = e.currentTarget.parentElement;
    if (list) {
        const children = Array.from(list.children);
        children.forEach(child => child.classList.remove('border-primary', 'border-2'));
        e.currentTarget.classList.add('border-primary', 'border-2');
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const list = e.currentTarget.parentElement;
    if (list) {
        Array.from(list.children).forEach(child => child.classList.remove('border-primary', 'border-2'));
    }

    if (dragItem.current === null || dragOverItem.current === null) return;
    
    const newComponents = [...components];
    const dragItemContent = newComponents.splice(dragItem.current, 1)[0];
    newComponents.splice(dragOverItem.current, 0, dragItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;
    
    setComponents(newComponents);
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
  }

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
                    onClick={() => addComponent(component)}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    {component}
                  </Button>
                )
              )}
            </CardContent>
          </Card>
        </aside>
        <main className="flex-1 overflow-auto bg-muted/40" onDrop={handleDrop}>
          <div className="mx-auto max-w-5xl my-8 space-y-4 p-4">
           {components.length > 0 ? (
               components.map((component, index) => {
                 const ComponentPreview = componentMap[component.name];
                 return (
                   ComponentPreview ? (
                    <div 
                        key={component.id} 
                        className="relative group rounded-lg transition-all"
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <ComponentPreview />
                        <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white cursor-move">
                                <GripVertical className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white">
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Esto eliminará permanentemente la sección.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => removeComponent(component.id)}>
                                        Eliminar
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                   ) : null
                 );
               })
            ) : (
                <div 
                    className="flex flex-col items-center justify-center text-center py-24 px-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700"
                    onDragOver={(e) => e.preventDefault()}
                >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Página Vacía</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Comienza a construir tu página agregando un componente desde el panel izquierdo.</p>
                </div>
            )}
            <div className="flex justify-center">
              <Button variant="outline" className="rounded-full" onClick={() => addComponent('Features')}>
                <Plus className="mr-2 h-4 w-4" /> Add Section
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
