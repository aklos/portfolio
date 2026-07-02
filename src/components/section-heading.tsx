export default function SectionHeading({
    title,
    sub,
}: {
    title: string;
    sub?: string;
}) {
    return (
        <div className="mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                {title}
                <span className="text-orange">.</span>
            </h2>
            {sub && <p className="text-sm text-muted mt-1">{sub}</p>}
        </div>
    );
}
