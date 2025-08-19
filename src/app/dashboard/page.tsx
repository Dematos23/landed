
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle, MoreHorizontal, Pencil, ExternalLink, Trash2, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserLandings, deleteLandingPage } from "@/services/landings.client"
import { publishLanding, unpublishLanding } from "@/actions/landings"
import type { LandingPageData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
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
import { cn } from "@/lib/utils"

function SiteSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="flex items-center gap-4">
           <Skeleton className="h-8 w-24" />
           <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const [sites, setSites] = useState<LandingPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingPublish, setTogglingPublish] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSites = async () => {
    setLoading(true);
    const userSites = await getUserLandings();
    setSites(userSites);
    setLoading(false);
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleDelete = async (siteId: string) => {
    const success = await deleteLandingPage(siteId);
    if (success) {
      toast({
        title: "¡Sitio eliminado!",
        description: "Tu página de aterrizaje ha sido eliminada.",
      });
      fetchSites(); // Refresh the list
    } else {
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar el sitio. Inténtalo de nuevo.",
      });
    }
  }
  
  const handleTogglePublish = async (site: LandingPageData) => {
    setTogglingPublish(site.id);
    const action = site.isPublished ? unpublishLanding : publishLanding;
    const success = await action(site.id);
    
    if (success) {
      toast({
        title: `¡Éxito!`,
        description: `Tu sitio ha sido ${site.isPublished ? 'despublicado' : 'publicado'}.`,
      });
      await fetchSites();
    } else {
       toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo ${site.isPublished ? 'despublicar' : 'publicar'} el sitio. Inténtalo de nuevo.`,
      });
    }
    setTogglingPublish(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tus Sitios</h2>
          <p className="text-muted-foreground">
            Gestiona tus páginas de aterrizaje aquí.
          </p>
        </div>
        <Link href="/designer/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Nuevo Sitio
          </Button>
        </Link>
      </div>
      <div className="grid gap-4">
        {loading ? (
          <>
            <SiteSkeleton />
            <SiteSkeleton />
            <SiteSkeleton />
          </>
        ) : (
          sites.map((site) => (
            <Card key={site.id}>
               <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                         <span
                            className={cn(
                              "h-2.5 w-2.5 rounded-full",
                              site.isPublished ? "bg-green-500" : "bg-gray-400"
                            )}
                          />
                        <h3 className="font-semibold">{site.name}</h3>
                      </div>
                      <a href={`/p/${site.subdomain}`} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:underline">
                        {site.subdomain}.landed.co
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Button 
                        variant={site.isPublished ? "outline" : "default"} 
                        size="sm"
                        onClick={() => handleTogglePublish(site)}
                        disabled={togglingPublish === site.id}
                      >
                         {togglingPublish === site.id 
                            ? "Cargando..." 
                            : site.isPublished ? 'Detener' : 'Publicar'}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/designer/${site.id}`} className="flex items-center w-full cursor-pointer">
                              <Pencil className="mr-2 h-4 w-4" /> Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                             <a href={`/p/${site.subdomain}`} target="_blank" rel="noopener noreferrer" className="flex items-center w-full cursor-pointer">
                                <ExternalLink className="mr-2 h-4 w-4" /> Ver en vivo
                             </a>
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente el sitio <strong>{site.name}</strong>.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(site.id)} className="bg-red-600 hover:bg-red-700">
                                  Sí, eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </div>
               </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
