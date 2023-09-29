"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import vertexShader from "@/shaders/vertex.glsl";
import fragmentShader from "@/shaders/fragment.glsl";
import { useTexture } from "@react-three/drei";
import { Rubik } from "next/font/google";

const rubik = Rubik({
    subsets: ["latin"],
});

function Scene() {
    const meshRef = useRef(null);
    const { size } = useThree();

    const dims = {
        width: size.width / 32,
        height: size.height / 32,
    };

    const noiseTexture = useTexture("noise.jpg");

    useFrame((state) => {
        let time = state.clock.getElapsedTime();

        // start from 20 to skip first 20 seconds ( optional )
        (meshRef.current as any).material.uniforms.iTime.value = time + 20;
    });

    const uniforms = useMemo(
        () => ({
            iTime: {
                type: "f",
                value: 1.0,
            },
            iResolution: {
                type: "v2",
                value: new THREE.Vector2(dims.width, dims.height),
            },
            iChannel0: {
                type: "t",
                value: noiseTexture,
            },
        }),
        []
    );

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[dims.width, dims.height]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

export default function Splash() {
    return (
        <div className="relative">
            <Canvas
                className="bg-gray-200"
                style={{ width: "100%", height: "300px" }}
            >
                <Scene />
            </Canvas>
            <div
                className={`${rubik.className} absolute font-bold top-1/2 left-1/2 mix-blend-color text-white transform -translate-y-1/2 -translate-x-1/2 md:whitespace-nowrap`}
            >
                <span className="text-3xl md:text-5xl">ALEX KLOS /</span>
                <span className="whitespace-nowrap md:text-2xl">
                    SOFTWARE ENGINEER
                </span>
            </div>
        </div>
    );
}
