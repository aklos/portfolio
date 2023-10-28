import Image from "next/image";
import { Rubik } from "next/font/google";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import Link from "next/link";

const rubik = Rubik({
    subsets: ["latin"],
});

export default function Project(props: {
    title: string;
    position: string;
    image?: string;
    timePeriod?: string;
    children?: any;
    link?: string;
}) {
    return (
        <div>
            {props.image ? (
                <div className="relative w-full h-[260px]">
                    <Image
                        className="w-full aspect-auto"
                        src={props.image}
                        alt={props.image}
                        width={320}
                        height={260}
                    />
                </div>
            ) : null}
            <div>
                <div>
                    {!props.image ? <span className="mr-2">•</span> : null}
                    {props.link ? (
                        <Link
                            href={props.link}
                            className={`font-medium ${rubik.className} underline underline-offset-2`}
                        >
                            <span className="mr-1">{props.title}</span>
                            <LiaExternalLinkAltSolid className="inline-block text-lg mb-0.5" />
                        </Link>
                    ) : (
                        <span className={`font-medium ${rubik.className}`}>
                            {props.title}
                        </span>
                    )}
                    {props.timePeriod ? (
                        <span className="ml-2 italic opacity-60 text-sm">
                            {props.timePeriod}
                        </span>
                    ) : null}
                </div>
                <div className={!props.image ? "ml-3.5" : ""}>
                    {props.position}
                </div>
            </div>
            <div>{props.children}</div>
        </div>
    );
}
