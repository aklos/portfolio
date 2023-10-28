"use client";

import { Rubik } from "next/font/google";

const rubik = Rubik({
    subsets: ["latin"],
});

export default function Button(props: {
    label?: string;
    title?: string;
    url?: string;
    icon?: any;
    shrink?: boolean;
}) {
    const Container = (_props: { children: any }) => {
        if (props.url) {
            return (
                <a href={props.url} title={props.title}>
                    {_props.children}
                </a>
            );
        }

        return <>{_props.children}</>;
    };
    return (
        <Container>
            <button
                className="flex items-center px-0.5 py-0.5"
                title={!props.url ? props.title : undefined}
            >
                {props.icon ? props.icon : null}
                {props.label ? (
                    <span
                        className={`${props.icon ? "ml-1" : ""} ${
                            props.shrink ? "hidden md:inline-block" : ""
                        } ${rubik.className}`}
                    >
                        {props.label}
                    </span>
                ) : null}
            </button>
        </Container>
    );
}
