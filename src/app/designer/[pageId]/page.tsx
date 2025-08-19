

"use client"

import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link"
import { useParams, useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
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
  Palette,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, useSidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { getLandingPage, createLandingPage, updateLandingPage } from '@/services/landings';
import type { LandingPageData, LandingPageComponent, LandingPageTheme } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { serverTimestamp } from 'firebase/firestore';


type ComponentData = LandingPageComponent;

// --- Component Previews ---

const HeroPreview = ({ 
  headline, subheadline, 
  cta1, cta2, cta1Url, cta2Url,
  numberOfButtons, cta1Style, cta2Style,
  backgroundType, 
  imageMode,
  backgroundImage, backgroundImageDesktop, backgroundImageTablet, backgroundImageMobile, 
  backgroundImages
}: { 
  headline: string, subheadline: string, 
  cta1: string, cta2: string, cta1Url: string, cta2Url: string,
  numberOfButtons: number, cta1Style: string, cta2Style: string,
  backgroundType: 'color' | 'image' | 'carousel',
  imageMode: 'single' | 'responsive',
  backgroundImage: string,
  backgroundImageDesktop: string,
  backgroundImageTablet: string,
  backgroundImageMobile: string,
  backgroundImages: string[]
}) => {
  const [currentViewport, setCurrentViewport] = useState('desktop');

  useEffect(() => {
    // This is a simplified way to sync with the designer's viewport for preview purposes
    const handleMessage = (event: any) => {
      if (event.data.type === 'viewportChange') {
        setCurrentViewport(event.data.viewport);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const backgroundContent = () => {
    switch (backgroundType) {
      case 'image':
        if (imageMode === 'responsive') {
           return (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center rounded-lg hidden md:hidden lg:block" // Desktop
                style={{ backgroundImage: `url(${backgroundImageDesktop})` }}
              />
              <div 
                className="absolute inset-0 bg-cover bg-center rounded-lg hidden md:block lg:hidden" // Tablet
                style={{ backgroundImage: `url(${backgroundImageTablet})` }}
              />
              <div 
                className="absolute inset-0 bg-cover bg-center rounded-lg block md:hidden" // Mobile
                style={{ backgroundImage: `url(${backgroundImageMobile})` }}
              />
            </>
           )
        }
        return (
          <div 
            className="absolute inset-0 bg-cover bg-center rounded-lg" 
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        );
      case 'carousel':
        return (
          <Carousel className="absolute inset-0 w-full h-full rounded-lg" opts={{ loop: true }}>
            <CarouselContent>
              {backgroundImages.map((img, index) => (
                <CarouselItem key={index}>
                  <div 
                    className="h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {backgroundImages.length > 1 && (
              <>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </>
            )}
          </Carousel>
        );
      case 'color':
      default:
        return null; // The background color will be handled by the parent div class
    }
  }

  const getButtonStyle = (style: string) => {
    switch(style) {
      case 'primary':
        return "bg-primary hover:bg-primary/90 text-primary-foreground";
      case 'secondary':
        return "bg-secondary hover:bg-secondary/90 text-secondary-foreground";
      default:
        return "bg-primary hover:bg-primary/90 text-primary-foreground";
    }
  };

  return (
    <div className="relative w-full bg-card dark:bg-gray-800 rounded-lg shadow-md text-center pointer-events-none overflow-hidden">
      {backgroundContent()}
      <div className={cn(
        "relative p-8",
        (backgroundType === 'image' || backgroundType === 'carousel') && "bg-black/50 rounded-lg text-white"
      )}>
        <h1 className={cn(
          "text-4xl font-bold mb-4",
          (backgroundType === 'image' || backgroundType === 'carousel') ? "text-white" : "text-card-foreground dark:text-white"
        )}>{headline}</h1>
        <p className={cn(
          "text-lg mb-6",
           (backgroundType === 'image' || backgroundType === 'carousel') ? "text-gray-200" : "text-muted-foreground dark:text-gray-300"
        )}>{subheadline}</p>
        <div className="flex justify-center gap-4">
          {numberOfButtons > 0 && (
            <Button asChild size="lg" className={getButtonStyle(cta1Style)}>
              <a href={cta1Url}>{cta1}</a>
            </Button>
          )}
          {numberOfButtons > 1 && (
            <Button asChild size="lg" className={getButtonStyle(cta2Style)}>
              <a href={cta2Url}>{cta2}</a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
};


const FeaturesPreview = ({ title, features }: { title: string, features: { title: string, description: string }[] }) => (
  <div className="w-full bg-card dark:bg-gray-800 rounded-lg shadow-md p-8 pointer-events-none">
     <h2 className="text-3xl font-bold text-center text-card-foreground dark:text-white mb-8">{title}</h2>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mx-auto mb-4">
                  <Layers className="h-6 w-6"/>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground dark:text-white">{feature.title}</h3>
              <p className="text-muted-foreground dark:text-gray-300">{feature.description}</p>
          </div>
        ))}
     </div>
  </div>
);

const CtaPreview = ({ title, subtitle, buttonText, buttonUrl }: { title: string, subtitle: string, buttonText: string, buttonUrl: string }) => (
    <div className="w-full bg-card dark:bg-gray-800 rounded-lg shadow-md p-8 pointer-events-none">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-card-foreground dark:text-white">{title}</h2>
            <p className="mt-2 text-lg text-muted-foreground dark:text-gray-300">{subtitle}</p>
            <Button size="lg" asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href={buttonUrl}>{buttonText}</a>
            </Button>
        </div>
    </div>
);

const TestimonialsPreview = ({ title, testimonials }: { title: string, testimonials: { quote: string, name: string, company: string }[] }) => (
    <div className="w-full bg-card dark:bg-gray-800 rounded-lg shadow-md p-8 pointer-events-none">
        <h2 className="text-3xl font-bold text-center text-card-foreground dark:text-white mb-8">{title}</h2>
        <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-primary/5 dark:bg-gray-700 p-6 rounded-lg">
                    <p className="text-muted-foreground dark:text-gray-300 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center mt-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 mr-4"></div>
                        <div>
                            <p className="font-semibold text-card-foreground dark:text-white">{testimonial.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.company}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const FaqPreview = ({ title, faqs }: { title: string, faqs: { question: string, answer: string }[] }) => (
    <div className="w-full bg-card dark:bg-gray-800 rounded-lg shadow-md p-8 pointer-events-none">
        <h2 className="text-3xl font-bold text-center text-card-foreground dark:text-white mb-8">{title}</h2>
        <div className="space-y-4">
            {faqs.map((faq, index) => (
                <div key={index}>
                    <h3 className="font-semibold text-lg text-card-foreground dark:text-white">{faq.question}</h3>
                    <p className="text-muted-foreground dark:text-gray-300 mt-1">{faq.answer}</p>
                </div>
            ))}
        </div>
    </div>
);

const FooterPreview = ({ copyright, links }: { copyright: string, links: { text: string, url: string }[] }) => (
    <div className="w-full bg-gray-900 text-white rounded-lg shadow-md p-8 pointer-events-none">
        <div className="flex justify-between items-center">
            <p>{copyright}</p>
            <div className="flex space-x-4">
                {links.map((link, index) => (
                  <a key={index} href={link.url} className="hover:underline">{link.text}</a>
                ))}
            </div>
        </div>
    </div>
);

// --- Component Edit Forms ---

const EditHeroForm = ({ data, onSave, onCancel }: { data: any, onSave: (newData: any) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState(data.props);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileInputRefDesktop = useRef<HTMLInputElement>(null);
    const fileInputRefTablet = useRef<HTMLInputElement>(null);
    const fileInputRefMobile = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName?: keyof typeof formData) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImage = reader.result as string;

                if (fieldName) {
                    setFormData({ ...formData, [fieldName]: newImage });
                } else {
                     const updatedImages = [...(formData.backgroundImages || []), newImage];
                     setFormData({ 
                        ...formData, 
                        backgroundImages: updatedImages,
                        ...(formData.backgroundType === 'image' && { backgroundImage: newImage })
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };


    const handleImageSelect = (imgUrl: string) => {
      if (formData.backgroundType === 'image') {
        setFormData({ ...formData, backgroundImage: imgUrl });
      }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Sección de Héroe</h3>
            
            <Accordion type="multiple" defaultValue={['content', 'background']}>
              <AccordionItem value="content">
                <AccordionTrigger>Contenido</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div>
                      <Label htmlFor="headline">Titular</Label>
                      <Input id="headline" value={formData.headline} onChange={(e) => setFormData({ ...formData, headline: e.target.value })} />
                  </div>
                  <div>
                      <Label htmlFor="subheadline">Subtítulo</Label>
                      <Textarea id="subheadline" value={formData.subheadline} onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })} />
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="numberOfButtons">Número de botones</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, numberOfButtons: parseInt(value) })} defaultValue={String(formData.numberOfButtons)}>
                      <SelectTrigger id="numberOfButtons">
                        <SelectValue placeholder="Seleccionar número de botones" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {formData.numberOfButtons > 0 && (
                    <div className="space-y-4 border p-4 rounded-md">
                      <h4 className="font-medium">Botón 1</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="cta1">Texto del Botón 1</Label>
                            <Input id="cta1" value={formData.cta1} onChange={(e) => setFormData({ ...formData, cta1: e.target.value })} />
                        </div>
                        <div>
                            <Label htmlFor="cta1Url">URL del Botón 1</Label>
                            <Input id="cta1Url" value={formData.cta1Url} onChange={(e) => setFormData({ ...formData, cta1Url: e.target.value })} />
                        </div>
                      </div>
                       <div>
                        <Label htmlFor="cta1Style">Estilo del Botón 1</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, cta1Style: value })} defaultValue={formData.cta1Style}>
                          <SelectTrigger id="cta1Style">
                            <SelectValue placeholder="Seleccionar estilo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primary">Primario</SelectItem>
                            <SelectItem value="secondary">Secundario</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {formData.numberOfButtons > 1 && (
                     <div className="space-y-4 border p-4 rounded-md">
                        <h4 className="font-medium">Botón 2</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                              <Label htmlFor="cta2">Texto del Botón 2</Label>
                              <Input id="cta2" value={formData.cta2} onChange={(e) => setFormData({ ...formData, cta2: e.target.value })} />
                          </div>
                          <div>
                              <Label htmlFor="cta2Url">URL del Botón 2</Label>
                              <Input id="cta2Url" value={formData.cta2Url} onChange={(e) => setFormData({ ...formData, cta2Url: e.target.value })} />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cta2Style">Estilo del Botón 2</Label>
                          <Select onValueChange={(value) => setFormData({ ...formData, cta2Style: value })} defaultValue={formData.cta2Style}>
                            <SelectTrigger id="cta2Style">
                              <SelectValue placeholder="Seleccionar estilo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="primary">Primario</SelectItem>
                              <SelectItem value="secondary">Secundario</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                  )}
                  
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="background">
                <AccordionTrigger>Fondo</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                   <div>
                     <Label>Tipo de Fondo</Label>
                     <RadioGroup
                        defaultValue={formData.backgroundType}
                        onValueChange={(value) => setFormData({ ...formData, backgroundType: value })}
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="color" id="r-color" />
                          <Label htmlFor="r-color">Color</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="image" id="r-image" />
                          <Label htmlFor="r-image">Imagen</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="carousel" id="r-carousel" />
                          <Label htmlFor="r-carousel">Carrusel</Label>
                        </div>
                      </RadioGroup>
                   </div>
                   {formData.backgroundType === 'image' && (
                     <div className="space-y-4">
                       <div>
                         <Label>Modo de Imagen</Label>
                         <RadioGroup
                            defaultValue={formData.imageMode}
                            onValueChange={(value) => setFormData({ ...formData, imageMode: value })}
                            className="flex gap-4 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="single" id="r-single" />
                              <Label htmlFor="r-single">Una sola imagen</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="responsive" id="r-responsive" />
                              <Label htmlFor="r-responsive">Imágenes responsivas</Label>
                            </div>
                          </RadioGroup>
                       </div>
                       {formData.imageMode === 'single' && (
                          <div>
                           <Label>Imagen</Label>
                           <p className="text-xs text-muted-foreground mb-2">Recomendado: 1200x600px</p>
                           <div className="grid grid-cols-3 gap-2 mt-2">
                             {(formData.backgroundImages || []).map((img: string, index: number) => (
                                <div 
                                  key={index} 
                                  className={cn(
                                    "relative rounded-md overflow-hidden aspect-video cursor-pointer",
                                    formData.backgroundImage === img && "ring-2 ring-primary ring-offset-2"
                                  )}
                                  onClick={() => handleImageSelect(img)}
                                >
                                    <img src={img} alt={`fondo ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                             ))}
                             <Button
                               type="button"
                               variant="outline"
                               className="aspect-video w-full h-full flex flex-col items-center justify-center"
                               onClick={() => fileInputRef.current?.click()}
                             >
                               <Upload className="h-6 w-6 mb-2" />
                               Subir
                             </Button>
                             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e)} />
                           </div>
                         </div>
                       )}
                       {formData.imageMode === 'responsive' && (
                         <div className="space-y-4">
                            <div>
                                <Label htmlFor='bg-desktop'>Imagen Escritorio</Label>
                                <p className="text-xs text-muted-foreground mb-1">Recomendado: 1920x1080px</p>
                                {formData.backgroundImageDesktop && <img src={formData.backgroundImageDesktop} className="w-32 h-auto rounded-md my-2"/>}
                                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRefDesktop.current?.click()}>Subir</Button>
                                <input type="file" ref={fileInputRefDesktop} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'backgroundImageDesktop')} />
                            </div>
                             <div>
                                <Label htmlFor='bg-tablet'>Imagen Tableta</Label>
                                <p className="text-xs text-muted-foreground mb-1">Recomendado: 1024x768px</p>
                                {formData.backgroundImageTablet && <img src={formData.backgroundImageTablet} className="w-32 h-auto rounded-md my-2"/>}
                                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRefTablet.current?.click()}>Subir</Button>
                                <input type="file" ref={fileInputRefTablet} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'backgroundImageTablet')} />
                            </div>
                             <div>
                                <Label htmlFor='bg-mobile'>Imagen Móvil</Label>
                                <p className="text-xs text-muted-foreground mb-1">Recomendado: 480x800px</p>
                                {formData.backgroundImageMobile && <img src={formData.backgroundImageMobile} className="w-32 h-auto rounded-md my-2"/>}
                                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRefMobile.current?.click()}>Subir</Button>
                                <input type="file" ref={fileInputRefMobile} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'backgroundImageMobile')} />
                            </div>
                         </div>
                       )}
                     </div>
                   )}
                   {formData.backgroundType === 'carousel' && (
                     <div>
                       <Label>Imágenes para Carrusel</Label>
                       <p className="text-xs text-muted-foreground mb-2">Sube una o más imágenes para el carrusel.</p>
                       <div className="grid grid-cols-3 gap-2 mt-2">
                         {(formData.backgroundImages || []).map((img: string, index: number) => (
                            <div key={index} className="relative rounded-md overflow-hidden aspect-video">
                                <img src={img} alt={`fondo ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                         ))}
                         <Button
                           type="button"
                           variant="outline"
                           className="aspect-video w-full h-full flex flex-col items-center justify-center"
                           onClick={() => fileInputRef.current?.click()}
                         >
                           <Upload className="h-6 w-6 mb-2" />
                           Subir
                         </Button>
                         <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e)} />
                       </div>
                     </div>
                   )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
            </div>
        </form>
    );
};


const EditFeaturesForm = ({ data, onSave, onCancel }: { data: any, onSave: (newData: any) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState(data.props);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    const handleFeatureChange = (index: number, field: string, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setFormData({ ...formData, features: newFeatures });
    };
    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Sección de Características</h3>
            <div>
                <Label htmlFor="main-title">Título Principal</Label>
                <Input id="main-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <Accordion type="single" collapsible className="w-full">
              {formData.features.map((feature: any, index: number) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>Característica {index + 1}</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                          <div>
                              <Label htmlFor={`feature-title-${index}`}>Título</Label>
                              <Input id={`feature-title-${index}`} value={feature.title} onChange={(e) => handleFeatureChange(index, 'title', e.target.value)} />
                          </div>
                          <div>
                              <Label htmlFor={`feature-desc-${index}`}>Descripción</Label>
                              <Textarea id={`feature-desc-${index}`} value={feature.description} onChange={(e) => handleFeatureChange(index, 'description', e.target.value)} />
                          </div>
                      </AccordionContent>
                  </AccordionItem>
              ))}
            </Accordion>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
            </div>
        </form>
    );
};

const EditCtaForm = ({ data, onSave, onCancel }: { data: any, onSave: (newData: any) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState(data.props);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Sección de CTA</h3>
            <div>
                <Label htmlFor="cta-title">Título</Label>
                <Input id="cta-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div>
                <Label htmlFor="cta-subtitle">Subtítulo</Label>
                <Input id="cta-subtitle" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} />
            </div>
            <div>
                <Label htmlFor="cta-button">Texto del Botón</Label>
                <Input id="cta-button" value={formData.buttonText} onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })} />
            </div>
             <div>
                <Label htmlFor="cta-button-url">URL del Botón</Label>
                <Input id="cta-button-url" value={formData.buttonUrl} onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
            </div>
        </form>
    );
};

