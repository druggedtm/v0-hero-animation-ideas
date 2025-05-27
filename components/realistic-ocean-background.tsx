"use client"

import { useEffect, useRef } from "react"

// It's assumed that gl-matrix is loaded globally via a script tag in layout.tsx
declare const glMatrix: any

const RealisticOceanBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl2")
    if (!gl) {
      console.error("WebGL 2 not supported.")
      return
    }

    const shaderParams = {
      CAMERA_SPEED: 0.2,
      MOUSE_SENSITIVITY: 0.1,
      NUM_STEPS: 40,
      ITER_GEOMETRY: 3,
      ITER_FRAGMENT: 4,
      SEA_HEIGHT: 0.4,
      SEA_CHOPPY: 2.0,
      SEA_SPEED: 0.2,
      SEA_FREQ: 0.2
    }


    const vertexShaderSource = `#version 300 es
      in vec4 aPosition;
      void main() {
          gl_Position = aPosition;
      }`

    const fragmentShaderSource = `#version 300 es
      precision highp float;

      uniform vec3 iResolution;
      uniform float iTime;
      uniform vec4 iMouse; // xy = mouse coord, zw = click (not used here but part of original shader)
      uniform int uNumSteps;
      uniform int uGeometryIter;
      uniform int uFragmentIter;
      uniform float uSeaHeight;
      uniform float uSeaChoppy;
      uniform float uSeaSpeed;
      uniform float uSeaFreq;
      uniform float uCameraSpeed;  
      uniform float uMouseSensitivity;
      out vec4 fragColor;

      const float PI	 	= 3.141592;
      const float EPSILON	= 1e-3;
      #define EPSILON_NRM (0.1 / iResolution.x)

      const vec3 SEA_BASE = vec3(0.0,0.07,0.15); // Adjusted for darker, deeper blue
      const vec3 SEA_WATER_COLOR = vec3(0.25,0.6,0.9)*0.7; // Adjusted for more vibrant blue
      #define SEA_TIME (1.0 + iTime * uSeaSpeed)
      const mat2 octave_m = mat2(1.6,1.2,-1.2,1.6);

      mat3 fromEuler(vec3 ang) {
        vec2 a1 = vec2(sin(ang.x),cos(ang.x));
        vec2 a2 = vec2(sin(ang.y),cos(ang.y));
        vec2 a3 = vec2(sin(ang.z),cos(ang.z));
        mat3 m;
        m[0] = vec3(a1.y*a3.y+a1.x*a2.x*a3.x,a1.y*a2.x*a3.x+a3.y*a1.x,-a2.y*a3.x);
        m[1] = vec3(-a2.y*a1.x,a1.y*a2.y,a2.x);
        m[2] = vec3(a3.y*a1.x*a2.x+a1.y*a3.x,a1.x*a3.x-a1.y*a3.y*a2.x,a2.y*a3.y);
        return m;
      }
      float hash( vec2 p ) {
        float h = dot(p,vec2(127.1,311.7));	
        return fract(sin(h)*43758.5453123);
      }
      float noise( in vec2 p ) {
        vec2 i = floor( p );
        vec2 f = fract( p );	
        vec2 u = f*f*(3.0-2.0*f);
        return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), 
                               hash( i + vec2(1.0,0.0) ), u.x),
                    mix( hash( i + vec2(0.0,1.0) ), 
                               hash( i + vec2(1.0,1.0) ), u.x), u.y);
      }

      float diffuse(vec3 n,vec3 l,float p) { return pow(dot(n,l) * 0.4 + 0.6,p); }
      float specular(vec3 n,vec3 l,vec3 e,float s) { float nrm = (s + 8.0) / (PI * 8.0); return pow(max(dot(reflect(e,n),l),0.0),s) * nrm; }

      vec3 getSkyColor(vec3 e) {
        e.y = (max(e.y,0.0)*0.8+0.2)*0.8;
        return vec3(pow(1.0-e.y,2.0), 1.0-e.y, 0.6+(1.0-e.y)*0.4) * 1.1;
      }

      float sea_octave(vec2 uv, float choppy) {
        uv += noise(uv);        
        vec2 wv = 1.0-abs(sin(uv));
        vec2 swv = abs(cos(uv));    
        wv = mix(wv,swv,wv);
        return pow(1.0-pow(wv.x * wv.y,0.65),choppy);
      }

      float map(vec3 p) {
        float freq = uSeaFreq;
        float amp = uSeaHeight;
        float choppy = uSeaChoppy;
        vec2 uv = p.xz; uv.x *= 0.75;
        float d, h = 0.0;    
        for(int i = 0; i < uGeometryIter; i++) {        
          d = sea_octave((uv+SEA_TIME)*freq,choppy);
          d += sea_octave((uv-SEA_TIME)*freq,choppy);
          h += d * amp;        
          uv *= octave_m; freq *= 1.9; amp *= 0.22;
          choppy = mix(choppy,1.0,0.2);
        }
        return p.y - h;
      }

      float map_detailed(vec3 p) {
        float freq = uSeaFreq;
        float amp = uSeaHeight;
        float choppy = uSeaChoppy;
        vec2 uv = p.xz; uv.x *= 0.75;
        float d, h = 0.0;    
        for(int i = 0; i < uFragmentIter; i++) {        
          d = sea_octave((uv+SEA_TIME)*freq,choppy);
          d += sea_octave((uv-SEA_TIME)*freq,choppy);
          h += d * amp;        
          uv *= octave_m; freq *= 1.9; amp *= 0.22;
          choppy = mix(choppy,1.0,0.2);
        }
        return p.y - h;
      }

      vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist) {  
        float fresnel = clamp(1.0 - dot(n, -eye), 0.0, 1.0);
        fresnel = pow(fresnel,3.0) * 0.65;
        vec3 reflected = getSkyColor(reflect(eye, n));    
        vec3 refracted = SEA_BASE + diffuse(n,l,80.0) * SEA_WATER_COLOR * 0.12; 
        vec3 color = mix(refracted,reflected,fresnel);
        float atten = max(1.0 - dot(dist,dist) * 0.001, 0.0);
        color += SEA_WATER_COLOR * (p.y - uSeaHeight) * 0.18 * atten;
        color += specular(n,l,eye,60.0);
        return color;
      }

      vec3 getNormal(vec3 p, float eps) {
        vec3 n;
        n.y = map_detailed(p);    
        n.x = map_detailed(vec3(p.x+eps,p.y,p.z)) - n.y;
        n.z = map_detailed(vec3(p.x,p.y,p.z+eps)) - n.y;
        n.y = eps;
        return normalize(n);
      }

      float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {  
        float tm = 0.0;
        float tx = 1000.0;    
        float hx = map(ori + dir * tx);
        if(hx > 0.0) {
            p = ori + dir * tx;
            return tx;   
        }
        float hm = map(ori);    
        float tmid = 0.0; // Initialize tmid
        for(int i = 0; i < uNumSteps; i++) {
            // Ensure (hm - hx) is not zero to prevent division by zero
            if (abs(hm - hx) < EPSILON) break;
            tmid = mix(tm, tx, hm / (hm - hx));
            p = ori + dir * tmid;
            float hmid = map(p);        
            if(hmid < 0.0) {
                tx = tmid;
                hx = hmid;
            } else {
                tm = tmid;
                hm = hmid;
            }        
            if(abs(hmid) < EPSILON) break;
        }
        // Re-calculate p with the final tmid to ensure it's set correctly
        if (abs(hm - hx) < EPSILON) { // Check again before final mix
             p = ori + dir * tmid; // Use last tmid if denominator is too small
             return tmid;
        }
        tmid = mix(tm,tx, hm/(hm-hx));
        p = ori + dir * tmid;
        return tmid;
      }

      vec3 getPixel(in vec2 coord, float time) {    
        vec2 uv = coord / iResolution.xy;
        uv = uv * 2.0 - 1.0;
        uv.x *= iResolution.x / iResolution.y;    
            
        vec3 ang = vec3(sin(time*3.0)*0.1,sin(time)*0.2+0.3,time);    
        vec3 ori = vec3(0.0,3.5,time*5.0 * uCameraSpeed);  
        vec3 dir = normalize(vec3(uv.xy,-2.0)); dir.z += length(uv) * 0.14;
        dir = normalize(dir) * fromEuler(ang);
        
        vec3 p;
        heightMapTracing(ori,dir,p);
        vec3 dist = p - ori;
        vec3 n = getNormal(p, dot(dist,dist) * EPSILON_NRM);
        vec3 light = normalize(vec3(0.0,1.0,0.8)); 
                 
        return mix(
            getSkyColor(dir),
            getSeaColor(p,n,light,dir,dist),
          pow(smoothstep(0.0,-0.02,dir.y),0.2));
      }

      void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
        float time = iTime * 0.3 + iMouse.x * 0.01 * uMouseSensitivity;
        vec3 color = getPixel(fragCoord, time);
        fragColor = vec4(pow(color,vec3(0.65)), 1.0);
      }

      void main() {
          mainImage(fragColor, gl_FragCoord.xy);
      }`

    function createShader(glCtx: WebGL2RenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type)
      if (!shader) {
        console.error("Unable to create shader")
        return null
      }
      glCtx.shaderSource(shader, source)
      glCtx.compileShader(shader)
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error("Shader compile error:", glCtx.getShaderInfoLog(shader))
        glCtx.deleteShader(shader)
        return null
      }
      return shader
    }

    function createProgram(glCtx: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      const program = glCtx.createProgram()
      if (!program) {
        console.error("Unable to create program")
        return null
      }
      glCtx.attachShader(program, vertexShader)
      glCtx.attachShader(program, fragmentShader)
      glCtx.linkProgram(program)
      if (!glCtx.getProgramParameter(program, glCtx.LINK_STATUS)) {
        console.error("Program link error:", glCtx.getProgramInfoLog(program))
        glCtx.deleteProgram(program)
        return null
      }
      return program
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader || !fragmentShader) return

    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) return

    const positionAttributeLocation = gl.getAttribLocation(program, "aPosition")
    const resolutionUniformLocation = gl.getUniformLocation(program, "iResolution")
    const timeUniformLocation = gl.getUniformLocation(program, "iTime")
    const mouseUniformLocation = gl.getUniformLocation(program, "iMouse")
    const numStepsUniformLocation = gl.getUniformLocation(program, "uNumSteps")
    const geometryIterUniformLocation = gl.getUniformLocation(program, "uGeometryIter")
    const fragmentIterUniformLocation = gl.getUniformLocation(program, "uFragmentIter")
    const seaHeightUniformLocation = gl.getUniformLocation(program, "uSeaHeight")
    const seaChoppyUniformLocation = gl.getUniformLocation(program, "uSeaChoppy")
    const seaSpeedUniformLocation = gl.getUniformLocation(program, "uSeaSpeed")
    const seaFreqUniformLocation = gl.getUniformLocation(program, "uSeaFreq")
    const cameraSpeedUniformLocation = gl.getUniformLocation(program, "uCameraSpeed")
    const mouseSensitivityUniformLocation = gl.getUniformLocation(program, "uMouseSensitivity")

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

    gl.useProgram(program)

    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX * 0.5; // Adjust scaling factor as needed
      mouseY = (canvas.height - e.clientY) * 0.5; // Adjust scaling factor as needed
    };
    canvas.addEventListener("mousemove", handleMouseMove);


    function resizeCanvas() {
      if (!canvas || !gl) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
      mouseX = canvas.width / 2
      mouseY = canvas.height / 2
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    let startTime = Date.now();

    function renderLoop() {
      if (!gl) return
      const currentTime = (Date.now() - startTime) * 0.001

      gl.uniform3f(resolutionUniformLocation!, gl.canvas.width, gl.canvas.height, 1.0)
      gl.uniform1f(timeUniformLocation!, currentTime)
      gl.uniform4f(mouseUniformLocation!, mouseX, mouseY, 0.0, 0.0)

      gl.uniform1i(numStepsUniformLocation, shaderParams.NUM_STEPS)
      gl.uniform1i(geometryIterUniformLocation, shaderParams.ITER_GEOMETRY)
      gl.uniform1i(fragmentIterUniformLocation, shaderParams.ITER_FRAGMENT)
      gl.uniform1f(seaHeightUniformLocation, shaderParams.SEA_HEIGHT)
      gl.uniform1f(seaChoppyUniformLocation, shaderParams.SEA_CHOPPY)
      gl.uniform1f(seaSpeedUniformLocation, shaderParams.SEA_SPEED)
      gl.uniform1f(seaFreqUniformLocation, shaderParams.SEA_FREQ)
      gl.uniform1f(cameraSpeedUniformLocation, shaderParams.CAMERA_SPEED)
      gl.uniform1f(mouseSensitivityUniformLocation, shaderParams.MOUSE_SENSITIVITY)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      animationFrameId.current = requestAnimationFrame(renderLoop)
    }

    animationFrameId.current = requestAnimationFrame(renderLoop)

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove);
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      gl.deleteBuffer(positionBuffer)
    }
  }, [])

  return <canvas ref={canvasRef} id="glCanvas" className="fixed top-0 left-0 w-full h-full -z-20" />
}

export default RealisticOceanBackground 