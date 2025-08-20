
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle, MoreHorizontal, Pencil, ExternalLink, Trash2, Copy, Check, Loader2 } from "lucide-react"

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
  const [deletingSite, setDeletingSite] = useState<string | null>(null);
  const [copiedSite, setCopiedSite] = useState<string | null>(null);
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
    setDeletingSite(siteId);
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
    setDeletingSite(null);
  }
  
  const handleTogglePublish = async (site: LandingPageData) => {
    setTogglingPublish(site.id);
    try {
      if (site.isPublished) {
        const success = await unpublishLanding(site.id);
        if (success) {
          toast({ title: `¡Éxito!`, description: `Tu sitio ha sido despublicado.` });
          await fetchSites();
        } else {
          throw new Error("Error al despublicar");
        }
      } else {
        const result = await publishLanding(site.id);
        if (result.success) {
          toast({ title: `¡Éxito!`, description: `Tu sitio ha sido publicado.` });
          await fetchSites();
        } else if (result.needsSubdomain) {
           toast({
            variant: "destructive",
            title: "Falta subdominio",
            description: "Por favor, edita la página en el diseñador para configurar tu subdominio antes de publicar.",
          });
        } else {
           throw new Error(result.error || "Error al publicar");
        }
      }
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: error.message || `No se pudo cambiar el estado de publicación. Inténtalo de nuevo.`,
        });
    } finally {
        setTogglingPublish(null);
    }
  }
  
  const handleCopyLink = (site: LandingPageData) => {
    if (!site.publicUrl) {
      toast({ variant: "destructive", title: "Error", description: "Esta página no tiene una URL pública." });
      return;
    }
    navigator.clipboard.writeText(site.publicUrl);
    setCopiedSite(site.id);
    toast({
      title: "¡Enlace copiado!",
      description: "La URL de tu sitio se ha copiado al portapapeles.",
    });
    setTimeout(() => setCopiedSite(null), 2000);
  };


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
            <Card key={site.id} className={cn("relative", deletingSite === site.id && "opacity-50 pointer-events-none")}>
               {deletingSite === site.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
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
                      <a href={site.publicUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:underline">
                        {site.publicUrl ? site.publicUrl.replace('https://', '') : "Aún no publicado"}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Button 
                        variant={site.isPublished ? "outline" : "default"} 
                        size="sm"
                        onClick={() => handleTogglePublish(site)}
                        disabled={togglingPublish === site.id || deletingSite === site.id}
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
                            disabled={deletingSite === site.id}
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
                          {site.isPublished && site.publicUrl && (
                            <>
                              <DropdownMenuItem asChild>
                                 <a href={site.publicUrl} target="_blank" rel="noopener noreferrer" className="flex items-center w-full cursor-pointer">
                                    <ExternalLink className="mr-2 h-4 w-4" /> Ver en vivo
                                 </a>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCopyLink(site)} className="flex items-center w-full cursor-pointer">
                                {copiedSite === site.id ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                Copiar enlace
                              </DropdownMenuItem>
                            </>
                          )}
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
