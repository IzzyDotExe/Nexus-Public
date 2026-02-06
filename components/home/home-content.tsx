'use client';

import { Button } from "@/components/ui/button";
import { PageHero } from "@/lib/molecules/fullscreen-hero";
import { ContactPopup } from "@/lib/molecules/contact-popup";
import { Card } from "@/components/ui/card";
import { Mail, ExternalLink, Heart } from "lucide-react";
import { useTextContent } from "@/lib/hooks/useTextContent";
import pagesConfig from "@/config/pages.json";

export function HomeContent() {
    const { getText } = useTextContent();
    
    return <>
        <PageHero 
            title={getText('home.title')} 
            subtitle={getText('home.subtitle')} 
            ctaText={getText('home.ctaText')} 
            imageSrc={pagesConfig.pages.home.heroImage}
            imageAlt={pagesConfig.pages.home.heroImageAlt}
            socialLinks={pagesConfig.pages.home.socialLinks}
            eyebrow={getText('home.eyebrow')}
        >
            <ContactPopup
                trigger={
                    <Button
                        size="lg"
                        className="w-fit"
                    >
                        {getText('home.contactButtonText')}
                        <Mail className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                }
            />
            <Button
                variant="ghost"
                size="lg"
                className="ml-4 w-fit"
            >
                <a href="/projects">
                    {getText('home.viewProjectsButtonText')}
                </a>
            </Button>
        </PageHero>

        <section className="container mx-auto px-4 py-16 lg:py-24">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">{getText('home.causes.sectionTitle')}</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    {getText('home.causes.sectionDescription')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                        <Heart className="h-8 w-8 text-accent shrink-0 mt-1" />
                        <div className="grow">
                            <h3 className="text-xl font-bold mb-2">{getText('home.causes.gaza.title')}</h3>
                            <p className="text-muted-foreground mb-4">
                                {getText('home.causes.gaza.description')}
                            </p>
                            <Button asChild className="w-full">
                                <a href={getText('home.causes.gaza.buttonLink')} target="_blank" rel="noopener noreferrer">
                                    {getText('home.causes.gaza.buttonText')}
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                        <Heart className="h-8 w-8 text-accent shrink-0 mt-1" />
                        <div className="grow">
                            <h3 className="text-xl font-bold mb-2">{getText('home.causes.haiti.title')}</h3>
                            <p className="text-muted-foreground mb-4">
                                {getText('home.causes.haiti.description')}
                            </p>
                            <Button asChild className="w-full">
                                <a href={getText('home.causes.haiti.buttonLink')} target="_blank" rel="noopener noreferrer">
                                    {getText('home.causes.haiti.buttonText')}
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                        <Heart className="h-8 w-8 text-accent shrink-0 mt-1" />
                        <div className="grow">
                            <h3 className="text-xl font-bold mb-2">{getText('home.causes.sudan.title')}</h3>
                            <p className="text-muted-foreground mb-4">
                                {getText('home.causes.sudan.description')}
                            </p>
                            <Button asChild className="w-full">
                                <a href={getText('home.causes.sudan.buttonLink')} target="_blank" rel="noopener noreferrer">
                                    {getText('home.causes.sudan.buttonText')}
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                        <Heart className="h-8 w-8 text-accent shrink-0 mt-1" />
                        <div className="grow">
                            <h3 className="text-xl font-bold mb-2">{getText('home.causes.folding.title')}</h3>
                            <p className="text-muted-foreground mb-4">
                                {getText('home.causes.folding.description')} <span className="italic">{getText('home.causes.folding.descriptionNote')}</span>
                            </p>
                            <Button asChild className="w-full">
                                <a href={getText('home.causes.folding.buttonLink')} target="_blank" rel="noopener noreferrer">
                                    {getText('home.causes.folding.buttonText')}
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                        <Heart className="h-8 w-8 text-accent shrink-0 mt-1" />
                        <div className="grow">
                            <h3 className="text-xl font-bold mb-2">{getText('home.causes.quebec.title')}</h3>
                            <p className="text-muted-foreground mb-4">
                                {getText('home.causes.quebec.description')}
                            </p>
                            <Button asChild className="w-full">
                                <a href={getText('home.causes.quebec.buttonLink')} target="_blank" rel="noopener noreferrer">
                                    {getText('home.causes.quebec.buttonText')}
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                        <Heart className="h-8 w-8 text-accent shrink-0 mt-1" />
                        <div className="grow">
                            <h3 className="text-xl font-bold mb-2">{getText('home.causes.archive.title')}</h3>
                            <p className="text-muted-foreground mb-4">
                                {getText('home.causes.archive.description')}
                            </p>
                            <Button asChild className="w-full">
                                <a href={getText('home.causes.archive.buttonLink')} target="_blank" rel="noopener noreferrer">
                                    {getText('home.causes.archive.buttonText')}
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    </>;
}
