import Link from "next/link";

/* A quiet label above a group of tiles */
export default function SectionHeading({
    title,
    href,
    linkLabel,
}: {
    title: string;
    href?: string;
    linkLabel?: string;
}) {
    return (
        <div className="flex items-baseline justify-between gap-4 mb-4">
            <h2 className="text-base font-semibold">{title}</h2>
            {href && linkLabel && (
                <Link
                    href={href}
                    className="text-sm text-muted hover:text-ink transition-colors"
                >
                    {linkLabel}
                </Link>
            )}
        </div>
    );
}
