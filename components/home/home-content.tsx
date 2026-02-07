'use client';

import { Button } from "@/components/ui/button";
import { PageHero } from "@/lib/common/molecules/fullscreen-hero";
import { ContactPopup } from "@/lib/common/organisms/contact/contact-popup";
import { Mail } from "lucide-react";
import pagesConfig from "@/config/pages.json";
import { Typography } from "@/lib/common/atoms/typography";
import { CauseCard } from "./cause-card";

export function HomeContent() {
    return <>
        <PageHero 
            title={<Typography textKey="home.title" as="h1" className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"/>} 
            subtitle={<Typography textKey="home.subtitle" as="p" className="mb-8 text-lg text-muted-foreground sm:text-xl"/>} 
            imageSrc={pagesConfig.pages.home.heroImage}
            imageAlt={pagesConfig.pages.home.heroImageAlt}
            socialLinks={pagesConfig.pages.home.socialLinks}
            eyebrow={<Typography as="p" textKey="home.eyebrow" className="mb-4 text-lg font-medium text-muted-foreground sm:text-xl lg:text-2xl" />}
        >
            <ContactPopup
                trigger={
                    <Button
                        size="lg"
                        className="w-fit"
                    >
                        <Typography textKey="home.contactButtonText"/>
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
                    <Typography textKey="home.viewProjectsButtonText" />
                </a>
            </Button>
        </PageHero>

        <section className="container mx-auto px-4 py-16 lg:py-24">
            <div className="flex-col justify-center align-middle mb-12">
                <Typography as="h2" className="text-3xl text-center font-bold mb-4" textKey="home.causes.sectionTitle" />
                <Typography as="p" className="text-muted-foreground text-center text-lg max-w-2xl mx-auto" textKey="home.causes.sectionDescription" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <CauseCard 
                    titleKey="home.causes.gaza.title"
                    descriptionKey="home.causes.gaza.description"
                    buttonTextKey="home.causes.gaza.buttonText"
                    buttonLinkKey="home.causes.gaza.buttonLink"
                />
                <CauseCard 
                    titleKey="home.causes.haiti.title"
                    descriptionKey="home.causes.haiti.description"
                    buttonTextKey="home.causes.haiti.buttonText"
                    buttonLinkKey="home.causes.haiti.buttonLink"
                />
                <CauseCard 
                    titleKey="home.causes.sudan.title"
                    descriptionKey="home.causes.sudan.description"
                    buttonTextKey="home.causes.sudan.buttonText"
                    buttonLinkKey="home.causes.sudan.buttonLink"
                />
                <CauseCard 
                    titleKey="home.causes.folding.title"
                    descriptionKey="home.causes.folding.description"
                    buttonTextKey="home.causes.folding.buttonText"
                    buttonLinkKey="home.causes.folding.buttonLink"
                />
                <CauseCard 
                    titleKey="home.causes.quebec.title"
                    descriptionKey="home.causes.quebec.description"
                    buttonTextKey="home.causes.quebec.buttonText"
                    buttonLinkKey="home.causes.quebec.buttonLink"
                />
                <CauseCard 
                    titleKey="home.causes.archive.title"
                    descriptionKey="home.causes.archive.description"
                    buttonTextKey="home.causes.archive.buttonText"
                    buttonLinkKey="home.causes.archive.buttonLink"
                />
            </div>
        </section>
    </>;
}
