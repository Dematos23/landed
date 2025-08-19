

import { notFound } from 'next/navigation';
import { admin } from '@/lib/firebase-admin';
import type { LandingPageData } from '@/lib/types';

import { Layers, Star, Zap, ShieldCheck, Heart, Award, ThumbsUp, Rocket, Gem } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { cn } from '@/lib/utils';
import type { LandingPageComponent, LandingPageTheme } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

// This function can be uncommented to generate static paths at build time if needed.
// export async function generateStaticParams() {
//   const snapshot = await admin.firestore().collection('landings').where('isPublished', '==', true).get();
//   return snapshot.docs.map(doc => ({
//     userSubdomain: doc.data().userSubdomain,
//     pageSlug: doc.data().pageSlug,
//   }));
// }

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Layers, Zap, ShieldCheck, Star, Heart, Award, ThumbsUp, Rocket, Gem,
};

const IconComponent = ({ name, className }: { name: string; className?: string }) => {
  const Icon = iconMap[name];
  return Icon ? <Icon className={className} /> : <Layers className={className} />;
};

// --- Component Previews ---
// These are the same rendering components from the preview page.

const HeroPreview = ({ 
  headline, subheadline, 
  cta1, cta2, cta1Url, cta2Url,
  numberOfButtons, cta1Style, cta2Style,
  backgroundType, backgroundImage, imageMode,
  backgroundImageDesktop, backgroundImageTablet, backgroundImageMobile,
  padding
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
  const getButtonStyle = (style: string) => style === 'primary' ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-secondary hover:bg-secondary/90 text-secondary-foreground";
  const backgroundAndPaddingStyles: React.CSSProperties = {
      ...(backgroundType === 'image' && imageMode === 'single' && backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
      paddingTop: `${padding.top}px`, paddingBottom: `${padding.bottom}px`, paddingLeft: `${padding.left}px`, paddingRight: `${padding.right}px`,
  };
  const hasResponsiveImages = backgroundType === 'image' && imageMode === 'responsive';
  return (
    <section className="relative w-full bg-card text-center" style={backgroundAndPaddingStyles}>
      {hasResponsiveImages && (
        <>
          {backgroundImageDesktop && <img src={backgroundImageDesktop} alt="Desktop background" className="absolute inset-0 w-full h-full object-cover hidden md:block" />}
          {backgroundImageTablet && <img src={backgroundImageTablet} alt="Tablet background" className="absolute inset-0 w-full h-full object-cover hidden sm:block md:hidden" />}
          {backgroundImageMobile && <img src={backgroundImageMobile} alt="Mobile background" className="absolute inset-0 w-full h-full object-cover sm:hidden" />}
        </>
      )}
      <div className="container relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-card-foreground mb-4">{headline}</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground mb-8">{subheadline}</p>
        <div className="flex justify-center gap-4">
          {numberOfButtons > 0 && <Button asChild size="lg" className={getButtonStyle(cta1Style)}><a href={cta1Url}>{cta1}</a></Button>}
          {numberOfButtons > 1 && <Button asChild size="lg" className={getButtonStyle(cta2Style)}><a href={cta2Url}>{cta2}</a></Button>}
        </div>
      </div>
    </section>
  );
};

const FeaturesPreview = ({ title, features, backgroundType, backgroundImage, padding }: any) => (
  <section className="relative w-full bg-card" style={{...(backgroundType === 'image' && backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}), paddingTop: `${padding.top}px`, paddingBottom: `${padding.bottom}px`, paddingLeft: `${padding.left}px`, paddingRight: `${padding.right}px`}}>
    <div className="container relative z-10">
      <h2 className="text-3xl font-bold text-center text-card-foreground mb-8 md:mb-12">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature: any, index: number) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mx-auto mb-4">
              <IconComponent name={feature.icon} className="h-6 w-6"/>
            </div>
            <h3 className="text-xl font-semibold text-card-foreground">{feature.title}</h3>
            <p className="text-muted-foreground mt-2">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CtaPreview = ({ title, subtitle, buttonText, buttonUrl, backgroundType, backgroundImage, padding }: any) => (
  <section className="relative w-full bg-card" style={{...(backgroundType === 'image' && backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}), paddingTop: `${padding.top}px`, paddingBottom: `${padding.bottom}px`, paddingLeft: `${padding.left}px`, paddingRight: `${padding.right}px`}}>
    <div className="container relative z-10 text-center">
      <h2 className="text-3xl font-bold text-card-foreground">{title}</h2>
      <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>
      <Button size="lg" asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"><a href={buttonUrl}>{buttonText}</a></Button>
    </div>
  </section>
);

