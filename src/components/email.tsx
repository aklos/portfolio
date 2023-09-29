"use client";

import { useEffect, useState } from "react";

export default function Email() {
    const [a, setA] = useState("");
    const [b, setB] = useState("");

    useEffect(() => {
        setA("alex");
        setB("prohobo.dev");
    });

    return (
        <a href={`mailto:${a}@${b}`} className="font-medium">{`${a}@${b}`}</a>
    );
}
