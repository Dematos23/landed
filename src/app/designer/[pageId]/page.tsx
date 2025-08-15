

"use client"

import React, { useState, useRef, useEffect } from 'react';
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
  Palette,
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


type ComponentData = {
  id: number;
  name: string;
  props: { [key: string]: any };
};

// --- Component Previews ---

const HeroPreview = ({ headline, subheadline, cta1, cta2, cta1Url, cta2Url }: { headline: string, subheadline: string, cta1: string, cta2: string, cta1Url: string, cta2Url: string }) => (
  <div className="w-full bg-card dark:bg-gray-800 rounded-lg shadow-md p-8 text-center pointer-events-none">
    <h1 className="text-4xl font-bold text-card-foreground dark:text-white mb-4">{headline}</h1>
    <p className="text-lg text-muted-foreground dark:text-gray-300 mb-6">{subheadline}</p>
    <div className="flex justify-center gap-4">
      <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
        <Link href={cta1Url}>{cta1}</Link>
      </Button>
      <Button size="lg" variant="outline" asChild>
        <Link href={cta2Url}>{cta2}</Link>
      </Button>
    </div>
  </div>
);

const FeaturesPreview = ({ title, features }: { title: string, features: { title: string, description: string }[] }) => (
  <div className="w-full bg-card dark:bg-gray-800 rounded-lg shadow-md p-8 pointer-events-none">
     <h2 className="text-3xl font-bold text-center text-card-foreground dark:text-white mb-8">{title}</h2>
     <div className="grid md:grid-cols-3 gap-8">
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
            <Button size="lg" className="mt-6 bg-primary hover:bg-primary/90" asChild>
                <Link href={buttonUrl}>{buttonText}</Link>
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
            <div className="flex justify-end gap-2">
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
    defaultProps: { headline: 'Tu Producto Increíble', subheadline: 'Un eslogan convincente que capta la atención.', cta1: 'Comenzar', cta2: 'Saber Más', cta1Url: '#', cta2Url: '#' }
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
    { id: 1, name: 'Sección de Héroe', props: componentMap['Sección de Héroe'].defaultProps },
    { id: 2, name: 'Características', props: componentMap['Características'].defaultProps },
];

export default function DesignerPage({ params }: { params: { pageId: string } }) {
  const isNew = params.pageId === 'new';
  const [components, setComponents] = useState<ComponentData[]>(initialComponents);
  const [editingComponent, setEditingComponent] = useState<ComponentData | null>(null);

  // Theme state
  const [theme, setTheme] = useState({
    primaryColor: '#6B7280',
    backgroundColor: '#F3F4F6',
    fontFamily: 'Inter',
  });

  // Drag and drop state
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --primary-hsl: ${hexToHsl(theme.primaryColor, { asString: false }).h} ${hexToHsl(theme.primaryColor, { asString: false }).s}% ${hexToHsl(theme.primaryColor, { asString: false }).l}%;
        --background-hsl: ${hexToHsl(theme.backgroundColor, { asString: false }).h} ${hexToHsl(theme.backgroundColor, { asString: false }).s}% ${hexToHsl(theme.backgroundColor, { asString: false }).l}%;
        --font-body: '${theme.fontFamily}', sans-serif;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [theme]);
  
  const handleThemeChange = (key: keyof typeof theme, value: string) => {
    setTheme(prev => ({ ...prev, [key]: value }));
  };

  function hexToHsl(H: string, { asString = true } = {}) {
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
      r = +("0x" + H[1] + H[1]);
      g = +("0x" + H[2] + H[2]);
      b = +("0x" + H[3] + H[3]);
    } else if (H.length == 7) {
      r = +("0x" + H[1] + H[2]);
      g = +("0x" + H[3] + H[4]);
      b = +("0x" + H[5] + H[6]);
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
  
    if (asString) return "hsl(" + h + "," + s + "%," + l + "%)";
    return { h, s, l };
  }


  const addComponent = (componentName: string) => {
    const newComponent = {
      id: Date.now(),
      name: componentName,
      props: componentMap[componentName].defaultProps
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
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="p-4 hover:no-underline">
                <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <span className="font-semibold text-base">Tema</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0 space-y-4">
                <div className="space-y-2">
                    <Label>Color Primario</Label>
                    <Input type="color" value={theme.primaryColor} onChange={(e) => handleThemeChange('primaryColor', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label>Color de Fondo</Label>
                    <Input type="color" value={theme.backgroundColor} onChange={(e) => handleThemeChange('backgroundColor', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Fuente</Label>
                  <Select value={theme.fontFamily} onValueChange={(value) => handleThemeChange('fontFamily', value)}>
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
          </Accordion>

          <Card className="border-none rounded-none">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2"><Layers className="h-4 w-4" /> Componentes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 px-4 pb-4">
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
          <div className="mx-auto max-w-5xl my-8 space-y-4 p-4" style={{ fontFamily: `var(--font-body)` }}>
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
