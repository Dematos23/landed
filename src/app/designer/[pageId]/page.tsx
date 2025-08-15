

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
  Pencil,
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from '@/lib/utils';

type ComponentData = {
  id: number;
  name: string;
  props: { [key: string]: any };
};

// --- Component Previews ---

const HeroPreview = ({ headline, subheadline, cta1, cta2 }: { headline: string, subheadline: string, cta1: string, cta2: string }) => (
  <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center pointer-events-none">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{headline}</h1>
    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{subheadline}</p>
    <div className="flex justify-center gap-4">
      <Button size="lg" className="bg-primary hover:bg-primary/90">{cta1}</Button>
      <Button size="lg" variant="outline">{cta2}</Button>
    </div>
  </div>
);

const FeaturesPreview = () => (
  <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 pointer-events-none">
     <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Características</h2>
     <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mx-auto mb-4">
                <Layers className="h-6 w-6"/>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Característica Uno</h3>
            <p className="text-gray-600 dark:text-gray-300">Describe brevemente una característica clave y su beneficio.</p>
        </div>
         <div className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mx-auto mb-4">
                <Settings className="h-6 w-6"/>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Característica Dos</h3>
            <p className="text-gray-600 dark:text-gray-300">Describe brevemente una característica clave y su beneficio.</p>
        </div>
         <div className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mx-auto mb-4">
                <Eye className="h-6 w-6"/>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Característica Tres</h3>
            <p className="text-gray-600 dark:text-gray-300">Describe brevemente una característica clave y su beneficio.</p>
        </div>
     </div>
  </div>
);

const CtaPreview = () => (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 pointer-events-none">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">¿Listo para Empezar?</h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Comienza tu prueba gratuita hoy. No se requiere tarjeta de crédito.</p>
            <Button size="lg" className="mt-6 bg-primary hover:bg-primary/90">
                Regístrate Ahora
            </Button>
        </div>
    </div>
);

