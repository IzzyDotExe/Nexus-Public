'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContactPopup } from "@/lib/common/organisms/contact/contact-popup";
import { PageHeader } from "@/components/header/page-header";
import { Typography } from "@/lib/common/atoms/typography";
import { useTextContent } from "@/lib/hooks/useTextContent";

export function HeaderNavigation() {
  const { getText } = useTextContent();

  return (
    <PageHeader title={<Typography textKey="nav.title" as="h1" className="text-lg font-semibold" />}>
      <Button variant="ghost" size="default" asChild>
        <Link href="/">
          <Typography textKey="nav.home" />
        </Link>
      </Button>
      <Button variant="ghost" size="default" asChild>
        <Link href="/projects">
          <Typography textKey="nav.projects" />
        </Link>
      </Button>
      <Button variant="ghost" size="default" asChild>
        <Link href="/blog">
          <Typography textKey="nav.blog" />
        </Link>
      </Button>
      <ContactPopup
        trigger={
          <Button variant="outline" size="default">
            <Typography textKey="nav.contactMe" />
          </Button>
        }
      />
    </PageHeader>
  );
}