const EditTestimonialsForm = ({ data, onSave, onCancel }: { data: any, onSave: (newData: any) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState(data.props);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    const handleTestimonialChange = (index: number, field: string, value: string) => {
        const newTestimonials = [...formData.testimonials];
        newTestimonials[index] = { ...newTestimonials[index], [field]: value };
        setFormData({ ...formData, testimonials: newTestimonials });
    };
    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Sección de Testimonios</h3>
            <div>
                <Label htmlFor="main-title">Título Principal</Label>
                <Input id="main-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
             <Accordion type="single" collapsible className="w-full">
              {formData.testimonials.map((testimonial: any, index: number) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>Testimonio {index + 1}</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                          <div>
                              <Label htmlFor={`testimonial-quote-${index}`}>Cita</Label>
                              <Textarea id={`testimonial-quote-${index}`} value={testimonial.quote} onChange={(e) => handleTestimonialChange(index, 'quote', e.target.value)} />
                          </div>
                          <div>
                              <Label htmlFor={`testimonial-name-${index}`}>Nombre</Label>
                              <Input id={`testimonial-name-${index}`} value={testimonial.name} onChange={(e) => handleTestimonialChange(index, 'name', e.target.value)} />
                          </div>
                          <div>
                              <Label htmlFor={`testimonial-company-${index}`}>Compañía</Label>
                              <Input id={`testimonial-company-${index}`} value={testimonial.company} onChange={(e) => handleTestimonialChange(index, 'company', e.target.value)} />
                          </div>
                      </AccordionContent>
                  </AccordionItem>
              ))}
            </Accordion>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
            </div>
        </form>
    );
};

