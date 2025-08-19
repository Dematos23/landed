

"use client";

import React, { useState, useEffect } from 'react';
import { Layers, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { cn } from '@/lib/utils';
import type { LandingPageComponent, LandingPageTheme, LandingPageData } from '@/lib/types';

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
    <section className="relative w-full bg-card text-center py-20 md:py-32 lg:py-40" style={backgroundStyles}>
        {hasResponsiveImages && (
        <>
          {backgroundImageDesktop && <img src={backgroundImageDesktop} alt="Desktop background" className="absolute inset-0 w-full h-full object-cover hidden md:block" />}
          {backgroundImageTablet && <img src={backgroundImageTablet} alt="Tablet background" className="absolute inset-0 w-full h-full object-cover hidden sm:block md:hidden" />}
          {backgroundImageMobile && <img src={backgroundImageMobile} alt="Mobile background" className="absolute inset-0 w-full h-full object-cover sm:hidden" />}
        </>
      )}
      <div className="container relative z-10 px-4 md:px-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-card-foreground mb-4">{headline}</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground mb-8">{subheadline}</p>
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
    </section>
  )
};

const FeaturesPreview = ({ title, features, backgroundType, backgroundImage }: { title: string, features: { title: string, description: string }[], backgroundType: 'color' | 'image', backgroundImage: string }) => {
  const backgroundStyles: React.CSSProperties =
    backgroundType === 'image' && backgroundImage
      ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : {};
  return (
  <section className="relative w-full bg-card py-12 md:py-24 lg:py-32" style={backgroundStyles}>
     <div className="container relative z-10 px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center text-card-foreground mb-8 md:mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
            <div key={index} className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mx-auto mb-4">
                    <Layers className="h-6 w-6"/>
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground mt-2">{feature.description}</p>
            </div>
            ))}
        </div>
     </div>
  </section>
)};

const CtaPreview = ({ title, subtitle, buttonText, buttonUrl, backgroundType, backgroundImage }: { title: string, subtitle: string, buttonText: string, buttonUrl: string, backgroundType: 'color' | 'image', backgroundImage: string }) => {
  const backgroundStyles: React.CSSProperties =
    backgroundType === 'image' && backgroundImage
      ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : {};
      
  return (
    <section className="relative w-full bg-card py-12 md:py-24 lg:py-32" style={backgroundStyles}>
        <div className="container relative z-10 px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold text-card-foreground">{title}</h2>
            <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>
            <Button size="lg" asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href={buttonUrl}>{buttonText}</a>
            </Button>
        </div>
    </section>
  )
};

const TestimonialsPreview = ({ title, testimonials }: { title: string, testimonials: { quote: string, name: string, company: string }[] }) => (
    <section className="w-full bg-card py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center text-card-foreground mb-8 md:mb-12">{title}</h2>
            <div className="grid md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-primary/5 p-6 rounded-lg">
                        <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                        <div className="flex items-center mt-4">
                            <div className="w-12 h-12 rounded-full bg-muted mr-4 flex items-center justify-center">
                               <Star className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FaqPreview = ({ title, faqs }: { title: string, faqs: { question: string, answer: string }[] }) => (
    <section className="w-full bg-card py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-card-foreground mb-8 md:mb-12">{title}</h2>
            <div className="space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index}>
                        <h3 className="font-semibold text-lg text-card-foreground">{faq.question}</h3>
                        <p className="text-muted-foreground mt-1">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FooterPreview = ({ copyright, links }: { copyright: string, links: { text: string, url: string }[] }) => (
    <footer className="w-full bg-gray-900 text-white py-6">
        <div className="container px-4 md:px-6 flex justify-between items-center">
            <p className="text-sm">{copyright}</p>
            <div className="flex space-x-4">
                {links.map((link, index) => (
                  <a key={index} href={link.url} className="text-sm hover:underline">{link.text}</a>
                ))}
            </div>
        </div>
    </footer>
);


const componentMap: { [key: string]: React.ComponentType<any> } = {
  'Sección de Héroe': HeroPreview,
  'Características': FeaturesPreview,
  'CTA': CtaPreview,
  'Testimonios': TestimonialsPreview,
  'Preguntas Frecuentes': FaqPreview,
  'Pie de página': FooterPreview,
};

type PreviewData = Omit<LandingPageData, 'id' | 'userId' | 'subdomain' | 'isPublished' | 'createdAt' | 'updatedAt'>;

const PREVIEW_DATA_KEY = 'landing-page-preview-data';

export default function PreviewPage() {
  const [data, setData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreviewData = () => {
      try {
        const storedData = localStorage.getItem(PREVIEW_DATA_KEY);
        if (storedData) {
          setData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Error parsing preview data from localStorage", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial load
    loadPreviewData();

    // Listen for changes from the designer tab
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === PREVIEW_DATA_KEY && event.newValue) {
        try {
          setData(JSON.parse(event.newValue));
        } catch (error) {
          console.error("Error parsing updated preview data", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const theme = data?.theme;

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

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Cargando previsualización...</div>;
  }
  
  if (!data || !theme) {
    return <div className="flex h-screen items-center justify-center">No se encontraron datos para la previsualización.</div>;
  }

  return (
    <>
      <style>
        {`
          body {
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
          .bg-card { background-color: hsl(var(--card-hsl)); }
          .text-card-foreground { color: hsl(var(--foreground-hsl)); }
          .text-muted-foreground { color: hsl(var(--muted-foreground-hsl)); }
          
          .bg-primary { background-color: hsl(var(--primary-hsl)); }
          .text-primary-foreground { color: hsl(var(--primary-foreground-hsl)); }
          .hover\\:bg-primary\\/90:hover { background-color: hsla(${hexToHsl(theme.primary).replace(/ /g, ', ')}, 0.9); }
          .bg-primary\\/10 { background-color: hsla(${hexToHsl(theme.primary).split(' ').join(', ')}, 0.1); }
          .bg-primary\\/5 { background-color: hsla(${hexToHsl(theme.primary).split(' ').join(', ')}, 0.05); }
          .text-primary { color: hsl(var(--primary-hsl)); }

          .bg-secondary { background-color: hsl(var(--secondary-hsl)); }
          .text-secondary-foreground { color: white; } /* Assuming white foreground for secondary for now */
          .hover\\:bg-secondary\\/90:hover { background-color: hsla(${hexToHsl(theme.secondary).replace(/ /g, ', ')}, 0.9); }
        `}
      </style>
      <main className="flex flex-col items-center">
        {data.components.map((component) => {
          const ComponentPreview = componentMap[component.name];
          if (!ComponentPreview) return null;
          return <ComponentPreview key={component.id} {...component.props} />;
        })}
      </main>
    </>
  );
}

    
