import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Bebas_Neue, Geist_Mono, Schibsted_Grotesk } from "next/font/google";
import ThemeToggle from "@/components/theme-toggle";
import { EMAIL, PUBLICATION } from "@/lib/site";

const schibsted = Schibsted_Grotesk({
    subsets: ["latin"],
    variable: "--font-schibsted",
});

/* accent face, closest to the Bit Rot cover lettering: section headings and
   post titles */
const bebas = Bebas_Neue({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-bebas",
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-geist-mono",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://alexklos.ca"),
    title: "Alex Klos",
    description: "Alex Klos builds products, apps and games, and writes Bit Rot.",
    openGraph: {
        type: "website",
        siteName: "Alex Klos",
        url: "/",
        title: "Alex Klos",
        description: "I build products, apps & games.",
    },
    twitter: {
        card: "summary_large_image",
        creator: "@alexmklos",
    },
    alternates: {
        types: {
            "application/rss+xml": [
                { url: "/feed.xml", title: "Alex Klos" },
                { url: PUBLICATION.feed, title: PUBLICATION.name },
            ],
        },
    },
};

/* dark unless the visitor has picked light with the toggle */
const themeInit = `(function(){try{if(localStorage.getItem("theme")!=="light")document.documentElement.classList.add("dark")}catch(e){document.documentElement.classList.add("dark")}})()`;

const navLink = "text-sm text-muted hover:text-ink transition-colors";

const socials = [
    { label: "GitHub", href: "https://github.com/aklos" },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/alexander-klos-460787120",
    },
    { label: "X", href: "https://x.com/alexmklos" },
    { label: "RSS", href: "/feed.xml" },
];

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeInit }} />
            </head>
            <body
                className={`${schibsted.variable} ${bebas.variable} ${geistMono.variable} font-sans bg-paper text-ink antialiased`}
            >
                <header>
                    <div className="px-6 md:px-8 h-14 flex items-center justify-between gap-4">
                        <nav className="flex items-center gap-6 md:gap-8">
                            <Link
                                href="/"
                                className="font-semibold hover:text-muted transition-colors"
                            >
                                Alex Klos
                            </Link>
                            <Link
                                href="/#projects"
                                className={`${navLink} hidden sm:inline`}
                            >
                                Projects
                            </Link>
                            <Link
                                href="/#tools"
                                className={`${navLink} hidden sm:inline`}
                            >
                                Tools
                            </Link>
                            <Link href="/blog" className={navLink}>
                                Blog
                            </Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <a
                                href={`mailto:${EMAIL}`}
                                className="btn btn-sm btn-secondary max-sm:hidden"
                            >
                                Contact
                            </a>
                            <ThemeToggle />
                        </div>
                    </div>
                </header>
                {children}
                <footer className="max-w-4xl mx-auto px-6 pb-12">
                    <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
                        <span>&copy; {new Date().getFullYear()} Alex Klos</span>
                        <div className="flex gap-5">
                            {socials.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    className="hover:text-ink transition-colors"
                                >
                                    {s.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    );
}
