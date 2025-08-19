
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Globe, Trash2, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Domain = {
  id: string
  name: string
  status: "verified" | "pending"
  addedAt: string
}

const initialDomains: Domain[] = [
  { id: "1", name: "mi-startup-genial.com", status: "verified", addedAt: "2023-10-26" },
  { id: "2", name: "otra-idea.co", status: "pending", addedAt: "2023-11-15" },
]

const A_RECORD_VALUE = "76.76.21.21";
const TXT_RECORD_VALUE = "landed-verification=a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8";


export default function SettingsPage() {
  const [domains, setDomains] = useState<Domain[]>(initialDomains)
  const [newDomain, setNewDomain] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifying, setIsVerifying] = useState<string | null>(null)
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);
  const { toast } = useToast()

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDomain) return
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newDomainEntry: Domain = {
        id: (domains.length + 1).toString(),
        name: newDomain,
        status: "pending",
        addedAt: new Date().toISOString().split("T")[0],
      }
      setDomains([...domains, newDomainEntry])
      setNewDomain("")
      setIsSubmitting(false)
      toast({
        title: "Dominio añadido",
        description: `El dominio ${newDomain} ha sido añadido y está pendiente de verificación.`,
      })
    }, 1000)
  }
  
  const handleVerifyDomain = (domainId: string) => {
    setIsVerifying(domainId);
    setTimeout(() => {
        setDomains(domains.map(d => d.id === domainId ? {...d, status: 'verified'} : d));
        setIsVerifying(null);
        toast({
            title: "¡Dominio verificado!",
            description: `El dominio ha sido verificado correctamente.`
        })
    }, 2000);
  }
  
  const handleCopyRecord = (value: string, type: 'A' | 'TXT') => {
    navigator.clipboard.writeText(value);
    setCopiedRecord(type);
    toast({
      title: "¡Registro copiado!",
      description: `El registro ${type} se ha copiado al portapapeles.`,
    });
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Gestiona la configuración de tu cuenta y tus dominios.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Añadir Dominio</CardTitle>
          <CardDescription>
            Añade un dominio personalizado para conectar a tus páginas de aterrizaje.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAddDomain}>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Label htmlFor="domain">Nombre de Dominio</Label>
                <Input
                  id="domain"
                  placeholder="ejemplo.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Añadiendo..." : "Añadir"}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dominios Personalizados</CardTitle>
          <CardDescription>
            Tus dominios verificados. Puedes asignarlos a cualquier página de aterrizaje.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dominio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Añadido el</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    {domain.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={domain.status === "verified" ? "default" : "secondary"}>
                      {domain.status === "verified" ? "Verificado" : "Pendiente"}
                    </Badge>
                  </TableCell>
                  <TableCell>{domain.addedAt}</TableCell>
                  <TableCell>
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
                         <Dialog>
                            <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Verificar</DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Verifica tu dominio: {domain.name}</DialogTitle>
                                    <DialogDescription>
                                        Para verificar que eres el propietario de <strong>{domain.name}</strong>, añade los siguientes registros a la configuración de DNS de tu proveedor de dominio.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-sm mb-1">Registro A</h4>
                                        <p className="text-xs text-muted-foreground">Apunta tu dominio raíz (@) a nuestra IP.</p>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <Input defaultValue={A_RECORD_VALUE} readOnly />
                                            <Button size="sm" className="px-3" onClick={() => handleCopyRecord(A_RECORD_VALUE, 'A')}>
                                                {copiedRecord === 'A' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm mb-1">Registro TXT</h4>
                                        <p className="text-xs text-muted-foreground">Añade este registro TXT para confirmar la propiedad.</p>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <Input defaultValue={TXT_RECORD_VALUE} readOnly />
                                            <Button size="sm" className="px-3" onClick={() => handleCopyRecord(TXT_RECORD_VALUE, 'TXT')}>
                                                {copiedRecord === 'TXT' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">Cerrar</Button>
                                    </DialogClose>
                                    <Button onClick={() => handleVerifyDomain(domain.id)} disabled={isVerifying === domain.id}>
                                        {isVerifying === domain.id ? "Verificando..." : "Verificar ahora"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                         </Dialog>
                         <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
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
    </div>
  )
}