const EditFaqForm = ({ data, onSave, onCancel }: { data: any, onSave: (newData: any) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState(data.props);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    const handleFaqChange = (index: number, field: string, value: string) => {
        const newFaqs = [...formData.faqs];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        setFormData({ ...formData, faqs: newFaqs });
    };
    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Sección de FAQ</h3>
            <div>
                <Label htmlFor="main-title">Título Principal</Label>
                <Input id="main-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
             <Accordion type="single" collapsible className="w-full">
              {formData.faqs.map((faq: any, index: number) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>Pregunta {index + 1}</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                          <div>
                              <Label htmlFor={`faq-question-${index}`}>Pregunta</Label>
                              <Input id={`faq-question-${index}`} value={faq.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} />
                          </div>
                          <div>
                              <Label htmlFor={`faq-answer-${index}`}>Respuesta</Label>
                              <Textarea id={`faq-answer-${index}`} value={faq.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} />
                          </div>
                      </AccordionContent>
                  </AccordionItem>
              ))}
            </Accordion>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
            </div>
        </form>
    );
};

const EditFooterForm = ({ data, onSave, onCancel }: { data: any, onSave: (newData: any) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState(data.props);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    const handleLinkChange = (index: number, field: string, value: string) => {
        const newLinks = [...formData.links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setFormData({ ...formData, links: newLinks });
    };
    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Pie de Página</h3>
            <div>
                <Label htmlFor="copyright">Texto de Copyright</Label>
                <Input id="copyright" value={formData.copyright} onChange={(e) => setFormData({ ...formData, copyright: e.target.value })} />
            </div>
             <Accordion type="single" collapsible className="w-full">
              {formData.links.map((link: any, index: number) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>Enlace {index + 1}</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                           <div>
                              <Label htmlFor={`link-text-${index}`}>Texto</Label>
                              <Input id={`link-text-${index}`} value={link.text} onChange={(e) => handleLinkChange(index, 'text', e.target.value)} />
                          </div>
                           <div>
                              <Label htmlFor={`link-url-${index}`}>URL</Label>
                              <Input id={`link-url-${index}`} value={link.url} onChange={(e) => handleLinkChange(index, 'url', e.target.value)} />
                          </div>
                      </AccordionContent>
                  </AccordionItem>
              ))}
            </Accordion>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
            </div>
        </form>
    );
};


