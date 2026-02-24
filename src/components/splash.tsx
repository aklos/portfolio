"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform float isDark;

varying vec2 vUv;

#define PI 3.14159265359

mat2 rot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
}

float wireframe(vec2 uv, float thickness) {
    vec2 grid = abs(fract(uv) - 0.5);
    return smoothstep(0.0, thickness, min(grid.x, grid.y));
}

float diagonalWire(vec2 uv, float thickness) {
    vec2 grid = abs(fract(uv + uv.yx) - 0.5);
    return smoothstep(0.0, thickness, min(grid.x, grid.y));
}

void main() {
    vec2 uv = vUv;
    float time = iTime * 0.1;

    uv = (uv - 0.5) * 2.0;
    uv.x *= iResolution.x / iResolution.y;

    uv *= rot(time * 0.3);

    float grid1 = wireframe(uv * 8.0, 0.02);
    float grid2 = wireframe(uv * 4.0 + time, 0.03);
    float grid3 = diagonalWire(uv * 6.0 - time * 0.5, 0.025);

    vec2 hexUV = uv * 5.0;
    hexUV *= rot(time * 0.2);
    vec2 hexGrid = abs(fract(hexUV) - 0.5);
    float hex = smoothstep(0.0, 0.03, min(hexGrid.x, hexGrid.y));

    float pattern = 1.0 - min(min(grid1, grid2), min(grid3, hex));

    float radius = length(uv);
    float fade = 1.0 - smoothstep(1.0, 2.0, radius);
    pattern *= fade;

    // Patent drawing warm palette
    vec3 color;
    if (isDark > 0.5) {
        // Dark mode — chalk/warm white lines on charcoal
        vec3 chalkColor = vec3(0.91, 0.89, 0.86); // #e8e4dc
        color = chalkColor * pattern * 0.35;
    } else {
        // Light mode — warm sepia/ink lines on cream
        vec3 inkColor = vec3(0.42, 0.39, 0.34); // warm brown-gray
        color = inkColor * pattern * 0.5;
    }

    gl_FragColor = vec4(color, pattern * 0.3);
}
`;

function Scene() {
    const meshRef = useRef<THREE.Mesh>(null);
    const { size, viewport } = useThree();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(
                window.matchMedia("(prefers-color-scheme: dark)").matches
            );
        };

        checkDarkMode();

        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        mq.addEventListener("change", checkDarkMode);

        return () => mq.removeEventListener("change", checkDarkMode);
    }, []);

    const uniforms = useMemo(
        () => ({
            iTime: { value: 0.0 },
            iResolution: { value: new THREE.Vector2(size.width, size.height) },
            isDark: { value: isDark ? 1.0 : 0.0 },
        }),
        [size.width, size.height, isDark]
    );

    useFrame((state) => {
        if (meshRef.current && meshRef.current.material) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.iTime.value = state.clock.getElapsedTime();
            material.uniforms.isDark.value = isDark ? 1.0 : 0.0;
        }
    });

    return (
        <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent={true}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

export default function Splash() {
    return (
        <div className="absolute inset-0 w-full h-full opacity-60 dark:opacity-30">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Scene />
            </Canvas>
        </div>
    );
}
