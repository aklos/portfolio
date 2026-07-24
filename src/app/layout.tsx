import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { League_Spartan, Mulish, DM_Mono } from "next/font/google";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { RiTwitterXFill } from "react-icons/ri";
import ThemeToggle from "@/components/theme-toggle";
import Pattern from "@/components/pattern";

const leagueSpartan = League_Spartan({
    subsets: ["latin"],
    weight: ["500", "600", "700", "800"],
    variable: "--font-league-spartan",
});

const mulish = Mulish({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-mulish",
});

const dmMono = DM_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-dm-mono",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://alexklos.ca"),
    title: "Alex Klos",
    description: "Software developer",
    icons: {
        icon: "/favicon.svg",
    },
};

const themeInit = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})()`;

const navLink =
    "relative text-sm text-muted hover:text-blue transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-orange after:scale-x-0 after:origin-left hover:after:scale-x-100 motion-safe:after:transition-transform after:duration-200";

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
                className={`${leagueSpartan.variable} ${mulish.variable} ${dmMono.variable} font-body bg-paper text-ink`}
            >
                <header className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="group relative inline-block font-display font-bold text-xl tracking-tight hover:text-blue transition-colors"
                    >
                        Alex Klos
                        <span className="absolute left-0 right-0 -bottom-1 h-[6px] overflow-hidden">
                            <Pattern
                                variant="wave"
                                className="absolute left-0 top-0 h-full w-[calc(100%+12px)] text-orange motion-safe:group-hover:animate-wave"
                            />
                        </span>
                    </Link>
                    <nav className="flex gap-5 items-center">
                        <Link href="/blog" className={navLink}>
                            Blog
                        </Link>
                        <a
                            href="mailto:alex@prohobo.dev"
                            className={`${navLink} hidden sm:inline-block`}
                        >
                            alex@prohobo.dev
                        </a>
                        <span className="w-px h-4 bg-line" />
                        <a
                            href="https://github.com/aklos"
                            aria-label="GitHub"
                            className="text-muted hover:text-blue transition-colors"
                        >
                            <AiFillGithub className="text-lg" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/alexander-klos-460787120"
                            aria-label="LinkedIn"
                            className="text-muted hover:text-blue transition-colors"
                        >
                            <AiFillLinkedin className="text-lg" />
                        </a>
                        <a
                            href="https://x.com/alexmklos"
                            aria-label="X"
                            className="text-muted hover:text-blue transition-colors"
                        >
                            <RiTwitterXFill className="text-base" />
                        </a>
                        <span className="w-px h-4 bg-line" />
                        <ThemeToggle />
                    </nav>
                </header>
                {children}
                <footer className="max-w-4xl mx-auto px-6 pb-16">
                    <div className="pt-16 flex items-center justify-between text-xs text-muted">
                        <div className="flex gap-5 items-center">
                            <a
                                href="https://github.com/aklos"
                                className="hover:text-blue transition-colors"
                            >
                                <AiFillGithub className="text-lg" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/alexander-klos-460787120"
                                className="hover:text-blue transition-colors"
                            >
                                <AiFillLinkedin className="text-lg" />
                            </a>
                            <a
                                href="https://x.com/alexmklos"
                                className="hover:text-blue transition-colors"
                            >
                                <RiTwitterXFill className="text-base" />
                            </a>
                        </div>
                        <div>&copy; {new Date().getFullYear()}</div>
                    </div>
                    <p className="mt-4 text-xs text-muted/50">
                        Alexander Klos / Suite 59, 30 Durham Road, London, SW20 0TW
                    </p>
                </footer>
            </body>
        </html>
    );
}
