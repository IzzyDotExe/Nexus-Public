'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContactPopup } from "@/lib/common/organisms/contact/contact-popup";
import { PageHeader } from "@/components/header/page-header";
import { useTextContent } from "@/lib/hooks/useTextContent";

export function HeaderNavigation() {
  const { getText } = useTextContent();

  return (
    <PageHeader title={getText('nav.title')}>
      <Button variant="ghost" size="default" asChild>
        <Link href="/">{getText('nav.home')}</Link>
      </Button>
      <Button variant="ghost" size="default" asChild>
        <Link href="/projects">{getText('nav.projects')}</Link>
      </Button>
      <Button variant="ghost" size="default" asChild>
        <Link href="/blog">{getText('nav.blog')}</Link>
      </Button>
      <ContactPopup
        trigger={
          <Button variant="outline" size="default">
            {getText('nav.contactMe')}
          </Button>
        }
      />
    </PageHeader>
  );
}
