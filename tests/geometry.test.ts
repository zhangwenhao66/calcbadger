import { describe, expect, it } from 'vitest';
import {
	coneSlantHeight,
	coneSurfaceArea,
	coneVolume,
	cylinderSurfaceArea,
	cylinderVolume,
	prismSurfaceArea,
	prismVolume,
	sphereSurfaceArea,
	sphereVolume,
} from '../src/lib/geometry';

/**
 * Expected values are hand-derived algebra (Wolfram MathWorld formulas),
 * expressed as a multiple of Math.PI where relevant and computed
 * independently of the functions under test — not read back from their
 * output.
 */
describe('rectangular prism', () => {
	it('3 x 4 x 5 box: volume = 60, surface area = 94', () => {
		// V = 3*4*5 = 60. SA = 2*(3*4 + 3*5 + 4*5) = 2*(12+15+20) = 2*47 = 94.
		expect(prismVolume(3, 4, 5)).toBeCloseTo(60, 9);
		expect(prismSurfaceArea(3, 4, 5)).toBeCloseTo(94, 9);
	});

	it('1 x 1 x 1 cube: volume = 1, surface area = 6', () => {
		expect(prismVolume(1, 1, 1)).toBeCloseTo(1, 9);
		expect(prismSurfaceArea(1, 1, 1)).toBeCloseTo(6, 9);
	});

	it('2.5 x 3.5 x 4 box: volume = 35, surface area = 65.5', () => {
		// V = 2.5*3.5*4 = 35. SA = 2*(8.75+10+14) = 2*32.75 = 65.5.
		expect(prismVolume(2.5, 3.5, 4)).toBeCloseTo(35, 9);
		expect(prismSurfaceArea(2.5, 3.5, 4)).toBeCloseTo(65.5, 9);
	});

	it('zero height collapses volume and one pair of faces to zero area', () => {
		expect(prismVolume(4, 5, 0)).toBe(0);
		// SA = 2*(4*5 + 0 + 0) = 40 -- only the top/bottom faces remain.
		expect(prismSurfaceArea(4, 5, 0)).toBeCloseTo(40, 9);
	});
});

describe('cylinder', () => {
	it('radius 3, height 10: volume = 90*pi, surface area = 78*pi', () => {
		// V = pi*r^2*h = pi*9*10 = 90*pi.
		// SA = 2*pi*r*(r+h) = 2*pi*3*13 = 78*pi.
		expect(cylinderVolume(3, 10)).toBeCloseTo(90 * Math.PI, 9);
		expect(cylinderSurfaceArea(3, 10)).toBeCloseTo(78 * Math.PI, 9);
	});

	it('radius 1, height 1: volume = pi, surface area = 4*pi', () => {
		expect(cylinderVolume(1, 1)).toBeCloseTo(Math.PI, 9);
		expect(cylinderSurfaceArea(1, 1)).toBeCloseTo(4 * Math.PI, 9);
	});

	it('zero radius yields zero volume and zero surface area', () => {
		expect(cylinderVolume(0, 10)).toBe(0);
		expect(cylinderSurfaceArea(0, 10)).toBe(0);
	});
});

describe('sphere', () => {
	it('radius 5: volume = (500/3)*pi, surface area = 100*pi', () => {
		// V = (4/3)*pi*r^3 = (4/3)*pi*125 = (500/3)*pi.
		// SA = 4*pi*r^2 = 4*pi*25 = 100*pi.
		expect(sphereVolume(5)).toBeCloseTo((500 / 3) * Math.PI, 9);
		expect(sphereSurfaceArea(5)).toBeCloseTo(100 * Math.PI, 9);
	});

	it('radius 1 (unit sphere): volume = (4/3)*pi, surface area = 4*pi', () => {
		expect(sphereVolume(1)).toBeCloseTo((4 / 3) * Math.PI, 9);
		expect(sphereSurfaceArea(1)).toBeCloseTo(4 * Math.PI, 9);
	});

	it('zero radius yields zero volume and zero surface area', () => {
		expect(sphereVolume(0)).toBe(0);
		expect(sphereSurfaceArea(0)).toBe(0);
	});
});

describe('cone', () => {
	it('radius 3, height 4 (3-4-5 triangle): slant = 5, volume = 12*pi, surface area = 24*pi', () => {
		// slant = sqrt(3^2 + 4^2) = sqrt(25) = 5.
		// V = (1/3)*pi*r^2*h = (1/3)*pi*9*4 = 12*pi.
		// SA = pi*r^2 + pi*r*slant = pi*9 + pi*3*5 = 9*pi + 15*pi = 24*pi.
		expect(coneSlantHeight(3, 4)).toBeCloseTo(5, 9);
		expect(coneVolume(3, 4)).toBeCloseTo(12 * Math.PI, 9);
		expect(coneSurfaceArea(3, 4)).toBeCloseTo(24 * Math.PI, 9);
	});

	it('radius 5, height 12 (5-12-13 triangle): slant = 13, volume = 100*pi, surface area = 90*pi', () => {
		// slant = sqrt(25 + 144) = sqrt(169) = 13.
		// V = (1/3)*pi*25*12 = 100*pi.
		// SA = pi*25 + pi*5*13 = 25*pi + 65*pi = 90*pi.
		expect(coneSlantHeight(5, 12)).toBeCloseTo(13, 9);
		expect(coneVolume(5, 12)).toBeCloseTo(100 * Math.PI, 9);
		expect(coneSurfaceArea(5, 12)).toBeCloseTo(90 * Math.PI, 9);
	});

	it('zero radius yields zero volume and zero surface area', () => {
		expect(coneVolume(0, 10)).toBe(0);
		expect(coneSurfaceArea(0, 10)).toBe(0);
	});
});
