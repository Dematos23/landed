

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
  Loader2,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { getLandingPage, createLandingPage, updateLandingPage } from '@/services/landings.client';
import { publishLanding } from '@/actions/landings';
import { claimUserSubdomain } from '@/actions/users';
import type { LandingPageData, LandingPageComponent, LandingPageTheme } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { Switch } from '@/components/ui/switch';

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
  backgroundImageDesktop, backgroundImageTablet, backgroundImageMobile,
  padding = { top: 0, bottom: 0, left: 0, right: 0 }
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
  padding: { top: number, bottom: number, left: number, right: number }
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

  const backgroundAndPaddingStyles: React.CSSProperties = {
      ...(backgroundType === 'image' && imageMode === 'single' && backgroundImage
        ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {}),
      paddingTop: `${padding.top}px`,
      paddingBottom: `${padding.bottom}px`,
      paddingLeft: `${padding.left}px`,
      paddingRight: `${padding.right}px`,
    };
  
  const hasResponsiveImages = backgroundType === 'image' && imageMode === 'responsive';

  return (
     <div className="relative w-full bg-card dark:bg-gray-800 rounded-lg shadow-md text-center pointer-events-none" style={backgroundAndPaddingStyles}>
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


const FeaturesPreview = ({ title, features, backgroundType, backgroundImage, padding = { top: 0, bottom: 0, left: 0, right: 0 } }: { title: string, features: { icon: string, title: string, description: string }[], backgroundType: 'color' | 'image', backgroundImage: string, padding: { top: number, bottom: number, left: number, right: number } }) => {
  const backgroundAndPaddingStyles: React.CSSProperties = {
      ...(backgroundType === 'image' && backgroundImage
        ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {}),
      paddingTop: `${padding.top}px`,
      paddingBottom: `${padding.bottom}px`,
      paddingLeft: `${padding.left}px`,
      paddingRight: `${padding.right}px`,
    };

  return (
    <div className="relative w-full bg-card dark:bg-gray-800 rounded-lg shadow-md pointer-events-none" style={backgroundAndPaddingStyles}>
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

const CtaPreview = ({ title, subtitle, buttonText, buttonUrl, backgroundType, backgroundImage, padding = { top: 0, bottom: 0, left: 0, right: 0 } }: { title: string, subtitle: string, buttonText: string, buttonUrl: string, backgroundType: 'color' | 'image', backgroundImage: string, padding: { top: number, bottom: number, left: number, right: number } }) => {
  const backgroundAndPaddingStyles: React.CSSProperties = {
    ...(backgroundType === 'image' && backgroundImage
      ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : {}),
    paddingTop: `${padding.top}px`,
    paddingBottom: `${padding.bottom}px`,
    paddingLeft: `${padding.left}px`,
    paddingRight: `${padding.right}px`,
  };
      
  return (
    <div className="relative w-full bg-card dark:bg-gray-800 rounded-lg shadow-md pointer-events-none" style={backgroundAndPaddingStyles}>
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

const TestimonialsPreview = ({ title, testimonials, padding = { top: 0, bottom: 0, left: 0, right: 0 } }: { title: string, testimonials: { quote: string, name: string, company: string }[], padding: { top: number, bottom: number, left: number, right: number } }) => (
    <div className="w-full bg-card dark:bg-gray-800 rounded-lg shadow-md pointer-events-none" style={{ paddingTop: `${padding.top}px`, paddingBottom: `${padding.bottom}px`, paddingLeft: `${padding.left}px`, paddingRight: `${padding.right}px`}}>
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

const FaqPreview = ({ title, faqs, padding = { top: 0, bottom: 0, left: 0, right: 0 } }: { title: string, faqs: { question: string, answer: string }[], padding: { top: number, bottom: number, left: number, right: number } }) => (
    <div className="w-full bg-card dark:bg-gray-800 rounded-lg shadow-md pointer-events-none" style={{ paddingTop: `${padding.top}px`, paddingBottom: `${padding.bottom}px`, paddingLeft: `${padding.left}px`, paddingRight: `${padding.right}px`}}>
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

const FooterPreview = ({ copyright, links, padding = { top: 0, bottom: 0, left: 0, right: 0 } }: { copyright: string, links: { text: string, url: string }[], padding: { top: number, bottom: number, left: number, right: number } }) => (
    <div className="w-full bg-gray-900 text-white rounded-lg shadow-md pointer-events-none" style={{ paddingTop: `${padding.top}px`, paddingBottom: `${padding.bottom}px`, paddingLeft: `${padding.left}px`, paddingRight: `${padding.right}px`}}>
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

const FormPreview = ({
  title,
  fields,
  buttonText,
  layout,
  layoutImage,
  backgroundType,
  backgroundImage,
  labelColor,
  fieldBackgroundColor,
  buttonColor,
  buttonTextColor,
  theme,
  padding = { top: 0, bottom: 0, left: 0, right: 0 }
}: {
  title: string,
  fields: { id: string, type: string, label: string, placeholder: string, required: boolean }[],
  buttonText: string,
  layout: string,
  layoutImage: string,
  backgroundType: string,
  backgroundImage: string,
  labelColor: keyof LandingPageTheme,
  fieldBackgroundColor: keyof LandingPageTheme,
  buttonColor: keyof LandingPageTheme,
  buttonTextColor: keyof LandingPageTheme,
  theme: LandingPageTheme,
  padding: { top: number, bottom: number, left: number, right: number }
}) => {
    const backgroundAndPaddingStyles: React.CSSProperties = {
      ...(backgroundType === 'image' && backgroundImage
        ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {}),
      paddingTop: `${padding.top}px`,
      paddingBottom: `${padding.bottom}px`,
      paddingLeft: `${padding.left}px`,
      paddingRight: `${padding.right}px`,
    };

    const renderField = (field: any) => {
        const fieldStyle: React.CSSProperties = {
            backgroundColor: theme[fieldBackgroundColor],
        };
        switch (field.type) {
            case 'textarea':
                return <Textarea placeholder={field.placeholder} disabled style={fieldStyle} />;
            default:
                return <Input type={field.type} placeholder={field.placeholder} disabled style={fieldStyle} />;
        }
    };

    const formContent = (
        <div className="space-y-4">
            {fields.map((field) => (
                <div key={field.id}>
                    <Label style={{ color: theme[labelColor] }}>{field.label}</Label>
                    {renderField(field)}
                </div>
            ))}
            <Button 
              className="w-full" 
              disabled 
              style={{ backgroundColor: theme[buttonColor], color: theme[buttonTextColor] }}
            >
              {buttonText}
            </Button>
        </div>
    );
    
    return (
        <div className="relative w-full bg-card dark:bg-gray-800 rounded-lg shadow-md pointer-events-none overflow-hidden" style={backgroundAndPaddingStyles}>
            <div className="relative z-10">
                <h2 className="text-3xl font-bold text-center text-card-foreground dark:text-white mb-8">{title}</h2>
                {layout === 'centered' && (
                    <div className="max-w-md mx-auto">{formContent}</div>
                )}
                {layout !== 'centered' && (
                    <div className={cn("grid md:grid-cols-2 gap-8 items-center")}>
                        {layout === 'left-image' && (
                            <div className="w-full h-full flex items-center justify-center">
                                {layoutImage && <Image src={layoutImage} alt="Form visual" width={400} height={500} className="object-contain max-h-full" />}
                            </div>
                        )}
                        <div>{formContent}</div>
                        {layout === 'right-image' && (
                            <div className="w-full h-full flex items-center justify-center">
                               {layoutImage && <Image src={layoutImage} alt="Form visual" width={400} height={500} className="object-contain max-h-full" />}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Component Edit Forms ---

const EditHeroForm = ({ data, onSave, onCancel }: { data: any, onSave: (newData: any) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState({
        ...data.props,
        padding: data.props.padding || { top: 80, bottom: 80, left: 32, right: 32 }
    });
    const fileInputRefSingle = useRef<HTMLInputElement>(null);
    const fileInputRefDesktop = useRef<HTMLInputElement>(null);
    const fileInputRefTablet = useRef<HTMLInputElement>(null);
    const fileInputRefMobile = useRef<HTMLInputElement>(null);

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

    const handlePaddingChange = (side: string, value: string) => {
        setFormData({
            ...formData,
            padding: {
                ...formData.padding,
                [side]: parseInt(value) || 0
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Sección de Héroe</h3>
            
            <Accordion type="multiple" defaultValue={['content']} className="w-full">
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
              <AccordionItem value="spacing">
                <AccordionTrigger>Espaciado</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                    <Label>Padding (en píxeles)</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="paddingTop" className="text-xs text-muted-foreground">Superior</Label>
                            <Input id="paddingTop" type="number" value={formData.padding.top} onChange={(e) => handlePaddingChange('top', e.target.value)} />
                        </div>
                         <div>
                            <Label htmlFor="paddingBottom" className="text-xs text-muted-foreground">Inferior</Label>
                            <Input id="paddingBottom" type="number" value={formData.padding.bottom} onChange={(e) => handlePaddingChange('bottom', e.target.value)} />
                        </div>
                         <div>
                            <Label htmlFor="paddingLeft" className="text-xs text-muted-foreground">Izquierdo</Label>
                            <Input id="paddingLeft" type="number" value={formData.padding.left} onChange={(e) => handlePaddingChange('left', e.target.value)} />
                        </div>
                         <div>
                            <Label htmlFor="paddingRight" className="text-xs text-muted-foreground">Derecho</Label>
                            <Input id="paddingRight" type="number" value={formData.padding.right} onChange={(e) => handlePaddingChange('right', e.target.value)} />
                        </div>
                    </div>
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
    const [formData, setFormData] = useState({
        ...data.props,
        padding: data.props.padding || { top: 80, bottom: 80, left: 32, right: 32 }
    });
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
    
    const handlePaddingChange = (side: string, value: string) => {
        setFormData({
            ...formData,
            padding: {
                ...formData.padding,
                [side]: parseInt(value) || 0
            }
        });
    }

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
               <AccordionItem value="spacing">
                <AccordionTrigger>Espaciado</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                    <Label>Padding (en píxeles)</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="paddingTop" className="text-xs text-muted-foreground">Superior</Label>
                            <Input id="paddingTop" type="number" value={formData.padding.top} onChange={(e) => handlePaddingChange('top', e.target.value)} />
                        </div>
                         <div>
                            <Label htmlFor="paddingBottom" className="text-xs text-muted-foreground">Inferior</Label>
                            <Input id="paddingBottom" type="number" value={formData.padding.bottom} onChange={(e) => handlePaddingChange('bottom', e.target.value)} />
                        </div>
                         <div>
                            <Label htmlFor="paddingLeft" className="text-xs text-muted-foreground">Izquierdo</Label>
                            <Input id="paddingLeft" type="number" value={formData.padding.left} onChange={(e) => handlePaddingChange('left', e.target.value)} />
                        </div>
                         <div>
                            <Label htmlFor="paddingRight" className="text-xs text-muted-foreground">Derecho</Label>
                            <Input id="paddingRight" type="number" value={formData.padding.right} onChange={(e) => handlePaddingChange('right', e.target.value)} />
                        </div>
                    </div>
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
    const [formData, setFormData] = useState({
        ...data.props,
        padding: data.props.padding || { top: 80, bottom: 80, left: 32, right: 32 }
    });
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
    
    const handlePaddingChange = (side: string, value: string) => {
        setFormData({
            ...formData,
            padding: {
                ...formData.padding,
                [side]: parseInt(value) || 0
            }
        });
    }

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
              <AccordionItem value="spacing">
                <AccordionTrigger>Espaciado</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                    <Label>Padding (en píxeles)</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="paddingTop" className="text-xs text-muted-foreground">Superior</Label>
                            <Input id="paddingTop" type="number" value={formData.padding.top} onChange={(e) => handlePaddingChange('top', e.target.value)} />
                        </div>
                         <div>
                            <Label htmlFor="paddingBottom" className="text-xs text-muted-foreground">Inferior</Label>
                            <Input id="paddingBottom" type="number" value={formData.padding.bottom} onChange={(e) => handlePaddingChange('bottom', e.target.value)} />
                        </div>
                         <div>
                            <Label htmlFor="paddingLeft" className="text-xs text-muted-foreground">Izquierdo</Label>
                            <Input id="paddingLeft" type="number" value={formData.padding.left} onChange={(e) => handlePaddingChange('left', e.target.value)} />
                        </div>
                         <div>
                            <Label htmlFor="paddingRight" className="text-xs text-muted-foreground">Derecho</Label>
                            <Input id="paddingRight" type="number" value={formData.padding.right} onChange={(e) => handlePaddingChange('right', e.target.value)} />
                        </div>
                    </div>
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
    const [formData, setFormData] = useState({
        ...data.props,
        padding: data.props.padding || { top: 80, bottom: 80, left: 32, right: 32 }
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    const handleTestimonialChange = (index: number, field: string, value: string) => {
        const newTestimonials = [...formData.testimonials];
        newTestimonials[index] = { ...newTestimonials[index], [field]: value };
        setFormData({ ...formData, testimonials: newTestimonials });
    };
    const handlePaddingChange = (side: string, value: string) => {
        setFormData({
            ...formData,
            padding: {
                ...formData.padding,
                [side]: parseInt(value) || 0
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Sección de Testimonios</h3>
             <Accordion type="multiple" defaultValue={['content']} className="w-full">
                <AccordionItem value="content">
                    <AccordionTrigger>Contenido</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <div>
                            <Label htmlFor="main-title">Título Principal</Label>
                            <Input id="main-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                        {formData.testimonials.map((testimonial: any, index: number) => (
                           <Accordion type="single" collapsible className="w-full" key={index}>
                             <AccordionItem value={`item-${index}`}>
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
                           </Accordion>
                        ))}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="spacing">
                <AccordionTrigger>Espaciado</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                    <Label>Padding (en píxeles)</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="paddingTop" className="text-xs text-muted-foreground">Superior</Label>
                            <Input id="paddingTop" type="number" value={formData.padding.top} onChange={(e) => handlePaddingChange('top', e.target.value)} />
                        </div>
                         <div>
                            <Label htmlFor="paddingBottom" className="text-xs text-muted-foreground">Inferior</Label>
                            <Input id="paddingBottom" type="number" value={formData.padding.bottom} onChange={(e) => handlePaddingChange('bottom', e.target.value)} />
                        </div>
                         <div>
                            <Label htmlFor="paddingLeft" className="text-xs text-muted-foreground">Izquierdo</Label>
                            <Input id="paddingLeft" type="number" value={formData.padding.left} onChange={(e) => handlePaddingChange('left', e.target.value)} />
                        </div>
                         <div>
                            <Label htmlFor="paddingRight" className="text-xs text-muted-foreground">Derecho</Label>
                            <Input id="paddingRight" type="number" value={formData.padding.right} onChange={(e) => handlePaddingChange('right', e.target.value)} />
                        </div>
                    </div>
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

const EditFaqForm = ({ data, onSave, onCancel }: { data: any, onSave: (newData: any) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState({
        ...data.props,
        padding: data.props.padding || { top: 80, bottom: 80, left: 32, right: 32 }
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    const handleFaqChange = (index: number, field: string, value: string) => {
        const newFaqs = [...formData.faqs];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        setFormData({ ...formData, faqs: newFaqs });
    };
     const handlePaddingChange = (side: string, value: string) => {
        setFormData({
            ...formData,
            padding: {
                ...formData.padding,
                [side]: parseInt(value) || 0
            }
        });
    }
    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Sección de FAQ</h3>
            <Accordion type="multiple" defaultValue={['content']} className="w-full">
                <AccordionItem value="content">
                    <AccordionTrigger>Contenido</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <div>
                            <Label htmlFor="main-title">Título Principal</Label>
                            <Input id="main-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                        {formData.faqs.map((faq: any, index: number) => (
                        <Accordion type="single" collapsible className="w-full" key={index}>
                            <AccordionItem value={`item-${index}`}>
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
                        </Accordion>
                        ))}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="spacing">
                <AccordionTrigger>Espaciado</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                    <Label>Padding (en píxeles)</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="paddingTop" className="text-xs text-muted-foreground">Superior</Label>
                            <Input id="paddingTop" type="number" value={formData.padding.top} onChange={(e) => handlePaddingChange('top', e.target.value)} />
                        </div>
                         <div>
                            <Label htmlFor="paddingBottom" className="text-xs text-muted-foreground">Inferior</Label>
                            <Input id="paddingBottom" type="number" value={formData.padding.bottom} onChange={(e) => handlePaddingChange('bottom', e.target.value)} />
                        </div>
                         <div>
                            <Label htmlFor="paddingLeft" className="text-xs text-muted-foreground">Izquierdo</Label>
                            <Input id="paddingLeft" type="number" value={formData.padding.left} onChange={(e) => handlePaddingChange('left', e.target.value)} />
                        </div>
                         <div>
                            <Label htmlFor="paddingRight" className="text-xs text-muted-foreground">Derecho</Label>
                            <Input id="paddingRight" type="number" value={formData.padding.right} onChange={(e) => handlePaddingChange('right', e.target.value)} />
                        </div>
                    </div>
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

const EditFooterForm = ({ data, onSave, onCancel }: { data: any, onSave: (newData: any) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState({
        ...data.props,
        padding: data.props.padding || { top: 32, bottom: 32, left: 32, right: 32 }
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    const handleLinkChange = (index: number, field: string, value: string) => {
        const newLinks = [...formData.links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setFormData({ ...formData, links: newLinks });
    };
    const handlePaddingChange = (side: string, value: string) => {
        setFormData({
            ...formData,
            padding: {
                ...formData.padding,
                [side]: parseInt(value) || 0
            }
        });
    }
    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Pie de Página</h3>
             <Accordion type="multiple" defaultValue={['content']} className="w-full">
                <AccordionItem value="content">
                    <AccordionTrigger>Contenido</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <div>
                            <Label htmlFor="copyright">Texto de Copyright</Label>
                            <Input id="copyright" value={formData.copyright} onChange={(e) => setFormData({ ...formData, copyright: e.target.value })} />
                        </div>
                        {formData.links.map((link: any, index: number) => (
                        <Accordion type="single" collapsible className="w-full" key={index}>
                            <AccordionItem value={`item-${index}`}>
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
                        </Accordion>
                        ))}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="spacing">
                    <AccordionTrigger>Espaciado</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <Label>Padding (en píxeles)</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="paddingTop" className="text-xs text-muted-foreground">Superior</Label>
                                <Input id="paddingTop" type="number" value={formData.padding.top} onChange={(e) => handlePaddingChange('top', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="paddingBottom" className="text-xs text-muted-foreground">Inferior</Label>
                                <Input id="paddingBottom" type="number" value={formData.padding.bottom} onChange={(e) => handlePaddingChange('bottom', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="paddingLeft" className="text-xs text-muted-foreground">Izquierdo</Label>
                                <Input id="paddingLeft" type="number" value={formData.padding.left} onChange={(e) => handlePaddingChange('left', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="paddingRight" className="text-xs text-muted-foreground">Derecho</Label>
                                <Input id="paddingRight" type="number" value={formData.padding.right} onChange={(e) => handlePaddingChange('right', e.target.value)} />
                            </div>
                        </div>
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

const EditFormForm = ({ data, onSave, onCancel }: { data: any, onSave: (newData: any) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState({
        ...data.props,
        padding: data.props.padding || { top: 80, bottom: 80, left: 32, right: 32 }
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const layoutFileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleFieldChange = (index: number, field: keyof typeof formData.fields[0], value: any) => {
        const newFields = [...formData.fields];
        newFields[index] = { ...newFields[index], [field]: value };
        setFormData({ ...formData, fields: newFields });
    };

    const addField = () => {
        const newField = { id: uuidv4(), type: 'text', label: 'Nuevo Campo', placeholder: '', required: false };
        setFormData({ ...formData, fields: [...formData.fields, newField] });
    };

    const removeField = (index: number) => {
        const newFields = formData.fields.filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, fields: newFields });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'backgroundImage' | 'layoutImage') => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          setFormData({ ...formData, [target]: dataUrl });
        };
        reader.readAsDataURL(file);
      }
    };
    
    const colorOptions: { value: keyof LandingPageTheme, label: string }[] = [
      { value: 'primary', label: 'Primario' },
      { value: 'secondary', label: 'Secundario' },
      { value: 'accent', label: 'Acento' },
      { value: 'foreground', label: 'Texto Títulos' },
      { value: 'mutedForeground', label: 'Texto Normal' },
      { value: 'primaryForeground', label: 'Texto Botón Primario' },
      { value: 'background1', label: 'Fondo 1' },
      { value: 'background2', label: 'Fondo 2' },
    ];

    const handlePaddingChange = (side: string, value: string) => {
        setFormData({
            ...formData,
            padding: {
                ...formData.padding,
                [side]: parseInt(value) || 0
            }
        });
    }
    
    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Sección de Formulario</h3>
            
            <Accordion type="multiple" defaultValue={['content', 'fields']} className="w-full">
                <AccordionItem value="content">
                    <AccordionTrigger>Contenido y Botón</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <div>
                            <Label htmlFor="form-title">Título</Label>
                            <Input id="form-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                        <div>
                            <Label htmlFor="form-button-text">Texto del Botón</Label>
                            <Input id="form-button-text" value={formData.buttonText} onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fields">
                    <AccordionTrigger>Campos del Formulario</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        {formData.fields.map((field: any, index: number) => (
                            <Accordion type="single" collapsible className="w-full border rounded-md px-2" key={field.id}>
                                <AccordionItem value={`field-${index}`} className="border-b-0">
                                    <div className="flex items-center">
                                      <AccordionTrigger className="flex-1">{field.label || `Campo ${index + 1}`}</AccordionTrigger>
                                      <Button variant="ghost" size="icon" onClick={() => removeField(index)} className="h-8 w-8">
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </div>
                                    <AccordionContent className="space-y-4 pt-2">
                                        <div>
                                            <Label>Etiqueta</Label>
                                            <Input value={field.label} onChange={(e) => handleFieldChange(index, 'label', e.target.value)} />
                                        </div>
                                        <div>
                                            <Label>Tipo de Campo</Label>
                                            <Select value={field.type} onValueChange={(value) => handleFieldChange(index, 'type', value)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="text">Texto</SelectItem>
                                                    <SelectItem value="email">Email</SelectItem>
                                                    <SelectItem value="textarea">Área de texto</SelectItem>
                                                    <SelectItem value="tel">Teléfono</SelectItem>
                                                    <SelectItem value="number">Número</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Placeholder</Label>
                                            <Input value={field.placeholder} onChange={(e) => handleFieldChange(index, 'placeholder', e.target.value)} />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch id={`required-${index}`} checked={field.required} onCheckedChange={(checked) => handleFieldChange(index, 'required', checked)} />
                                            <Label htmlFor={`required-${index}`}>Requerido</Label>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ))}
                        <Button type="button" variant="outline" onClick={addField}><Plus className="mr-2 h-4 w-4"/>Añadir Campo</Button>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="colors">
                    <AccordionTrigger>Colores</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Color de Etiquetas (Labels)</Label>
                            <Select value={formData.labelColor} onValueChange={(value) => setFormData({ ...formData, labelColor: value })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{colorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Fondo de Campos de Texto</Label>
                            <Select value={formData.fieldBackgroundColor} onValueChange={(value) => setFormData({ ...formData, fieldBackgroundColor: value })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{colorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label>Color del Botón</Label>
                            <Select value={formData.buttonColor} onValueChange={(value) => setFormData({ ...formData, buttonColor: value })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{colorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Color Texto del Botón</Label>
                             <Select value={formData.buttonTextColor} onValueChange={(value) => setFormData({ ...formData, buttonTextColor: value })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{colorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="layout">
                    <AccordionTrigger>Diseño</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <RadioGroup
                            defaultValue={formData.layout}
                            onValueChange={(value) => setFormData({ ...formData, layout: value })}
                            className="flex items-center gap-4"
                        >
                            <div className="flex items-center space-x-2"><RadioGroupItem value="centered" id="l-centered" /><Label htmlFor="l-centered">Centrado</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="left-image" id="l-left-image" /><Label htmlFor="l-left-image">Imagen a la Izquierda</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="right-image" id="l-right-image" /><Label htmlFor="l-right-image">Imagen a la Derecha</Label></div>
                        </RadioGroup>

                        {formData.layout !== 'centered' && (
                            <div className="space-y-2 border p-4 rounded-md">
                                <Label>Imagen de Diseño (PNG)</Label>
                                <p className="text-sm text-muted-foreground">Esta imagen aparecerá junto al formulario.</p>
                                <input type="file" accept="image/png, image/jpeg, image/gif" className="hidden" ref={layoutFileInputRef} onChange={(e) => handleFileChange(e, 'layoutImage')} />
                                <Button type="button" variant="outline" onClick={() => layoutFileInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" /> Subir Imagen</Button>
                                {formData.layoutImage && <Image src={formData.layoutImage} alt="Preview" width={100} height={100} className="object-cover rounded-md aspect-square mt-2" />}
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="background">
                    <AccordionTrigger>Fondo</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <RadioGroup defaultValue={formData.backgroundType} onValueChange={(value) => setFormData({ ...formData, backgroundType: value })} className="flex items-center gap-4">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="color" id="r-color-form" /><Label htmlFor="r-color-form">Color</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="image" id="r-image-form" /><Label htmlFor="r-image-form">Imagen</Label></div>
                        </RadioGroup>
                        {formData.backgroundType === 'image' && (
                            <div className="space-y-2 border p-4 rounded-md">
                               <Label>Imagen de Fondo</Label>
                               <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => handleFileChange(e, 'backgroundImage')} />
                               <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" /> Subir Imagen</Button>
                               {formData.backgroundImage && <Image src={formData.backgroundImage} alt="Preview" width={100} height={100} className="object-cover rounded-md aspect-square mt-2" />}
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="spacing">
                    <AccordionTrigger>Espaciado</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <Label>Padding (en píxeles)</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="paddingTop" className="text-xs text-muted-foreground">Superior</Label>
                                <Input id="paddingTop" type="number" value={formData.padding.top} onChange={(e) => handlePaddingChange('top', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="paddingBottom" className="text-xs text-muted-foreground">Inferior</Label>
                                <Input id="paddingBottom" type="number" value={formData.padding.bottom} onChange={(e) => handlePaddingChange('bottom', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="paddingLeft" className="text-xs text-muted-foreground">Izquierdo</Label>
                                <Input id="paddingLeft" type="number" value={formData.padding.left} onChange={(e) => handlePaddingChange('left', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="paddingRight" className="text-xs text-muted-foreground">Derecho</Label>
                                <Input id="paddingRight" type="number" value={formData.padding.right} onChange={(e) => handlePaddingChange('right', e.target.value)} />
                            </div>
                        </div>
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
      padding: { top: 80, bottom: 80, left: 32, right: 32 },
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
        padding: { top: 80, bottom: 80, left: 32, right: 32 },
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
        padding: { top: 80, bottom: 80, left: 32, right: 32 },
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
        ],
        padding: { top: 80, bottom: 80, left: 32, right: 32 },
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
        ],
        padding: { top: 80, bottom: 80, left: 32, right: 32 },
    }
  },
  'Formulario': {
      preview: FormPreview,
      edit: EditFormForm,
      defaultProps: {
          title: "Contáctanos",
          fields: [
              { id: uuidv4(), type: 'text', label: 'Nombre', placeholder: 'Tu nombre completo', required: true },
              { id: uuidv4(), type: 'email', label: 'Correo Electrónico', placeholder: 'tu@email.com', required: true },
              { id: uuidv4(), type: 'textarea', label: 'Mensaje', placeholder: '¿En qué podemos ayudarte?', required: false },
          ],
          buttonText: 'Enviar Mensaje',
          layout: 'centered', // 'centered', 'left-image', 'right-image'
          layoutImage: '', // URL a la imagen PNG para los layouts no centrados
          backgroundType: 'color',
          backgroundImage: '',
          labelColor: 'foreground',
          fieldBackgroundColor: 'background1',
          buttonColor: 'primary',
          buttonTextColor: 'primaryForeground',
          padding: { top: 80, bottom: 80, left: 32, right: 32 },
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
        ],
        padding: { top: 32, bottom: 32, left: 32, right: 32 },
    }
  },
};

const defaultTheme: LandingPageTheme = {
    primary: '#5CA0D3',
    primaryForeground: '#FFFFFF',
    secondary: '#7CC47D',
    accent: '#F7A35C',
    foreground: '#333333',
    mutedForeground: '#5C6BC0',
    background1: '#F5F5F5',
    background2: '#FFFFFF',
    fontFamily: 'Inter',
};

// This function creates the initial state for a new page
const createDefaultLandingData = (): Omit<LandingPageData, 'userId' | 'createdAt' | 'updatedAt'> => {
  const id = uuidv4();
  return {
    id: id,
    name: "Nueva Página de Aterrizaje",
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
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingComponent, setEditingComponent] = useState<ComponentData | null>(null);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isEditingName, setIsEditingName] = useState(false);
  
  const [publishModalState, setPublishModalState] = useState({
      open: false,
      publicUrl: '',
      devPublicUrl: ''
  });
  
  const [showSubdomainModal, setShowSubdomainModal] = useState(false);

  
  const getDraftKey = (pageId: string) => `landing-page-draft-${pageId}`;

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
    let newPageId = isNew ? landingData.id : pageIdFromUrl;

    try {
      if (isNew) {
        success = await createLandingPage(landingData as LandingPageData);
        if (success) {
          localStorage.removeItem(getDraftKey('new'));
          router.replace(`/designer/${newPageId}`);
        }
      } else {
        success = await updateLandingPage(pageIdFromUrl, landingData);
      }

      if (success) {
        toast({
          title: "¡Borrador guardado!",
          description: "Tus cambios han sido guardados.",
        });
      } else {
        throw new Error("Failed to save draft.");
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
      const result = await publishLanding(pageIdToPublish);

      if (result.success && result.publicUrl) {
          setPublishModalState({
              open: true,
              publicUrl: result.publicUrl,
              devPublicUrl: result.devPublicUrl || ''
          });
          toast({
            title: "¡Página publicada!",
            description: "Tu página ya está disponible públicamente.",
          });
      } else if (result.needsSubdomain) {
          setShowSubdomainModal(true);
      } else {
          throw new Error(result.error || "Failed to publish page via server action.");
      }
    } catch (error: any) {
      console.error("Error publishing page:", error);
      toast({
        variant: "destructive",
        title: "Error al publicar",
        description: error.message || "No se pudo publicar la página. Inténtalo de nuevo.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSubdomainClaim = async (subdomain: string) => {
    const result = await claimUserSubdomain(subdomain);
    if (result.success) {
      toast({ title: "¡Subdominio guardado!", description: `Tu subdominio ${result.normalized} ha sido reservado.`});
      setShowSubdomainModal(false);
      // Retry publishing
      await handlePublish();
      return true;
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
      return false;
    }
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
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        Cargando diseñador...
      </div>
    );
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
      <div className="flex h-screen w-full flex-row bg-background">
        <Sidebar>
          <SidebarContent>
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
                  <AccordionContent className="p-4 pt-0 space-y-2">
                     {Object.keys(componentMap).map((componentName) => (
                        <Button
                            key={componentName}
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => addComponent(componentName)}
                        >
                            <Plus className="mr-2 h-4 w-4" /> {componentName}
                        </Button>
                    ))}
                  </AccordionContent>
              </AccordionItem>
              </Accordion>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex flex-col flex-1">
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
                              <ComponentPreview {...component.props} theme={theme} />
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
               <div className="flex justify-center p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="lg">
                        <Plus className="mr-2 h-4 w-4" /> Agregar Componente
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                      {Object.keys(componentMap).map((componentName) => (
                        <DropdownMenuItem
                          key={componentName}
                          onSelect={() => addComponent(componentName)}
                        >
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
      <PublishSuccessModal
        open={publishModalState.open}
        onOpenChange={(open) => setPublishModalState(prev => ({ ...prev, open }))}
        publicUrl={publishModalState.publicUrl}
        devPublicUrl={publishModalState.devPublicUrl}
      />
      <SubdomainModal
        open={showSubdomainModal}
        onOpenChange={setShowSubdomainModal}
        onClaim={handleSubdomainClaim}
      />
    </>
  );
}


function PublishSuccessModal({ open, onOpenChange, publicUrl, devPublicUrl }: { open: boolean; onOpenChange: (open: boolean) => void; publicUrl: string; devPublicUrl?: string }) {
    const [isProdCopied, setIsProdCopied] = useState(false);
    const [isDevCopied, setIsDevCopied] = useState(false);

    const copyToClipboard = (url: string, type: 'prod' | 'dev') => {
        navigator.clipboard.writeText(url).then(() => {
            if (type === 'prod') {
                setIsProdCopied(true);
                setTimeout(() => setIsProdCopied(false), 2000);
            } else {
                setIsDevCopied(true);
                setTimeout(() => setIsDevCopied(false), 2000);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¡Página Publicada!</DialogTitle>
                    <DialogDescription>
                        Tu página está ahora en línea. Puedes compartir los siguientes enlaces.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="link-prod">Enlace de Producción</Label>
                        <div className="flex items-center space-x-2">
                           <Input id="link-prod" defaultValue={publicUrl} readOnly />
                            <Button size="sm" className="px-3" onClick={() => copyToClipboard(publicUrl, 'prod')}>
                                <span className="sr-only">Copiar</span>
                                {isProdCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                             <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                               <Button size="sm" variant="outline" className="px-3"><ExternalLink className="h-4 w-4" /></Button>
                            </a>
                        </div>
                    </div>
                    {devPublicUrl && (
                         <div className="space-y-2">
                            <Label htmlFor="link-dev">Enlace de Desarrollo (Solo Admins)</Label>
                            <div className="flex items-center space-x-2">
                               <Input id="link-dev" defaultValue={devPublicUrl} readOnly />
                                <Button size="sm" className="px-3" onClick={() => copyToClipboard(devPublicUrl, 'dev')}>
                                    <span className="sr-only">Copiar</span>
                                    {isDevCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                                <a href={devPublicUrl} target="_blank" rel="noopener noreferrer">
                                   <Button size="sm" variant="outline" className="px-3"><ExternalLink className="h-4 w-4" /></Button>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cerrar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


function SubdomainModal({ open, onOpenChange, onClaim }: { open: boolean, onOpenChange: (open: boolean) => void, onClaim: (subdomain: string) => Promise<boolean> }) {
  const [subdomain, setSubdomain] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsClaiming(true);
    const success = await onClaim(subdomain);
    if (!success) {
      setIsClaiming(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Elige tu subdominio</DialogTitle>
            <DialogDescription>
              Necesitas un subdominio para publicar tu página. Será tu dirección única en Landed.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                id="subdomain"
                placeholder="tu-empresa"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                disabled={isClaiming}
              />
              <span className="text-sm text-muted-foreground">.landed.pe</span>
            </div>
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost" disabled={isClaiming}>Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={isClaiming || !subdomain}>
                  {isClaiming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Reservar y Publicar
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  )
}


export default function DesignerPage() {
  return (
    <SidebarProvider>
      <DesignerPageContent />
    </SidebarProvider>
  );
}
