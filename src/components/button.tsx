"use client";

import { Rubik } from "next/font/google";

const rubik = Rubik({
    subsets: ["latin"],
});

export default function Button(props: {
    label: string;
    url?: string;
    icon?: any;
}) {
    const Container = (_props: { children: any }) => {
        if (props.url) {
            return <a href={props.url}>{_props.children}</a>;
        }

        return <>{_props.children}</>;
    };
    return (
        <Container>
            <button className="flex items-center hover:bg-gray-200 transition duration-100 px-0.5 py-0.5">
                {props.icon ? props.icon : null}
                <span className={rubik.className}>{props.label}</span>
            </button>
        </Container>
    );
}
