/**
 * math.js — Shared math utilities for animations & shaders
 */

/** Linear interpolation between two values */
export const lerp = (a, b, t) => a + (b - a) * t;

/** Map a value from one range to another */
export const mapRange = (value, inMin, inMax, outMin, outMax) =>
    ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;

/** Clamp a value between min and max */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/** Normalise a value between 0 and 1 within [min, max] */
export const normalise = (value, min, max) => clamp((value - min) / (max - min), 0, 1);
