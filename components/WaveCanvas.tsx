"use client";
import React, { useRef, useEffect } from "react";

declare global {
    interface Window {
        SimplexNoise: any;
    }
}

const WaveCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const simplex = useRef<any>(null);

    // State for animation
    const state = useRef({
        dpr: 1,
        w: 0,
        h: 0,
        cx: 0,
        cy: 0,
        count: 0,
        xoff: 0,
        xinc: 0.05,
        yoff: 0,
        yinc: 0.003,
        goff: 0,
        ginc: 0.003,
        y: 0,
        length: 0,
        amp: 40,
    });

    // Reset canvas and state
    const reset = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const w = window.innerWidth;
        const h = 180; // Footer height

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        state.current.dpr = dpr;
        state.current.w = w;
        state.current.h = h;
        state.current.cx = w / 2;
        state.current.cy = h / 2;
        state.current.count = Math.floor(w / 50);
        state.current.xoff = 0;
        state.current.xinc = 0.05;
        state.current.yoff = 0;
        state.current.yinc = 0.003;
        state.current.goff = 0;
        state.current.ginc = 0.003;
        state.current.y = h * 0.66;
        state.current.length = w + 10;
        state.current.amp = 40;
    };

    // Draw a single wave
    const drawWave = (ctx: CanvasRenderingContext2D) => {
        const s = state.current;
        ctx.beginPath();
        let sway = simplex.current.noise2D(s.goff, 0) * s.amp;
        for (let i = 0; i <= s.count; i++) {
            s.xoff += s.xinc;
            let x = s.cx - s.length / 2 + (s.length / s.count) * i;
            let y = s.y + simplex.current.noise2D(s.xoff, s.yoff) * s.amp + sway;
            ctx[i === 0 ? "moveTo" : "lineTo"](x, y);
        }
        ctx.lineTo(s.w, s.h);
        ctx.lineTo(0, s.h);
        ctx.closePath();
        ctx.fillStyle = "hsla(210, 90%, 50%, 0.2)";
        ctx.fill();
    };

    // Animation loop
    const loop = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const s = state.current;

        ctx.clearRect(0, 0, s.w, s.h);
        s.xoff = 0;
        // Draw 4 waves per frame, just like the original
        drawWave(ctx);
        drawWave(ctx);
        drawWave(ctx);
        drawWave(ctx);

        s.yoff += s.yinc;
        s.goff += s.ginc;

        requestAnimationFrame(loop);
    };

    useEffect(() => {
        if (!window.SimplexNoise) {
            console.error("SimplexNoise not loaded. Add the script tag in public/index.html.");
            return;
        }
        simplex.current = new window.SimplexNoise();
        reset();
        loop();

        window.addEventListener("resize", reset);
        return () => {
            window.removeEventListener("resize", reset);
        };
        // eslint-disable-next-line
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="footer-wave-canvas"
            className="footer-wave-canvas"
            style={{
                display: "block",
                width: "100%",
                height: "180px",
                position: "absolute",
                left: 0,
                bottom: 0,
                zIndex: 1,
                pointerEvents: "none",
            }}
        />
    );
};

export default WaveCanvas;