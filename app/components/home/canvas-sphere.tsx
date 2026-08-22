"use client";

import { useEffect, useRef } from "react";

// --- Types & Constants ---
type Vec3 = [number, number, number];
type Face = [number, number, number];
type Edge = [number, number];

const COLORS = {
  STOKE: "#F97316", // Orange
  NODE: "#000000", // Black
};

const ROTATION_SPEEDS = {
  X: 0.0024,
  Y: 0.0036,
  Z: 0.0016,
};

// --- Geometry Helpers ---

/**
 * Generates a subdivided Icosphere wireframe.
 */
function generateIcosphere(subdivisions: number = 1): {
  vertices: Vec3[];
  edges: Edge[];
} {
  const phi = (1 + Math.sqrt(5)) / 2;
  const vertices: Vec3[] = [
    [-1, phi, 0],
    [1, phi, 0],
    [-1, -phi, 0],
    [1, -phi, 0],
    [0, -1, phi],
    [0, 1, phi],
    [0, -1, -phi],
    [0, 1, -phi],
    [phi, 0, -1],
    [phi, 0, 1],
    [-phi, 0, -1],
    [-phi, 0, 1],
  ].map((v) => {
    const len = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
    return [v[0] / len, v[1] / len, v[2] / len] as Vec3;
  });

  let faces: Face[] = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],
    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],
    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],
    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],
  ];

  const midPointCache = new Map<string, number>();

  const getMidPoint = (v1Idx: number, v2Idx: number) => {
    const key = v1Idx < v2Idx ? `${v1Idx}-${v2Idx}` : `${v2Idx}-${v1Idx}`;
    if (midPointCache.has(key)) return midPointCache.get(key)!;

    const v1 = vertices[v1Idx];
    const v2 = vertices[v2Idx];
    const mid: Vec3 = [
      (v1[0] + v2[0]) / 2,
      (v1[1] + v2[1]) / 2,
      (v1[2] + v2[2]) / 2,
    ];
    const len = Math.sqrt(mid[0] ** 2 + mid[1] ** 2 + mid[2] ** 2);
    const normalized: Vec3 = [mid[0] / len, mid[1] / len, mid[2] / len];

    vertices.push(normalized);
    const idx = vertices.length - 1;
    midPointCache.set(key, idx);
    return idx;
  };

  for (let i = 0; i < subdivisions; i++) {
    const nextFaces: Face[] = [];
    for (const [v1, v2, v3] of faces) {
      const a = getMidPoint(v1, v2);
      const b = getMidPoint(v2, v3);
      const c = getMidPoint(v3, v1);
      nextFaces.push([v1, a, c], [v2, b, a], [v3, c, b], [a, b, c]);
    }
    faces = nextFaces;
  }

  const edgeSet = new Set<string>();
  const edges: Edge[] = [];
  faces.forEach(([v1, v2, v3]) => {
    [
      [v1, v2],
      [v2, v3],
      [v3, v1],
    ].forEach(([a, b]) => {
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push([a, b]);
      }
    });
  });

  return { vertices, edges };
}

// --- Component ---

/**
 * A lightweight 3D Icosphere wireframe rendered on a 2D Canvas.
 */
export function CanvasSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const { vertices, edges } = generateIcosphere(2);

    const remToPx = (rem: number) => {
      if (typeof window === "undefined") return rem * 16;
      return (
        rem *
        parseFloat(getComputedStyle(document.documentElement).fontSize || "16")
      );
    };

    const resize = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || remToPx(25);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener("resize", resize);
    resize();

    let rx = 0,
      ry = 0,
      rz = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      rx += ROTATION_SPEEDS.X;
      ry += ROTATION_SPEEDS.Y;
      rz += ROTATION_SPEEDS.Z;

      const cX = Math.cos(rx),
        sX = Math.sin(rx);
      const cY = Math.cos(ry),
        sY = Math.sin(ry);
      const cZ = Math.cos(rz),
        sZ = Math.sin(rz);

      const isMobile = window.innerWidth < 768;
      const baseRadiusPx = remToPx(10);
      const radiusPx = isMobile ? remToPx(6) : baseRadiusPx;
      const scale = radiusPx / baseRadiusPx;
      const centerX = width / 2;
      const centerY = height / 2;

      // Map to store projected positions and depths for reuse
      const projected = vertices.map(
        (v): { x: number; y: number; z: number; p: number } => {
          let [x, y, z] = v;
          // Rotation
          const x1 = x * cZ - y * sZ;
          const y1 = x * sZ + y * cZ;
          x = x1;
          y = y1;
          const x2 = x * cY - z * sY;
          const z2 = x * sY + z * cY;
          x = x2;
          z = z2;
          const y3 = y * cX - z * sX;
          const z3 = y * sX + z * cX;
          y = y3;
          z = z3;

          const p = 1 / (1 - z * 0.2);
          return {
            x: centerX + x * radiusPx * p,
            y: centerY + y * radiusPx * p,
            z: z, // Depth range approx [-1, 1]
            p: p,
          };
        },
      );

      // Helper for opacity based on depth (z: -1 to 1)
      const getOpacity = (z: number) => {
        // Map z [-1, 1] to opacity [0, 1]
        return (z + 1) / 2;
      };

      // Draw Wireframe
      ctx.lineWidth = remToPx(0.0625) * scale;
      for (const [v1, v2] of edges) {
        const p1 = projected[v1];
        const p2 = projected[v2];

        // Average depth for the edge
        const avgZ = (p1.z + p2.z) / 2;
        ctx.globalAlpha = getOpacity(avgZ);
        ctx.strokeStyle = COLORS.STOKE;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Draw Nodes
      const nodeR = remToPx(0.09375) * scale;
      for (const p of projected) {
        ctx.globalAlpha = getOpacity(p.z);
        ctx.fillStyle = COLORS.NODE;

        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeR, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0; // Reset
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 pointer-events-none opacity-30"
    />
  );
}
