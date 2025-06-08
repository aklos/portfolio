import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Alex Klos",
    description: "Software developer",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
            >
                {children}
            </body>
        </html>
    );
}
