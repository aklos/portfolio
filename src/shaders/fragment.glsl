precision highp float;

// https://www.shadertoy.com/view/WtjyzR

uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;

varying vec2 vUv;

#define NUM_LAYERS 8.0
#define ITER 23 

vec4 tex(vec3 p)
{
    float t = iTime * 0.1;
    vec4 o = vec4(p.xyz, 3.0 * sin(t * 0.1));
    vec4 dec = vec4 (1.0, 0.9, 0.1, 0.15) + vec4(0.06 * cos(t * 0.1), 0, 0, 0.14 * cos(t * 0.23));
    for (int i = 0; i++ < ITER;) {
        o.xzyw = abs(o / dot(o, o) - dec);
    }
    return o;
}

void main() {
    vec2 uv = ((gl_FragCoord.xy - iResolution.xy) / iResolution.y) * 0.01;
    vec3 col = vec3(0);   
    float t = iTime * 0.03;
    
	for (float i = 0.0; i <= 1.0; i += 1.0 / NUM_LAYERS) {
        float d = fract(i + t); // depth
        float s = mix(5.0, 0.5, d); // scale
        float f = d * smoothstep(1.0, 0.9, d); //fade
        col+= tex(vec3(uv * s, i * 4.0)).xyz * f;
    }
    
    col /= NUM_LAYERS;
    col *= vec3(2, 1.0, 2.0);
   	col = pow(col, vec3(0.5));  

    gl_FragColor = vec4(col, 1.0);
}