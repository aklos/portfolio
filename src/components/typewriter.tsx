"use client";

import { useState, useEffect } from "react";
import { Rubik } from "next/font/google";

const rubik = Rubik({
    subsets: ["latin"],
});

export default function Typewriter(props: { text: string; delay: number }) {
    const [currentText, setCurrentText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [initCaret, toggleInitCaret] = useState(true);

    useEffect(() => {
        if (currentIndex < props.text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(
                    (prevText) => prevText + props.text[currentIndex]
                );
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }, props.delay + Math.floor(Math.random() * 50));

            return () => clearTimeout(timeout);
        } else {
            if (currentText.length === props.text.length) {
                const timeout = setTimeout(
                    () => {
                        setCurrentText(currentText + " ▉");
                        setCurrentIndex((prevIndex) => prevIndex + 1);
                        toggleInitCaret(false);
                    },
                    initCaret ? props.delay : 500
                );

                return () => clearTimeout(timeout);
            } else {
                const timeout = setTimeout(() => {
                    setCurrentText((prevText) => prevText.slice(0, -2));
                    setCurrentIndex((prevIndex) => prevIndex - 1);
                }, 500);

                return () => clearTimeout(timeout);
            }
        }
    }, [currentIndex, props.delay, props.text]);

    return <span className={rubik.className}>{currentText}</span>;
}
