import { useTextContent } from "@/lib/hooks"
import { CheckCircle, CircleX } from "lucide-react";

interface ResultNoteProps {
    title: string;
    subtitle: string;
    icon: "success" | "fail"
}

export function ResultNote({
    title,
    subtitle,
    icon
}: ResultNoteProps) {

    function getIcon(icon: string) {
        switch (icon) {
            case "success":
                return <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
            case "fail":
                return <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full mb-4">
                    <CircleX className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
        }
    }

    return (
        <div className="text-center">
            {getIcon(icon)}
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-6">
                {subtitle}
            </p>
        </div>
    )
}