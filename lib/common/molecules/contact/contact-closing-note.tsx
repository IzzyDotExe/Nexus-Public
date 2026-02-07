import { useTextContent } from "@/lib/hooks"

export function ContactClosingNote() {

    const { getText } = useTextContent();

    return (
        <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
                {getText('contact.closingNote')}
            </p>
        </div>
    )
}