const TestimonialsPreview = ({ title, testimonials, padding }: any) => (
  <section className="w-full bg-card" style={{ paddingTop: `${padding.top}px`, paddingBottom: `${padding.bottom}px`}}>
    <div className="container px-4 md:px-6" style={{ paddingLeft: `${padding.left}px`, paddingRight: `${padding.right}px`}}>
      <h2 className="text-3xl font-bold text-center text-card-foreground mb-8 md:mb-12">{title}</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {testimonials.map((testimonial: any, index: number) => (
          <div key={index} className="bg-primary/5 p-6 rounded-lg">
            <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
            <div className="flex items-center mt-4">
              <div className="w-12 h-12 rounded-full bg-muted mr-4 flex items-center justify-center"><Star className="w-6 h-6 text-primary" /></div>
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

const FaqPreview = ({ title, faqs, padding }: any) => (
  <section className="w-full bg-card" style={{ paddingTop: `${padding.top}px`, paddingBottom: `${padding.bottom}px`}}>
    <div className="container max-w-3xl mx-auto" style={{ paddingLeft: `${padding.left}px`, paddingRight: `${padding.right}px`}}>
      <h2 className="text-3xl font-bold text-center text-card-foreground mb-8 md:mb-12">{title}</h2>
      <div className="space-y-6">
        {faqs.map((faq: any, index: number) => (
          <div key={index}>
            <h3 className="font-semibold text-lg text-card-foreground">{faq.question}</h3>
            <p className="text-muted-foreground mt-1">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FooterPreview = ({ copyright, links, padding }: any) => (
  <footer className="w-full bg-gray-900 text-white" style={{ paddingTop: `${padding.top}px`, paddingBottom: `${padding.bottom}px`}}>
    <div className="container flex justify-between items-center" style={{ paddingLeft: `${padding.left}px`, paddingRight: `${padding.right}px`}}>
      <p className="text-sm">{copyright}</p>
      <div className="flex space-x-4">
        {links.map((link: any, index: number) => (<a key={index} href={link.url} className="text-sm hover:underline">{link.text}</a>))}
      </div>
    </div>
  </footer>
);

const FormPreview = ({ title, fields, buttonText, layout, layoutImage, backgroundType, backgroundImage, labelColor, fieldBackgroundColor, buttonColor, buttonTextColor, theme, padding }: any) => {
    const backgroundAndPaddingStyles: React.CSSProperties = {
      ...(backgroundType === 'image' && backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
      paddingTop: `${padding.top}px`, paddingBottom: `${padding.bottom}px`,
    };
    const renderField = (field: any) => {
        const props = { id: field.id, placeholder: field.placeholder, required: field.required, style: { backgroundColor: theme[fieldBackgroundColor], '--tw-ring-color': theme.primary } as React.CSSProperties };
        return field.type === 'textarea' ? <Textarea {...props} /> : <Input type={field.type} {...props} />;
    };
    const formContent = (
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {fields.map((field: any) => (<div key={field.id}><Label htmlFor={field.id} style={{ color: theme[labelColor] }}>{field.label}</Label>{renderField(field)}</div>))}
            <Button type="submit" className="w-full" style={{ backgroundColor: theme[buttonColor], color: theme[buttonTextColor] }}>{buttonText}</Button>
        </form>
    );
    return (
        <section className="relative w-full bg-card" style={backgroundAndPaddingStyles}>
            <div className="container relative z-10" style={{ paddingLeft: `${padding.left}px`, paddingRight: `${padding.right}px`}}>
                <h2 className="text-3xl font-bold text-center text-card-foreground mb-8">{title}</h2>
                {layout === 'centered' && (<div className="max-w-md mx-auto">{formContent}</div>)}
                {layout !== 'centered' && (
                    <div className={cn("grid md:grid-cols-2 gap-8 items-center")}>
                        {layout === 'left-image' && (<div className="relative w-full h-full min-h-[300px]">{layoutImage && <Image src={layoutImage} alt="Form visual" layout="fill" objectFit="contain" />}</div>)}
                        <div>{formContent}</div>
                        {layout === 'right-image' && (<div className="relative w-full h-full min-h-[300px]">{layoutImage && <Image src={layoutImage} alt="Form visual" layout="fill" objectFit="contain" />}</div>)}
                    </div>
                )}
            </div>
        </section>
    );
};


const componentMap: { [key: string]: React.ComponentType<any> } = {
  'Sección de Héroe': HeroPreview, 'Características': FeaturesPreview, 'CTA': CtaPreview,
  'Testimonios': TestimonialsPreview, 'Preguntas Frecuentes': FaqPreview, 'Formulario': FormPreview, 'Pie de página': FooterPreview,
};

async function getPublishedPage(userSubdomain: string, pageSlug: string): Promise<LandingPageData | null> {
    const landingsRef = admin.firestore().collection('landings');
    const querySnapshot = await landingsRef
      .where('userSubdomain', '==', userSubdomain)
      .where('pageSlug', '==', pageSlug)
      .where('isPublished', '==', true)
      .limit(1)
      .get();
  
    if (querySnapshot.empty) {
      return null;
    }
  
    const doc = querySnapshot.docs[0];
    return doc.data() as LandingPageData;
}

function hexToHsl(H: string) {
    if (!H) return '0 0% 0%';
    let r = 0, g = 0, b = 0;
    if (H.length == 4) { r = parseInt("0x" + H[1] + H[1]); g = parseInt("0x" + H[2] + H[2]); b = parseInt("0x" + H[3] + H[3]); }
    else if (H.length == 7) { r = parseInt("0x" + H[1] + H[2]); g = parseInt("0x" + H[3] + H[4]); b = parseInt("0x" + H[5] + H[6]); }
    r /= 255; g /= 255; b /= 255;
    let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin, h = 0, s = 0, l = 0;
    if (delta == 0) h = 0; else if (cmax == r) h = ((g - b) / delta) % 6; else if (cmax == g) h = (b - r) / delta + 2; else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return `${h} ${s}% ${l}%`;
}

export default async function PublicPage({ params }: { params: { userSubdomain: string, pageSlug: string } }) {
  const { userSubdomain, pageSlug } = params;
  const data = await getPublishedPage(userSubdomain, pageSlug);

  if (!data) {
    return notFound();
  }

  const theme = data.theme;
  
  if (!theme) {
      return <div>Theme not configured for this page.</div>;
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
          .text-secondary-foreground { color: white; }
          .hover\\:bg-secondary\\/90:hover { background-color: hsla(${hexToHsl(theme.secondary).replace(/ /g, ', ')}, 0.9); }
        `}
      </style>
      <main className="flex flex-col items-center">
        {data.components.map((component) => {
          const ComponentPreview = componentMap[component.name];
          if (!ComponentPreview) return null;
          return <ComponentPreview key={component.id} {...component.props} theme={theme} />;
        })}
      </main>
    </>
  );
}