const componentMap: { [key: string]: { preview: React.ComponentType<any>, edit: React.ComponentType<any>, defaultProps: any } } = {
  'Sección de Héroe': { 
    preview: HeroPreview, 
    edit: EditHeroForm,
    defaultProps: { 
      headline: 'Tu Producto Increíble', 
      subheadline: 'Un eslogan convincente que capta la atención.', 
      cta1: 'Comenzar', 
      cta2: 'Saber Más', 
      cta1Url: '#', 
      cta2Url: '#',
      numberOfButtons: 2,
      cta1Style: 'primary',
      cta2Style: 'secondary',
      backgroundType: 'color',
      imageMode: 'single',
      backgroundImage: 'https://placehold.co/1200x600.png',
      backgroundImageDesktop: 'https://placehold.co/1920x1080.png',
      backgroundImageTablet: 'https://placehold.co/1024x768.png',
      backgroundImageMobile: 'https://placehold.co/480x800.png',
      backgroundImages: [],
    }
  },
  'Características': { 
    preview: FeaturesPreview, 
    edit: EditFeaturesForm,
    defaultProps: {
        title: "Características",
        features: [
            { title: 'Característica Uno', description: 'Describe brevemente una característica clave.' },
            { title: 'Característica Dos', description: 'Describe brevemente una característica clave.' },
            { title: 'Característica Tres', description: 'Describe brevemente una característica clave.' },
        ]
    }
  },
  'CTA': { 
    preview: CtaPreview, 
    edit: EditCtaForm,
    defaultProps: { title: '¿Listo para Empezar?', subtitle: 'Comienza tu prueba gratuita hoy.', buttonText: 'Regístrate Ahora', buttonUrl: '#' }
  },
  'Testimonios': { 
    preview: TestimonialsPreview, 
    edit: EditTestimonialsForm,
    defaultProps: {
        title: "Lo que Dicen Nuestros Clientes",
        testimonials: [
            { quote: "Este producto ha cambiado mi vida.", name: "Juana Pérez", company: "CEO, Acme Inc." },
            { quote: "Imprescindible para cualquier profesional.", name: "Juan García", company: "Desarrollador, Innovate Corp." },
        ]
    }
  },
  'Preguntas Frecuentes': { 
    preview: FaqPreview, 
    edit: EditFaqForm,
    defaultProps: {
        title: "Preguntas Frecuentes",
        faqs: [
            { question: '¿Cuál es la política de reembolso?', answer: 'Ofrecemos una garantía de 30 días.' },
            { question: '¿Puedo cambiar mi plan?', answer: 'Sí, puedes cambiar de plan en cualquier momento.' },
        ]
    }
  },
  'Pie de página': { 
    preview: FooterPreview, 
    edit: EditFooterForm,
    defaultProps: {
        copyright: `© ${new Date().getFullYear()} Tu Compañía.`,
        links: [
            { text: 'Política de Privacidad', url: '#' },
            { text: 'Términos de Servicio', url: '#' },
        ]
    }
  },
};

