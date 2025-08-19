
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { PlusCircle, MoreHorizontal, Pencil, ExternalLink, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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

function SiteSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="relative">
        <Skeleton className="aspect-video w-full rounded-md" />
      </CardHeader>
      <CardContent className="flex-1 pt-6">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardFooter>
    </Card>
  )
}

export default function DashboardPage() {
  const [sites, setSites] = useState<LandingPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSites = async () => {
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <>
            <SiteSkeleton />
            <SiteSkeleton />
            <SiteSkeleton />
            <SiteSkeleton />
          </>
        ) : (
          sites.map((site) => (
            <Card key={site.id} className="flex flex-col">
              <CardHeader className="relative p-0">
                 <div className="absolute right-2 top-2 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 bg-white/80 hover:bg-white"
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
                <Image
                  alt="Site preview"
                  className="aspect-video w-full rounded-t-lg object-cover"
                  data-ai-hint="website screenshot"
                  height="310"
                  src={"https://placehold.co/600x400.png"}
                  width="550"
                />
              </CardHeader>
              <CardContent className="flex-1 pt-6">
                <CardTitle className="text-lg">{site.name}</CardTitle>
                <CardDescription>{site.subdomain}.landed.co</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                <div>
                  <span>0 vistas</span>
                  <span className="mx-2">&#183;</span>
                  <span>0% conversión</span>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <a href={`https://${site.subdomain}.landed.co`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
