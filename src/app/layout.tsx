import Typewriter from "@/components/typewriter";
import "./globals.css";
import type { Metadata } from "next";
import { Rubik, Roboto } from "next/font/google";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import Button from "@/components/button";
import Link from "next/link";

export const rubik = Rubik({
    subsets: ["latin"],
});

export const roboto = Roboto({
    subsets: ["latin"],
    weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
    title: "Alex Klos / Prohobo.dev",
    description: "My portfolio site",
    icons: {
        icon: "https://prohobo.dev/favicon_2x.ico",
        apple: "https://prohobo.dev/favicon_2x.ico",
    },
    openGraph: {
        siteName: "PROHOBO.DEV",
        title: "Alex Klos / Prohobo.dev",
        description: "My portfolio site",
        images: {
            url: "https://prohobo.dev/icon.png",
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${roboto.className} bg`}>
                <main className="container px-0 md:px-8">
                    <nav className="w-full h-[54px] flex items-center px-4 md:px-0">
                        <div
                            className={`w-full flex items-center justify-between ${rubik.className}`}
                        >
                            <div className="font-medium">
                                <Link href="/">
                                    <Typewriter text="PROHOBO.DEV" delay={75} />
                                </Link>
                            </div>
                            <div>
                                <div className="flex items-center gap-4">
                                    <Button
                                        url="https://www.linkedin.com/in/alexander-klos-460787120"
                                        icon={
                                            <AiFillLinkedin className="text-2xl" />
                                        }
                                        label="LinkedIn"
                                        title="LinkedIn"
                                        shrink
                                    />
                                    <Button
                                        url="https://github.com/aklos"
                                        icon={
                                            <AiFillGithub className="text-2xl" />
                                        }
                                        label="Github"
                                        title="Github"
                                        shrink
                                    />
                                </div>
                            </div>
                        </div>
                    </nav>
                    <div className="min-h-screen">{children}</div>
                    <footer className="text-sm py-16">
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <Button
                                url="https://www.linkedin.com/in/alexander-klos-460787120"
                                icon={<AiFillLinkedin className="text-4xl" />}
                                title="LinkedIn"
                            />
                            <Button
                                url="https://github.com/aklos"
                                icon={<AiFillGithub className="text-4xl" />}
                                title="Github"
                            />
                        </div>
                        <div className="opacity-40 text-center">
                            <div>Copyright © Alexander Klos</div>
                            <div>
                                Suite 59, 30 Durham Road, London, SW20 0TW
                            </div>
                        </div>
                    </footer>
                </main>
            </body>
        </html>
    );
}