const TestimonialsPreview = () => (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 pointer-events-none">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Lo que Dicen Nuestros Clientes</h2>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-primary/5 dark:bg-gray-700 p-6 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300 italic">"Este producto ha cambiado mi vida. Ya no me imagino trabajando sin él."</p>
                <div className="flex items-center mt-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 mr-4"></div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Juana Pérez</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">CEO, Acme Inc.</p>
                    </div>
                </div>
            </div>
            <div className="bg-primary/5 dark:bg-gray-700 p-6 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300 italic">"Imprescindible para cualquier profesional serio. ¡El soporte también es de primera!"</p>
                 <div className="flex items-center mt-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 mr-4"></div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Juan García</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Desarrollador Principal, Innovate Corp.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const FaqPreview = () => (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 pointer-events-none">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Preguntas Frecuentes</h2>
        <div className="space-y-4">
            <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">¿Cuál es la política de reembolso?</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Ofrecemos una garantía de devolución de dinero de 30 días, sin hacer preguntas.</p>
            </div>
            <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">¿Puedo cambiar mi plan más tarde?</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Sí, puedes mejorar, degradar o cancelar tu plan en cualquier momento desde tu panel de control.</p>
            </div>
            <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">¿Hay descuento para estudiantes?</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Actualmente no ofrecemos descuentos para estudiantes, pero tenemos planes asequibles para todos.</p>
            </div>
        </div>
    </div>
);

const FooterPreview = () => (
    <div className="w-full bg-gray-900 text-white rounded-lg shadow-md p-8 pointer-events-none">
        <div className="flex justify-between items-center">
            <p>&copy; 2024 Tu Compañía. Todos los derechos reservados.</p>
            <div className="flex space-x-4">
                <a href="#" className="hover:underline">Política de Privacidad</a>
                <a href="#" className="hover:underline">Términos de Servicio</a>
            </div>
        </div>
    </div>
);

// --- Component Edit Forms ---

const EditHeroForm = ({ data, onSave, onCancel }: { data: any, onSave: (newData: any) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState(data.props);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Sección de Héroe</h3>
            <div>
                <Label htmlFor="headline">Titular</Label>
                <Input id="headline" value={formData.headline} onChange={(e) => setFormData({ ...formData, headline: e.target.value })} />
            </div>
            <div>
                <Label htmlFor="subheadline">Subtítulo</Label>
                <Textarea id="subheadline" value={formData.subheadline} onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })} />
            </div>
            <div>
                <Label htmlFor="cta1">Texto del Botón 1</Label>
                <Input id="cta1" value={formData.cta1} onChange={(e) => setFormData({ ...formData, cta1: e.target.value })} />
            </div>
            <div>
                <Label htmlFor="cta2">Texto del Botón 2</Label>
                <Input id="cta2" value={formData.cta2} onChange={(e) => setFormData({ ...formData, cta2: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
            </div>
        </form>
    );
};


const componentMap: { [key: string]: { preview: React.ComponentType<any>, edit: React.ComponentType<any> } } = {
  'Sección de Héroe': { preview: HeroPreview, edit: EditHeroForm },
  'Características': { preview: FeaturesPreview, edit: () => <div>Editar Características</div> },
  'CTA': { preview: CtaPreview, edit: () => <div>Editar CTA</div> },
  'Testimonios': { preview: TestimonialsPreview, edit: () => <div>Editar Testimonios</div> },
  'Preguntas Frecuentes': { preview: FaqPreview, edit: () => <div>Editar Preguntas Frecuentes</div> },
  'Pie de página': { preview: FooterPreview, edit: () => <div>Editar Pie de Página</div> },
};

const initialComponents: ComponentData[] = [
    { id: 1, name: 'Sección de Héroe', props: { headline: 'Tu Producto Increíble', subheadline: 'Un eslogan convincente que capta la atención y explica el beneficio principal.', cta1: 'Comenzar', cta2: 'Saber Más' } },
    { id: 2, name: 'Características', props: {} },
];

export default function DesignerPage({ params }: { params: { pageId: string } }) {
  const isNew = params.pageId === 'new';
  const [components, setComponents] = useState<ComponentData[]>(initialComponents);
  const [editingComponent, setEditingComponent] = useState<ComponentData | null>(null);

  // Drag and drop state
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const addComponent = (componentName: string) => {
    let defaultProps = {};
    if (componentName === 'Sección de Héroe') {
        defaultProps = { headline: 'Nuevo Titular', subheadline: 'Nuevo Subtítulo', cta1: 'Botón 1', cta2: 'Botón 2' };
    }
    const newComponent = {
      id: Date.now(),
      name: componentName,
      props: defaultProps
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

  const handleEdit = (component: ComponentData) => {
    setEditingComponent(component);
  };

  const handleSave = (newProps: any) => {
    if (!editingComponent) return;
    setComponents(prev => prev.map(c => 
      c.id === editingComponent.id ? { ...c, props: newProps } : c
    ));
    setEditingComponent(null);
  };

  const handleCancel = () => {
    setEditingComponent(null);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 sticky top-0 z-40">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="flex-1 text-lg font-semibold truncate">
          {isNew ? "Nueva Página de Aterrizaje" : "Editando: Lanzamiento Acme Inc."}
        </h1>
        <div className="hidden md:flex items-center gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon"><Monitor className="h-4 w-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Escritorio</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon"><Tablet className="h-4 w-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Tableta</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon"><Smartphone className="h-4 w-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Móvil</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
        <Separator orientation="vertical" className="h-8 hidden md:block" />
        <div className="flex items-center gap-2">
          <Button variant="outline">Guardar Borrador</Button>
          <Button>Publicar</Button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r bg-card hidden md:flex flex-col">
          <Card className="border-none rounded-none">
            <CardHeader>
              <CardTitle>Componentes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {Object.keys(componentMap).map(
                (componentName) => (
                  <Button
                    key={componentName}
                    variant="ghost"
                    className="justify-start gap-2"
                    onClick={() => addComponent(componentName)}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    {componentName}
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
                 const { preview: ComponentPreview, edit: EditComponent } = componentMap[component.name];
                 const isEditing = editingComponent?.id === component.id;

                 if (!ComponentPreview) return null;

                 return (
                    <div 
                        key={component.id} 
                        className="relative group rounded-lg transition-all"
                        draggable={!isEditing}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        {isEditing ? (
                          <EditComponent data={component} onSave={handleSave} onCancel={handleCancel} />
                        ) : (
                          <>
                            <ComponentPreview {...component.props} />
                            <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white cursor-move">
                                    <GripVertical className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white" onClick={() => handleEdit(component)}>
                                    <Pencil className="h-4 w-4" />
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
                          </>
                        )}
                    </div>
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
              <Button variant="outline" className="rounded-full" onClick={() => addComponent('Características')}>
                <Plus className="mr-2 h-4 w-4" /> Agregar Sección
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
