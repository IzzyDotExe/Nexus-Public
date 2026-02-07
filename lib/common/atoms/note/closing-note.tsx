import { useTextContent } from "@/lib/hooks"

interface ClosingNoteProps {
    textContent: string
}

export function ClosingNote({
    textContent
}: ClosingNoteProps) {

    return (
        <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
                {textContent}
            </p>
        </div>
    )
}