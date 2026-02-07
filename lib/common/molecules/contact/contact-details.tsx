import { useTextContent } from "@/lib/hooks";
import { ContactInfo } from "@/lib/types/ContactInfo";
import { Mail, MessageCircle, Phone } from "lucide-react";

interface ContactDetailsProps {
    contactInfo: ContactInfo
}

export function ContactDetails({
    contactInfo
}: ContactDetailsProps) {

    const { getText } = useTextContent();

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                    <p className="text-sm font-medium">{getText('contact.emailLabel')}</p>
                    <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-sm text-primary hover:underline"
                    >
                        {contactInfo.email}
                    </a>
                </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                    <p className="text-sm font-medium">{getText('contact.phoneLabel')}</p>
                    <a
                        href={`tel:${contactInfo.phone.replace(/[^\d]/g, '')}`}
                        className="text-sm text-primary hover:underline"
                    >
                        {contactInfo.phone}
                    </a>
                </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <div>
                    <p className="text-sm font-medium">{getText('contact.discordLabel')}</p>
                    <p className="text-sm text-primary font-mono">
                        {contactInfo.discord}
                    </p>
                </div>
            </div>
        </div>
    )
}