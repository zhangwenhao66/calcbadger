/**
 * Pizza party math: how many pizzas to order for a group, and the reverse
 * question, how many people a given size feeds.
 *
 * Slices-per-pizza convention: there is no regulatory standard for how a
 * pizzeria cuts a pie, so this module uses the sizes most large chains
 * (Domino's, Papa John's) and independent-pizzeria guides converge on --
 * small 6, medium 8, large 8, extra-large 12 -- and discloses that choice
 * rather than presenting it as a physical law. Individual pizzerias vary,
 * especially at large (8-10) and extra-large (12-14).
 *
 * Slices-per-person convention: the "3/8 rule" (3 slices per adult, 8 slices
 * per pizza) published by Pizza Hut's own ordering guidance and repeated
 * across catering sources is the default "average" appetite. Light and
 * hearty presets (2 and 4 slices per adult) and the 2-slices-per-child figure
 * are the same sources' common adjustments, not independently derived.
 *
 * Heavy-sides reduction: catering guides that mention cutting the pizza
 * estimate when wings/pasta/salad are also served give figures ranging from
 * roughly 20% to 30%; 25% is the midpoint used here, a deliberate choice
 * among a cited range rather than one precisely measured figure.
 */

export type Appetite = 'light' | 'average' | 'hearty';
export type PizzaSize = 'small' | 'medium' | 'large' | 'xlarge';

export const SLICES_PER_SIZE: Record<PizzaSize, number> = {
	small: 6,
	medium: 8,
	large: 8,
	xlarge: 12,
};

export const SLICES_PER_ADULT: Record<Appetite, number> = {
	light: 2,
	average: 3,
	hearty: 4,
};

/** Catering-guide convention for children roughly ages 3-10. */
export const SLICES_PER_CHILD = 2;

/** Fraction to cut the pizza order by when heavy sides (wings, pasta, a big salad) are also served. Midpoint of a commonly cited 20-30% range, see module header. */
export const HEAVY_SIDES_REDUCTION = 0.25;

export interface PizzaOrderResult {
	slicesPerPizza: number;
	/** Slices needed before rounding up to a whole slice. */
	rawSlicesNeeded: number;
	slicesNeeded: number;
	pizzasNeeded: number;
	slicesProvided: number;
	leftoverSlices: number;
}

/** adults/children below 0 are clamped to 0; never returns a negative or NaN result. */
export function computePizzaOrder(
	adults: number,
	children: number,
	appetite: Appetite,
	size: PizzaSize,
	heavySides: boolean,
): PizzaOrderResult {
	const a = Math.max(0, adults);
	const c = Math.max(0, children);
	const slicesPerPizza = SLICES_PER_SIZE[size];

	let rawSlicesNeeded = a * SLICES_PER_ADULT[appetite] + c * SLICES_PER_CHILD;
	if (heavySides) rawSlicesNeeded *= 1 - HEAVY_SIDES_REDUCTION;

	const slicesNeeded = Math.ceil(rawSlicesNeeded);
	const pizzasNeeded = slicesNeeded > 0 ? Math.ceil(slicesNeeded / slicesPerPizza) : 0;
	const slicesProvided = pizzasNeeded * slicesPerPizza;
	const leftoverSlices = slicesProvided - slicesNeeded;

	return { slicesPerPizza, rawSlicesNeeded, slicesNeeded, pizzasNeeded, slicesProvided, leftoverSlices };
}

/** How many people one pizza of `size` feeds at a given appetite, rounded down (a partial person isn't fed). */
export function peopleFedBySize(size: PizzaSize, appetite: Appetite): number {
	return Math.floor(SLICES_PER_SIZE[size] / SLICES_PER_ADULT[appetite]);
}
