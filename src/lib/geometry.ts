/**
 * Volume and surface area for the four solids covered by this calculator:
 * rectangular prism, cylinder, sphere, and cone. All four are elementary
 * geometry formulas (Wolfram MathWorld: "Cuboid," "Cylinder," "Sphere,"
 * "Cone") with no disputed variants.
 */

export type Shape = 'prism' | 'cylinder' | 'sphere' | 'cone';

/** length x width x height, all in the same linear unit. */
export function prismVolume(length: number, width: number, height: number): number {
	return length * width * height;
}

/** 2 x (lw + lh + wh) — the sum of the areas of all six rectangular faces. */
export function prismSurfaceArea(length: number, width: number, height: number): number {
	return 2 * (length * width + length * height + width * height);
}

/** pi * r^2 * h. */
export function cylinderVolume(radius: number, height: number): number {
	return Math.PI * radius * radius * height;
}

/** 2 * pi * r * (r + h) — the two circular ends plus the curved side. */
export function cylinderSurfaceArea(radius: number, height: number): number {
	return 2 * Math.PI * radius * (radius + height);
}

/** (4/3) * pi * r^3. */
export function sphereVolume(radius: number): number {
	return (4 / 3) * Math.PI * radius ** 3;
}

/** 4 * pi * r^2. */
export function sphereSurfaceArea(radius: number): number {
	return 4 * Math.PI * radius * radius;
}

/** Distance from the apex to the edge of the base circle: sqrt(r^2 + h^2). */
export function coneSlantHeight(radius: number, height: number): number {
	return Math.sqrt(radius * radius + height * height);
}

/** (1/3) * pi * r^2 * h. */
export function coneVolume(radius: number, height: number): number {
	return (1 / 3) * Math.PI * radius * radius * height;
}

/** pi * r^2 (base) + pi * r * slant height (curved side). */
export function coneSurfaceArea(radius: number, height: number): number {
	const slant = coneSlantHeight(radius, height);
	return Math.PI * radius * radius + Math.PI * radius * slant;
}
