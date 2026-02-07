import { useTextContent } from "@/lib/hooks"
import { CheckCircle } from "lucide-react";

export function ContactSuccess() {

    const { getText } = useTextContent();

    return (
        <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{getText('contact.successTitle')}</h3>
            <p className="text-sm text-muted-foreground mb-6">
                {getText('contact.successMessage')}
            </p>
        </div>
    )
}