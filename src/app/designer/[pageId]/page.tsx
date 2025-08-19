

"use client"

import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link"
import Image from "next/image"
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
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Heart,
  Award,
  ThumbsUp,
  Rocket,
  Gem,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

type ComponentData = LandingPageComponent;

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Layers,
  Zap,
  ShieldCheck,
  Star,
  Heart,
  Award,
  ThumbsUp,
  Rocket,
  Gem,
};

const IconComponent = ({ name, className }: { name: string; className?: string }) => {
  const Icon = iconMap[name];
  return Icon ? <Icon className={className} /> : <Layers className={className} />;
};


// --- Component Previews ---

const HeroPreview = ({ 
  headline, subheadline, 
  cta1, cta2, cta1Url, cta2Url,
  numberOfButtons, cta1Style, cta2Style,
  backgroundType, backgroundImage, imageMode,
  backgroundImageDesktop, backgroundImageTablet, backgroundImageMobile
}: { 
  headline: string, subheadline: string, 
  cta1: string, cta2: string, cta1Url: string, cta2Url: string,
  numberOfButtons: number, cta1Style: string, cta2Style: string,
  backgroundType: 'color' | 'image',
  backgroundImage: string,
  imageMode: 'single' | 'responsive',
  backgroundImageDesktop: string,
  backgroundImageTablet: string,
  backgroundImageMobile: string,
}) => {

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

  const backgroundStyles: React.CSSProperties =
    backgroundType === 'image' && imageMode === 'single' && backgroundImage
      ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : {};
  
  const hasResponsiveImages = backgroundType === 'image' && imageMode === 'responsive';

  return (
     <div className="relative w-full bg-card dark:bg-gray-800 rounded-lg shadow-md text-center pointer-events-none p-8" style={backgroundStyles}>
      {hasResponsiveImages && (
        <>
          {backgroundImageDesktop && <img src={backgroundImageDesktop} alt="Desktop background" className="absolute inset-0 w-full h-full object-cover hidden md:block" />}
          {backgroundImageTablet && <img src={backgroundImageTablet} alt="Tablet background" className="absolute inset-0 w-full h-full object-cover hidden sm:block md:hidden" />}
          {backgroundImageMobile && <img src={backgroundImageMobile} alt="Mobile background" className="absolute inset-0 w-full h-full object-cover sm:hidden" />}
        </>
      )}

      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-card-foreground dark:text-white mb-4">{headline}</h1>
        <p className="text-lg text-muted-foreground dark:text-gray-300 mb-6">{subheadline}</p>
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


const FeaturesPreview = ({ title, features, backgroundType, backgroundImage }: { title: string, features: { icon: string, title: string, description: string }[], backgroundType: 'color' | 'image', backgroundImage: string }) => {
  const backgroundStyles: React.CSSProperties =
    backgroundType === 'image' && backgroundImage
      ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : {};

  return (
    <div className="relative w-full bg-card dark:bg-gray-800 rounded-lg shadow-md p-8 pointer-events-none" style={backgroundStyles}>
       <div className="relative z-10">
         <h2 className="text-3xl font-bold text-center text-card-foreground dark:text-white mb-8">{title}</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mx-auto mb-4">
                      <IconComponent name={feature.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground dark:text-white">{feature.title}</h3>
                  <p className="text-muted-foreground dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
         </div>
       </div>
    </div>
  );
};

const CtaPreview = ({ title, subtitle, buttonText, buttonUrl, backgroundType, backgroundImage }: { title: string, subtitle: string, buttonText: string, buttonUrl: string, backgroundType: 'color' | 'image', backgroundImage: string }) => {
  const backgroundStyles: React.CSSProperties =
    backgroundType === 'image' && backgroundImage
      ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : {};
      
  return (
    <div className="relative w-full bg-card dark:bg-gray-800 rounded-lg shadow-md p-8 pointer-events-none" style={backgroundStyles}>
        <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold text-card-foreground dark:text-white">{title}</h2>
            <p className="mt-2 text-lg text-muted-foreground dark:text-gray-300">{subtitle}</p>
            <Button size="lg" asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href={buttonUrl}>{buttonText}</a>
            </Button>
        </div>
    </div>
  )
};

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
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    
    const fileInputRefSingle = useRef<HTMLInputElement>(null);
    const fileInputRefDesktop = useRef<HTMLInputElement>(null);
    const fileInputRefTablet = useRef<HTMLInputElement>(null);
    const fileInputRefMobile = useRef<HTMLInputElement>(null);

    useEffect(() => {
      // If there are existing images in props, load them into state
      const existingImages = [];
      if (formData.backgroundImage) existingImages.push(formData.backgroundImage);
      if (formData.backgroundImageDesktop) existingImages.push(formData.backgroundImageDesktop);
      if (formData.backgroundImageTablet) existingImages.push(formData.backgroundImageTablet);
      if (formData.backgroundImageMobile) existingImages.push(formData.backgroundImageMobile);
      const uniqueImages = [...new Set(existingImages.filter(Boolean))];
      setUploadedImages(uniqueImages);
    }, [formData.backgroundImage, formData.backgroundImageDesktop, formData.backgroundImageMobile, formData.backgroundImageTablet]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: keyof typeof formData) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          setUploadedImages(prev => [...new Set([...prev, dataUrl])]);
          setFormData({ ...formData, [target]: dataUrl });
        };
        reader.readAsDataURL(file);
      }
    };
    
    const getFileInputRef = (target: string) => {
        switch (target) {
            case 'backgroundImageDesktop': return fileInputRefDesktop;
            case 'backgroundImageTablet': return fileInputRefTablet;
            case 'backgroundImageMobile': return fileInputRefMobile;
            default: return fileInputRefSingle;
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Sección de Héroe</h3>
            
            <Accordion type="multiple" defaultValue={['content', 'background']} className="w-full">
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
                    <RadioGroup
                        defaultValue={formData.backgroundType}
                        onValueChange={(value) => setFormData({ ...formData, backgroundType: value })}
                        className="flex items-center gap-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="color" id="r-color" />
                            <Label htmlFor="r-color">Color</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="image" id="r-image" />
                            <Label htmlFor="r-image">Imagen</Label>
                        </div>
                    </RadioGroup>

                    {formData.backgroundType === 'image' && (
                        <div className="space-y-4 border p-4 rounded-md">
                            <RadioGroup
                                defaultValue={formData.imageMode}
                                onValueChange={(value) => setFormData({ ...formData, imageMode: value })}
                                className="flex items-center gap-4"
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
                            
                            <Separator />

                            {formData.imageMode === 'single' ? (
                                <div className="space-y-2">
                                    <Label>Imagen de Fondo</Label>
                                    <p className="text-sm text-muted-foreground">Recomendado: 1200x600px</p>
                                     <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRefSingle}
                                        onChange={(e) => handleFileChange(e, 'backgroundImage')}
                                    />
                                    <Button type="button" variant="outline" onClick={() => fileInputRefSingle.current?.click()}>
                                        <Upload className="mr-2 h-4 w-4" /> Subir Imagen
                                    </Button>
                                    {formData.backgroundImage && (
                                        <Image
                                            src={formData.backgroundImage}
                                            alt="Preview"
                                            width={100}
                                            height={100}
                                            className="object-cover rounded-md aspect-square mt-2"
                                        />
                                    )}
                                </div>
                            ) : (
                               <div className="space-y-4">
                                  {['Desktop', 'Tablet', 'Mobile'].map((device) => {
                                    const targetKey = `backgroundImage${device}` as keyof typeof formData;
                                    const recommendedSize = device === 'Desktop' ? '1920x1080px' : device === 'Tablet' ? '1024x768px' : '768x1024px';
                                    
                                    return (
                                        <div key={device} className="space-y-2">
                                            <Label>Imagen para {device}</Label>
                                            <p className="text-sm text-muted-foreground">Recomendado: {recommendedSize}</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                ref={getFileInputRef(targetKey)}
                                                onChange={(e) => handleFileChange(e, targetKey)}
                                            />
                                            <Button type="button" variant="outline" onClick={() => getFileInputRef(targetKey).current?.click()}>
                                                <Upload className="mr-2 h-4 w-4" /> Subir Imagen
                                            </Button>
                                            {formData[targetKey] && (
                                                <Image
                                                    src={formData[targetKey]}
                                                    alt={`${device} preview`}
                                                    width={100}
                                                    height={100}
                                                    className="object-cover rounded-md aspect-square mt-2"
                                                />
                                            )}
                                        </div>
                                    );
                                  })}
                               </div>
                            )}

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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleFeatureChange = (index: number, field: string, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setFormData({ ...formData, features: newFeatures });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          setFormData({ ...formData, backgroundImage: dataUrl });
        };
        reader.readAsDataURL(file);
      }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Sección de Características</h3>
             <Accordion type="multiple" defaultValue={['content']} className="w-full">
              <AccordionItem value="content">
                <AccordionTrigger>Contenido</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div>
                      <Label htmlFor="main-title">Título Principal</Label>
                      <Input id="main-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                  </div>
                  {formData.features.map((feature: any, index: number) => (
                    <Accordion type="single" collapsible className="w-full" key={index}>
                        <AccordionItem value={`item-${index}`}>
                            <AccordionTrigger>Característica {index + 1}</AccordionTrigger>
                            <AccordionContent className="space-y-2">
                                <div>
                                    <Label>Icono</Label>
                                    <Select
                                      value={feature.icon}
                                      onValueChange={(value) => handleFeatureChange(index, 'icon', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar icono" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Object.keys(iconMap).map(iconName => (
                                          <SelectItem key={iconName} value={iconName}>
                                            <div className="flex items-center gap-2">
                                               <IconComponent name={iconName} className="h-4 w-4" />
                                               {iconName}
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                </div>
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
                    </Accordion>
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="background">
                  <AccordionTrigger>Fondo</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <RadioGroup
                        defaultValue={formData.backgroundType}
                        onValueChange={(value) => setFormData({ ...formData, backgroundType: value })}
                        className="flex items-center gap-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="color" id="r-color-features" />
                            <Label htmlFor="r-color-features">Color</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="image" id="r-image-features" />
                            <Label htmlFor="r-image-features">Imagen</Label>
                        </div>
                    </RadioGroup>

                    {formData.backgroundType === 'image' && (
                        <div className="space-y-2 border p-4 rounded-md">
                           <Label>Imagen de Fondo</Label>
                           <p className="text-sm text-muted-foreground">Recomendado: 1200x600px</p>
                           <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                           />
                           <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                               <Upload className="mr-2 h-4 w-4" /> Subir Imagen
                           </Button>
                           {formData.backgroundImage && (
                               <Image
                                  src={formData.backgroundImage}
                                  alt="Preview"
                                  width={100}
                                  height={100}
                                  className="object-cover rounded-md aspect-square mt-2"
                               />
                           )}
                        </div>
                    )}
                  </AccordionContent>
              </AccordionItem>
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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          setFormData({ ...formData, backgroundImage: dataUrl });
        };
        reader.readAsDataURL(file);
      }
    };
    
    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Sección de CTA</h3>
            <Accordion type="multiple" defaultValue={['content']} className="w-full">
              <AccordionItem value="content">
                <AccordionTrigger>Contenido</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
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
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="background">
                  <AccordionTrigger>Fondo</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <RadioGroup
                        defaultValue={formData.backgroundType}
                        onValueChange={(value) => setFormData({ ...formData, backgroundType: value })}
                        className="flex items-center gap-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="color" id="r-color-cta" />
                            <Label htmlFor="r-color-cta">Color</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="image" id="r-image-cta" />
                            <Label htmlFor="r-image-cta">Imagen</Label>
                        </div>
                    </RadioGroup>

                    {formData.backgroundType === 'image' && (
                        <div className="space-y-2 border p-4 rounded-md">
                           <Label>Imagen de Fondo</Label>
                           <p className="text-sm text-muted-foreground">Recomendado: 1200x300px</p>
                           <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                           />
                           <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                               <Upload className="mr-2 h-4 w-4" /> Subir Imagen
                           </Button>
                           {formData.backgroundImage && (
                               <Image
                                  src={formData.backgroundImage}
                                  alt="Preview"
                                  width={100}
                                  height={100}
                                  className="object-cover rounded-md aspect-square mt-2"
                               />
                           )}
                        </div>
                    )}
                  </AccordionContent>
              </AccordionItem>
            </Accordion>
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
      backgroundImage: '',
      imageMode: 'single',
      backgroundImageDesktop: '',
      backgroundImageTablet: '',
      backgroundImageMobile: '',
    }
  },
  'Características': { 
    preview: FeaturesPreview, 
    edit: EditFeaturesForm,
    defaultProps: {
        title: "Características",
        features: [
            { icon: 'Zap', title: 'Característica Uno', description: 'Describe brevemente una característica clave.' },
            { icon: 'ShieldCheck', title: 'Característica Dos', description: 'Describe brevemente una característica clave.' },
            { icon: 'Rocket', title: 'Característica Tres', description: 'Describe brevemente una característica clave.' },
        ],
        backgroundType: 'color',
        backgroundImage: '',
    }
  },
  'CTA': { 
    preview: CtaPreview, 
    edit: EditCtaForm,
    defaultProps: { 
        title: '¿Listo para Empezar?', 
        subtitle: 'Comienza tu prueba gratuita hoy.', 
        buttonText: 'Regístrate Ahora', 
        buttonUrl: '#',
        backgroundType: 'color',
        backgroundImage: '',
    }
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

// This function creates the initial state for a new page
const createDefaultLandingData = (): Omit<LandingPageData, 'userId' | 'createdAt' | 'updatedAt'> => {
  const id = uuidv4();
  return {
    id: id,
    name: "Nueva Página de Aterrizaje",
    subdomain: `pagina-${id.substring(0, 8)}`,
    components: [
      { id: uuidv4(), name: 'Sección de Héroe', props: componentMap['Sección de Héroe'].defaultProps },
      { id: uuidv4(), name: 'Características', props: componentMap['Características'].defaultProps },
    ],
    theme: defaultTheme,
    isPublished: false,
  };
};


function DesignerPageContent() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const pageIdFromUrl = params.pageId as string;
  const isNew = pageIdFromUrl === 'new';

  const [landingData, setLandingData] = useState<Omit<LandingPageData, 'userId' | 'createdAt' | 'updatedAt'>>(() => createDefaultLandingData());
  const [loading, setLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [editingComponent, setEditingComponent] = useState<ComponentData | null>(null);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isEditingName, setIsEditingName] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publicUrl, setPublicUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  const getDraftKey = (pageId: string) => `landing-page-draft-${pageId}`;

  // This effect handles the data loading logic
  useEffect(() => {
    const draftKey = getDraftKey(pageIdFromUrl);
    const savedDraft = localStorage.getItem(draftKey);

    const loadPage = async () => {
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        setLandingData(draftData);
        setLoading(false);
      } else if (isNew) {
        const defaultData = createDefaultLandingData();
        setLandingData(defaultData);
        localStorage.setItem(getDraftKey('new'), JSON.stringify(defaultData));
        setLoading(false);
      } else {
        setLoading(true);
        const data = await getLandingPage(pageIdFromUrl);
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
      }
    };
    
    loadPage();
  }, [pageIdFromUrl, isNew, router, toast]);

  // This effect saves any changes to landingData to localStorage
  useEffect(() => {
    if (!loading) {
      const draftKey = getDraftKey(isNew ? 'new' : landingData.id);
      localStorage.setItem(draftKey, JSON.stringify(landingData));
    }
  }, [landingData, loading, isNew]);


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
    setIsSaving(true);
    let success = false;
    
    try {
        if (isNew) {
            const created = await createLandingPage(landingData);
            if (created) {
                localStorage.removeItem(getDraftKey('new'));
                router.replace(`/designer/${landingData.id}`);
                success = true;
            }
        } else {
            await updateLandingPage(pageIdFromUrl, landingData);
            success = true;
        }

        if (success) {
            toast({
                title: "¡Borrador guardado!",
                description: "Tus cambios han sido guardados.",
            });
        } else {
            throw new Error("No se pudo guardar la página.");
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
    return success;
};


  const handlePreview = async () => {
    setIsSaving(true);
    try {
      const previewData = {
        name: landingData.name,
        components: landingData.components,
        theme: landingData.theme,
      };
      localStorage.setItem('landing-page-preview-data', JSON.stringify(previewData));
      window.open('/preview', '_blank');
    } catch (error) {
       console.error("Error saving preview data:", error);
       toast({
         variant: "destructive",
         title: "Error de Previsualización",
         description: "No se pudieron preparar los datos para la previsualización.",
       });
    } finally {
      setTimeout(() => setIsSaving(false), 300);
    }
  };

  const handlePublish = async () => {
    const saved = await handleSaveDraft();
    if (!saved) {
      toast({
        variant: "destructive",
        title: "Error de publicación",
        description: "Primero se deben guardar los cambios. Inténtalo de nuevo.",
      });
      return;
    }
  
    setIsSaving(true);
    try {
      const pageIdToPublish = isNew ? landingData.id : pageIdFromUrl;
      await updateLandingPage(pageIdToPublish, { isPublished: true });
      const url = `${window.location.protocol}//${landingData.subdomain}.landed.co`;
      setPublicUrl(url);
      setShowPublishModal(true);
      toast({
        title: "¡Página publicada!",
        description: "Tu página ya está disponible públicamente.",
      });
    } catch (error) {
      console.error("Error publishing page:", error);
      toast({
        variant: "destructive",
        title: "Error al publicar",
        description: "No se pudo publicar la página. Inténtalo de nuevo.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
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
            <Button variant="outline" size="icon" onClick={handlePreview} disabled={isSaving}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">Previsualizar</span>
            </Button>
            <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar Borrador"}
            </Button>
            <Button onClick={handlePublish} disabled={isSaving}>Publicar</Button>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar>
            <SidebarContent>
                <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full">
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
            </SidebarContent>
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
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="rounded-full">
                        <Plus className="mr-2 h-4 w-4" /> Agregar Sección
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                      {Object.keys(componentMap).map((componentName) => (
                        <DropdownMenuItem key={componentName} onSelect={() => addComponent(componentName)}>
                          {componentName}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¡Página Publicada!</DialogTitle>
            <DialogDescription>
              Tu página está ahora en línea. Puedes compartir este enlace con quien quieras.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Enlace
              </Label>
              <Input
                id="link"
                defaultValue={publicUrl}
                readOnly
              />
            </div>
            <Button type="submit" size="sm" className="px-3" onClick={copyToClipboard}>
              <span className="sr-only">Copiar</span>
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cerrar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
