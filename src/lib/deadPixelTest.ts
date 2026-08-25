/**
 * Dead/stuck pixel visual test: color-cycle sequencing, pixel-refresh
 * flash-schedule math, and historical ISO pixel-fault-class math.
 *
 * Defect terminology and the ISO 13406-2 Class table below come from two
 * independently maintained Wikipedia articles that agree on the three
 * defect types: Wikipedia, "Defective pixel" (dark dot / bright dot /
 * stuck sub-pixel descriptions), and Wikipedia, "ISO 13406-2" (which
 * reproduces the standard's own fault-class table, max faults per 1
 * million pixels). ISO 13406-2:2001 was formally withdrawn and revised by
 * the ISO 9241-302/303/305/307:2008 series, but the old Class II numbers
 * are still the ones most manufacturer support pages and consumer pixel
 * policies reference, so they are presented here as reference figures,
 * not as a claim that any specific manufacturer follows them today --
 * check the manufacturer's own published policy before relying on this
 * for a return.
 */

export interface TestColor {
	name: string;
	hex: string;
	purpose: string;
}

export const TEST_COLORS: TestColor[] = [
	{
		name: 'Black',
		hex: '#000000',
		purpose: 'Reveals a hot/bright pixel (a sub-pixel stuck fully on) as a colored dot against solid black.',
	},
	{
		name: 'White',
		hex: '#ffffff',
		purpose: 'Reveals a dead/dark pixel (a sub-pixel stuck fully off) as a black dot against solid white.',
	},
	{
		name: 'Red',
		hex: '#ff0000',
		purpose: 'Isolates the red channel so a stuck green or blue sub-pixel shows up as an off-color dot.',
	},
	{
		name: 'Green',
		hex: '#00ff00',
		purpose: 'Isolates the green channel so a stuck red or blue sub-pixel shows up as an off-color dot.',
	},
	{
		name: 'Blue',
		hex: '#0000ff',
		purpose: 'Isolates the blue channel so a stuck red or green sub-pixel shows up as an off-color dot.',
	},
	{
		name: '50% Gray',
		hex: '#808080',
		purpose: 'A mid-tone that makes uneven backlighting and clouding easier to see than pure black or white.',
	},
];

export function nextColorIndex(current: number, length: number): number {
	if (!Number.isFinite(length) || length <= 0) return 0;
	const safeCurrent = Number.isFinite(current) ? current : 0;
	return ((safeCurrent % length) + length + 1) % length;
}

export function prevColorIndex(current: number, length: number): number {
	if (!Number.isFinite(length) || length <= 0) return 0;
	const safeCurrent = Number.isFinite(current) ? current : 0;
	return ((safeCurrent % length) + length - 1) % length;
}

export interface FlashSchedule {
	intervalMs: number;
	totalFlashes: number;
}

/** Pixel-refresh math: how many color flashes a given duration/rate produces. */
export function computeFlashSchedule(durationSeconds: number, hz: number): FlashSchedule {
	const safeDuration = Number.isFinite(durationSeconds) && durationSeconds > 0 ? durationSeconds : 0;
	const safeHz = Number.isFinite(hz) && hz > 0 ? hz : 0;
	if (safeDuration === 0 || safeHz === 0) {
		return { intervalMs: 0, totalFlashes: 0 };
	}
	return {
		intervalMs: 1000 / safeHz,
		totalFlashes: Math.round(safeDuration * safeHz),
	};
}

export interface IsoFaultClass {
	class: string;
	type1HotPixel: number;
	type2DeadPixel: number;
	type3StuckSubpixel: number;
	clusterType1Or2: number;
	clusterType3: number;
}

/** Historical ISO 13406-2 fault-class table (see module doc for sourcing/caveats), max faults per 1 million pixels. */
export const ISO_13406_2_CLASSES: IsoFaultClass[] = [
	{ class: 'I', type1HotPixel: 0, type2DeadPixel: 0, type3StuckSubpixel: 0, clusterType1Or2: 0, clusterType3: 0 },
	{ class: 'II', type1HotPixel: 2, type2DeadPixel: 2, type3StuckSubpixel: 5, clusterType1Or2: 0, clusterType3: 2 },
	{ class: 'III', type1HotPixel: 5, type2DeadPixel: 15, type3StuckSubpixel: 50, clusterType1Or2: 0, clusterType3: 5 },
	{ class: 'IV', type1HotPixel: 50, type2DeadPixel: 150, type3StuckSubpixel: 500, clusterType1Or2: 5, clusterType3: 50 },
];

export function panelPixelCount(widthPx: number, heightPx: number): number {
	const w = Number.isFinite(widthPx) && widthPx > 0 ? widthPx : 0;
	const h = Number.isFinite(heightPx) && heightPx > 0 ? heightPx : 0;
	return w * h;
}

/** Scales a "per million pixels" allowance to an actual panel's real pixel count. */
export function scaleAllowance(perMillion: number, totalPixels: number): number {
	if (!Number.isFinite(perMillion) || perMillion < 0) return 0;
	if (!Number.isFinite(totalPixels) || totalPixels <= 0) return 0;
	return Math.floor((perMillion * totalPixels) / 1_000_000);
}

export interface ResolutionPreset {
	label: string;
	width: number;
	height: number;
}

export const RESOLUTION_PRESETS: ResolutionPreset[] = [
	{ label: '1366x768 (HD)', width: 1366, height: 768 },
	{ label: '1920x1080 (Full HD)', width: 1920, height: 1080 },
	{ label: '2560x1440 (1440p)', width: 2560, height: 1440 },
	{ label: '3840x2160 (4K UHD)', width: 3840, height: 2160 },
];