const initialComponents: ComponentData[] = [
    { id: uuidv4(), name: 'Sección de Héroe', props: componentMap['Sección de Héroe'].defaultProps },
    { id: uuidv4(), name: 'Características', props: componentMap['Características'].defaultProps },
];

const defaultTheme: LandingPageTheme = {
    primary: '#3F51B5', // Deep Indigo
    primaryForeground: '#FFFFFF', // White
    secondary: '#7986CB', // Lighter Indigo for secondary elements
    accent: '#7C4DFF', // Vivid Violet
    foreground: '#1A237E', // Darker Indigo for titles
    mutedForeground: '#5C6BC0', // Softer Indigo for text
    background1: '#E8EAF6', // Light Indigo
    background2: '#FFFFFF', // White
    fontFamily: 'Inter',
};

const defaultLandingData: Omit<LandingPageData, 'userId' | 'createdAt' | 'updatedAt'> = {
  id: '',
  name: "Nueva Página de Aterrizaje",
  subdomain: '',
  components: initialComponents,
  theme: defaultTheme,
  isPublished: false,
};


function DesignerPageContent() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const pageIdFromUrl = params.pageId as string;
  const isNew = pageIdFromUrl === 'new';

  const [landingData, setLandingData] = useState<Omit<LandingPageData, 'userId' | 'createdAt' | 'updatedAt'>>(defaultLandingData);
  const [loading, setLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [editingComponent, setEditingComponent] = useState<ComponentData | null>(null);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    const fetchPageData = async (pageId: string) => {
        setLoading(true);
        const data = await getLandingPage(pageId);
        if (data) {
          setLandingData(data);
        } else {
          toast({
            variant: "destructive",
            title: "Página no encontrada",
            description: "No se pudo encontrar la página que buscas. Redirigiendo...",
          });
          router.push('/dashboard');
        }
        setLoading(false);
      };

    if (isNew) {
      setLandingData({
          ...defaultLandingData,
          id: uuidv4(), // Assign a client-side ID for the new page
          name: "Nueva Página de Aterrizaje",
      });
      setLoading(false);
    } else {
      fetchPageData(pageIdFromUrl);
    }
  }, [pageIdFromUrl, isNew, router, toast]);

  const setPageName = (name: string) => {
    setLandingData(prev => ({...prev, name}));
  }
  const setComponents = (components: ComponentData[] | ((prev: ComponentData[]) => ComponentData[])) => {
    setLandingData(prev => ({
      ...prev,
      components: typeof components === 'function' ? components(prev.components) : components,
    }));
  };
  const setTheme = (theme: LandingPageTheme | ((prev: LandingPageTheme) => LandingPageTheme)) => {
    setLandingData(prev => ({
        ...prev,
        theme: typeof theme === 'function' ? theme(prev.theme) : theme,
    }));
  };
  
  const handleSaveDraft = async () => {
    if (!landingData?.id) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "No hay un ID de página para guardar.",
        });
        return;
    }
    setIsSaving(true);
    try {
        const existingPage = await getLandingPage(landingData.id);

        if (existingPage) {
            // Page exists, update it
            await updateLandingPage(landingData.id, landingData);
            toast({
                title: "¡Borrador guardado!",
                description: "Tus cambios han sido guardados.",
            });
        } else {
            // Page doesn't exist, create it
            const success = await createLandingPage(landingData);
            if (success) {
                toast({
                    title: "¡Página creada!",
                    description: "Tu nueva página ha sido guardada como borrador.",
                });
                // If it's a new page, redirect to the new URL
                if (isNew) {
                    router.replace(`/designer/${landingData.id}`);
                }
            } else {
                 throw new Error("No se pudo crear la nueva página.");
            }
        }
    } catch (error) {
        console.error("Error saving draft:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
        });
    } finally {
        setIsSaving(false);
    }
  };


  const handlePreview = () => {
    const previewData = {
      name: landingData.name,
      components: landingData.components,
      theme: landingData.theme,
    };
    localStorage.setItem('landing-page-preview-data', JSON.stringify(previewData));
    window.open('/preview', '_blank');
  };

  // Drag and drop state
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  
  const handleThemeChange = (key: keyof LandingPageTheme, value: string) => {
    setTheme(prev => ({ ...prev, [key]: value }));
  };

  function hexToHsl(H: string) {
    if (!H) return '0 0% 0%';
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
      r = parseInt("0x" + H[1] + H[1]);
      g = parseInt("0x" + H[2] + H[2]);
      b = parseInt("0x" + H[3] + H[3]);
    } else if (H.length == 7) {
      r = parseInt("0x" + H[1] + H[2]);
      g = parseInt("0x" + H[3] + H[4]);
      b = parseInt("0x" + H[5] + H[6]);
    }
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
  
    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
  
    return `${h} ${s}% ${l}%`;
  }

  const landingPreviewId = "landing-preview-canvas";

  const addComponent = (componentName: string) => {
    const newComponent: LandingPageComponent = {
      id: uuidv4(),
      name: componentName,
      props: componentMap[componentName].defaultProps
    };
    setComponents(prev => [...prev, newComponent]);
  };
  
  const removeComponent = (id: string) => {
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
    
    const newComponents = [...landingData.components];
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

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingName(false);
    }
  };
  
  const pageName = landingData?.name || '';
  const components = landingData?.components || [];
  const theme = landingData?.theme || defaultTheme;

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Cargando diseñador...</div>;
  }

  return (
    <>
     <style>
        {`
          #${landingPreviewId} {
            --primary-hsl: ${hexToHsl(theme.primary)};
            --primary-foreground-hsl: ${hexToHsl(theme.primaryForeground)};
            --secondary-hsl: ${hexToHsl(theme.secondary)};
            --accent-hsl: ${hexToHsl(theme.accent)};
            --foreground-hsl: ${hexToHsl(theme.foreground)};
            --muted-foreground-hsl: ${hexToHsl(theme.mutedForeground)};
            --background-hsl: ${hexToHsl(theme.background1)};
            --card-hsl: ${hexToHsl(theme.background2)};
            --font-body: '${theme.fontFamily}', sans-serif;
            
            background-color: hsl(var(--background-hsl));
            font-family: var(--font-body);
          }
          #${landingPreviewId} .bg-card { background-color: hsl(var(--card-hsl)); }
          #${landingPreviewId} .text-card-foreground { color: hsl(var(--foreground-hsl)); }
          #${landingPreviewId} .text-muted-foreground { color: hsl(var(--muted-foreground-hsl)); }
          
          #${landingPreviewId} .bg-primary { background-color: hsl(var(--primary-hsl)); }
          #${landingPreviewId} .text-primary-foreground { color: hsl(var(--primary-foreground-hsl)); }
          #${landingPreviewId} .hover\\:bg-primary\\/90:hover { background-color: hsla(${hexToHsl(theme.primary).replace(/ /g, ', ')}, 0.9); }
          #${landingPreviewId} .bg-primary\\/10 { background-color: hsla(${hexToHsl(theme.primary).split(' ').join(', ')}, 0.1); }
          #${landingPreviewId} .bg-primary\\/5 { background-color: hsla(${hexToHsl(theme.primary).split(' ').join(', ')}, 0.05); }
          #${landingPreviewId} .text-primary { color: hsl(var(--primary-hsl)); }

          #${landingPreviewId} .bg-secondary { background-color: hsl(var(--secondary-hsl)); }
          #${landingPreviewId} .text-secondary-foreground { color: white; } /* Assuming white foreground for secondary for now */
          #${landingPreviewId} .hover\\:bg-secondary\\/90:hover { background-color: hsla(${hexToHsl(theme.secondary).replace(/ /g, ', ')}, 0.9); }
        `}
      </style>
      <div className="flex h-screen w-full flex-col bg-background">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 sticky top-0 z-40">
          <SidebarTrigger className="md:hidden" />
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1 flex items-center gap-2">
            {isEditingName ? (
              <Input
                type="text"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={handleNameKeyDown}
                className="text-lg font-semibold h-9"
                autoFocus
              />
            ) : (
              <>
                <h1 className="text-lg font-semibold truncate">
                  {pageName}
                </h1>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditingName(true)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          <div className="hidden md:flex items-center gap-2">
              <TooltipProvider>
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <Button variant={viewport === 'desktop' ? "secondary" : "ghost"} size="icon" onClick={() => setViewport('desktop')}><Monitor className="h-4 w-4" /></Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Escritorio</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <Button variant={viewport === 'tablet' ? "secondary" : "ghost"} size="icon" onClick={() => setViewport('tablet')}><Tablet className="h-4 w-4" /></Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Tableta</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <Button variant={viewport === 'mobile' ? "secondary" : "ghost"} size="icon" onClick={() => setViewport('mobile')}><Smartphone className="h-4 w-4" /></Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Móvil</p></TooltipContent>
                  </Tooltip>
              </TooltipProvider>
          </div>
          <Separator orientation="vertical" className="h-8 hidden md:block" />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePreview}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">Previsualizar</span>
            </Button>
            <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar Borrador"}
            </Button>
            <Button>Publicar</Button>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar>
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="p-4 hover:no-underline">
                  <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      <span className="font-semibold text-base">Tema</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0 space-y-4">
                  <div className="space-y-2">
                      <Label>Primario</Label>
                      <Input type="color" value={theme.primary} onChange={(e) => handleThemeChange('primary', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                      <Label>Color Texto Botón</Label>
                      <Input type="color" value={theme.primaryForeground} onChange={(e) => handleThemeChange('primaryForeground', e.target.value)} />
                  </div>
                   <div className="space-y-2">
                      <Label>Secundario</Label>
                      <Input type="color" value={theme.secondary} onChange={(e) => handleThemeChange('secondary', e.target.value)} />
                  </div>
                   <div className="space-y-2">
                      <Label>Acentos</Label>
                      <Input type="color" value={theme.accent} onChange={(e) => handleThemeChange('accent', e.target.value)} />
                  </div>
                   <div className="space-y-2">
                      <Label>Color de Títulos</Label>
                      <Input type="color" value={theme.foreground} onChange={(e) => handleThemeChange('foreground', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                      <Label>Color de Texto</Label>
                      <Input type="color" value={theme.mutedForeground} onChange={(e) => handleThemeChange('mutedForeground', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                      <Label>Color de Fondo 1</Label>
                      <Input type="color" value={theme.background1} onChange={(e) => handleThemeChange('background1', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                      <Label>Color de Fondo 2</Label>
                      <Input type="color" value={theme.background2} onChange={(e) => handleThemeChange('background2', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Fuente</Label>
                    <Select value={theme.fontFamily} onValueChange={(value) => handleThemeChange('fontFamily', value as LandingPageTheme['fontFamily'])}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar fuente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                 <AccordionTrigger className="p-4 hover:no-underline">
                  <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      <span className="font-semibold text-base">Componentes</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                   <div className="flex flex-col gap-2">
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
                    </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Sidebar>
          <SidebarInset>
            <main className="flex-1 overflow-auto bg-muted/40 transition-all duration-300" onDrop={handleDrop}>
              <div 
                id={landingPreviewId}
                className={cn(
                  "mx-auto my-8 space-y-4 p-4 transition-all duration-300",
                  viewport === 'desktop' && 'max-w-5xl',
                  viewport === 'tablet' && 'max-w-3xl',
                  viewport === 'mobile' && 'max-w-sm',
                )}
              >
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
                                <ComponentPreview {...component.props} viewport={viewport} />
                                <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white cursor-move">
                                        <GripVertical className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white" onClick={() => handleEdit(component)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white">
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
          </SidebarInset>
        </div>
      </div>
    </>
  );
}


export default function DesignerPage() {
  return (
    <SidebarProvider>
      <DesignerPageContent />
    </SidebarProvider>
  );
}
