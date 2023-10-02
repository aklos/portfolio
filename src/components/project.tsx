import Image from "next/image";
import { Rubik } from "next/font/google";

const rubik = Rubik({
    subsets: ["latin"],
});

export default function Project(props: {
    title: string;
    position: string;
    image?: string;
    timePeriod?: string;
    children?: any;
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
                    <span className={`font-medium ${rubik.className}`}>
                        {props.title}
                    </span>
                    {props.timePeriod ? (
                        <span className="ml-2 italic opacity-60">
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
