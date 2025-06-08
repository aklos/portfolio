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

// Rotation matrix
mat2 rot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
}

// Create wireframe grid
float wireframe(vec2 uv, float thickness) {
    vec2 grid = abs(fract(uv) - 0.5);
    return smoothstep(0.0, thickness, min(grid.x, grid.y));
}

// Create diagonal wireframe
float diagonalWire(vec2 uv, float thickness) {
    vec2 grid = abs(fract(uv + uv.yx) - 0.5);
    return smoothstep(0.0, thickness, min(grid.x, grid.y));
}

void main() {
    vec2 uv = vUv;
    float time = iTime * 0.1;
    
    // Center and scale
    uv = (uv - 0.5) * 2.0;
    uv.x *= iResolution.x / iResolution.y;
    
    // Apply slow rotation
    uv *= rot(time * 0.3);
    
    // Create multiple grid layers
    float grid1 = wireframe(uv * 8.0, 0.02);
    float grid2 = wireframe(uv * 4.0 + time, 0.03);
    float grid3 = diagonalWire(uv * 6.0 - time * 0.5, 0.025);
    
    // Create hexagonal pattern
    vec2 hexUV = uv * 5.0;
    hexUV *= rot(time * 0.2);
    vec2 hexGrid = abs(fract(hexUV) - 0.5);
    float hex = smoothstep(0.0, 0.03, min(hexGrid.x, hexGrid.y));
    
    // Combine all patterns
    float pattern = 1.0 - min(min(grid1, grid2), min(grid3, hex));
    
    // Add radial fade
    float radius = length(uv);
    float fade = 1.0 - smoothstep(1.0, 2.0, radius);
    pattern *= fade;
    
    // Color based on dark/light mode
    vec3 color;
    if (isDark > 0.5) {
        // Dark mode - bright cyan lines
        color = vec3(0.0, 0.8, 1.0) * pattern;
    } else {
        // Light mode - dark lines
        color = vec3(0.2, 0.3, 0.5) * pattern;
    }
    
    // Add subtle glow effect
    color += color * 0.3 * (1.0 - pattern);
    
    gl_FragColor = vec4(color, pattern * 0.4);
}
`;

function Scene() {
    const meshRef = useRef<THREE.Mesh>(null);
    const { size, viewport } = useThree();
    const [isDark, setIsDark] = useState(false);

    // Check for dark mode
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        checkDarkMode();

        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
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
        <div className="absolute inset-0 w-full h-full dark:opacity-40">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Scene />
            </Canvas>
        </div>
    );
}
