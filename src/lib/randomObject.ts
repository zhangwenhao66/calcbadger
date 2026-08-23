/**
 * Random object generator: a curated 145-object list for drawing games,
 * charades/Pictionary-style prompts, and writing exercises, grouped into 8
 * everyday categories and tagged with a curatorial drawing-difficulty rating
 * (Easy/Medium/Hard -- how many distinct parts or how much perspective the
 * shape needs, not a measured or externally sourced fact; see tools.ts
 * sources for how party-game category conventions were checked).
 *
 * Picking uses the same method as this site's random-animal-generator (see
 * randomAnimal.ts): "Unique only" draws without replacement (a partial
 * Fisher-Yates shuffle -- pick a random remaining index, remove it, repeat),
 * "Allow repeats" draws each pick independently, so the same object can come
 * up more than once.
 */

export type ObjectCategory =
	| 'Household & Kitchen'
	| 'Food & Drink'
	| 'Nature & Outdoors'
	| 'Tools & Hardware'
	| 'Clothing & Accessories'
	| 'Vehicles & Transport'
	| 'Sports & Recreation'
	| 'School & Office';

export type CategoryFilter = 'all' | ObjectCategory;
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface DrawableObject {
	name: string;
	category: ObjectCategory;
	difficulty: Difficulty;
}

export const CATEGORY_ORDER: ObjectCategory[] = [
	'Household & Kitchen',
	'Food & Drink',
	'Nature & Outdoors',
	'Tools & Hardware',
	'Clothing & Accessories',
	'Vehicles & Transport',
	'Sports & Recreation',
	'School & Office',
];

export const DIFFICULTY_ORDER: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export const OBJECTS: DrawableObject[] = [
	// Household & Kitchen (20)
	{ name: 'Chair', category: 'Household & Kitchen', difficulty: 'Medium' },
	{ name: 'Table', category: 'Household & Kitchen', difficulty: 'Easy' },
	{ name: 'Sofa', category: 'Household & Kitchen', difficulty: 'Medium' },
	{ name: 'Lamp', category: 'Household & Kitchen', difficulty: 'Easy' },
	{ name: 'Pillow', category: 'Household & Kitchen', difficulty: 'Easy' },
	{ name: 'Blanket', category: 'Household & Kitchen', difficulty: 'Easy' },
	{ name: 'Clock', category: 'Household & Kitchen', difficulty: 'Easy' },
	{ name: 'Mirror', category: 'Household & Kitchen', difficulty: 'Easy' },
	{ name: 'Umbrella', category: 'Household & Kitchen', difficulty: 'Medium' },
	{ name: 'Broom', category: 'Household & Kitchen', difficulty: 'Easy' },
	{ name: 'Bucket', category: 'Household & Kitchen', difficulty: 'Easy' },
	{ name: 'Candle', category: 'Household & Kitchen', difficulty: 'Easy' },
	{ name: 'Vase', category: 'Household & Kitchen', difficulty: 'Easy' },
	{ name: 'Spoon', category: 'Household & Kitchen', difficulty: 'Easy' },
	{ name: 'Fork', category: 'Household & Kitchen', difficulty: 'Easy' },
	{ name: 'Frying Pan', category: 'Household & Kitchen', difficulty: 'Easy' },
	{ name: 'Kettle', category: 'Household & Kitchen', difficulty: 'Medium' },
	{ name: 'Toaster', category: 'Household & Kitchen', difficulty: 'Medium' },
	{ name: 'Ladder', category: 'Household & Kitchen', difficulty: 'Medium' },
	{ name: 'Key', category: 'Household & Kitchen', difficulty: 'Easy' },
	// Food & Drink (20)
	{ name: 'Apple', category: 'Food & Drink', difficulty: 'Easy' },
	{ name: 'Banana', category: 'Food & Drink', difficulty: 'Easy' },
	{ name: 'Watermelon', category: 'Food & Drink', difficulty: 'Easy' },
	{ name: 'Pineapple', category: 'Food & Drink', difficulty: 'Medium' },
	{ name: 'Strawberry', category: 'Food & Drink', difficulty: 'Easy' },
	{ name: 'Carrot', category: 'Food & Drink', difficulty: 'Easy' },
	{ name: 'Broccoli', category: 'Food & Drink', difficulty: 'Medium' },
	{ name: 'Mushroom', category: 'Food & Drink', difficulty: 'Easy' },
	{ name: 'Bread Loaf', category: 'Food & Drink', difficulty: 'Easy' },
	{ name: 'Pizza Slice', category: 'Food & Drink', difficulty: 'Medium' },
	{ name: 'Hamburger', category: 'Food & Drink', difficulty: 'Medium' },
	{ name: 'Hot Dog', category: 'Food & Drink', difficulty: 'Easy' },
	{ name: 'Ice Cream Cone', category: 'Food & Drink', difficulty: 'Easy' },
	{ name: 'Birthday Cake', category: 'Food & Drink', difficulty: 'Medium' },
	{ name: 'Donut', category: 'Food & Drink', difficulty: 'Easy' },
	{ name: 'Coffee Cup', category: 'Food & Drink', difficulty: 'Easy' },
	{ name: 'Teapot', category: 'Food & Drink', difficulty: 'Medium' },
	{ name: 'Wine Glass', category: 'Food & Drink', difficulty: 'Easy' },
	{ name: 'Popcorn', category: 'Food & Drink', difficulty: 'Medium' },
	{ name: 'Pretzel', category: 'Food & Drink', difficulty: 'Medium' },
	// Nature & Outdoors (19)
	{ name: 'Tree', category: 'Nature & Outdoors', difficulty: 'Medium' },
	{ name: 'Flower', category: 'Nature & Outdoors', difficulty: 'Easy' },
	{ name: 'Sunflower', category: 'Nature & Outdoors', difficulty: 'Medium' },
	{ name: 'Cactus', category: 'Nature & Outdoors', difficulty: 'Easy' },
	{ name: 'Mountain', category: 'Nature & Outdoors', difficulty: 'Easy' },
	{ name: 'Volcano', category: 'Nature & Outdoors', difficulty: 'Medium' },
	{ name: 'Waterfall', category: 'Nature & Outdoors', difficulty: 'Medium' },
	{ name: 'Rainbow', category: 'Nature & Outdoors', difficulty: 'Easy' },
	{ name: 'Cloud', category: 'Nature & Outdoors', difficulty: 'Easy' },
	{ name: 'Sun', category: 'Nature & Outdoors', difficulty: 'Easy' },
	{ name: 'Moon', category: 'Nature & Outdoors', difficulty: 'Easy' },
	{ name: 'Star', category: 'Nature & Outdoors', difficulty: 'Easy' },
	{ name: 'Snowflake', category: 'Nature & Outdoors', difficulty: 'Medium' },
	{ name: 'Campfire', category: 'Nature & Outdoors', difficulty: 'Medium' },
	{ name: 'Tent', category: 'Nature & Outdoors', difficulty: 'Medium' },
	{ name: 'Beehive', category: 'Nature & Outdoors', difficulty: 'Medium' },
	{ name: 'Spider Web', category: 'Nature & Outdoors', difficulty: 'Medium' },
	{ name: 'Seashell', category: 'Nature & Outdoors', difficulty: 'Easy' },
	{ name: 'Anchor', category: 'Nature & Outdoors', difficulty: 'Medium' },
	// Tools & Hardware (18)
	{ name: 'Hammer', category: 'Tools & Hardware', difficulty: 'Easy' },
	{ name: 'Screwdriver', category: 'Tools & Hardware', difficulty: 'Easy' },
	{ name: 'Wrench', category: 'Tools & Hardware', difficulty: 'Medium' },
	{ name: 'Saw', category: 'Tools & Hardware', difficulty: 'Medium' },
	{ name: 'Drill', category: 'Tools & Hardware', difficulty: 'Medium' },
	{ name: 'Paintbrush', category: 'Tools & Hardware', difficulty: 'Easy' },
	{ name: 'Paint Roller', category: 'Tools & Hardware', difficulty: 'Medium' },
	{ name: 'Toolbox', category: 'Tools & Hardware', difficulty: 'Medium' },
	{ name: 'Nail', category: 'Tools & Hardware', difficulty: 'Easy' },
	{ name: 'Screw', category: 'Tools & Hardware', difficulty: 'Easy' },
	{ name: 'Rope', category: 'Tools & Hardware', difficulty: 'Easy' },
	{ name: 'Chain', category: 'Tools & Hardware', difficulty: 'Medium' },
	{ name: 'Padlock', category: 'Tools & Hardware', difficulty: 'Medium' },
	{ name: 'Flashlight', category: 'Tools & Hardware', difficulty: 'Easy' },
	{ name: 'Fire Extinguisher', category: 'Tools & Hardware', difficulty: 'Hard' },
	{ name: 'Wheelbarrow', category: 'Tools & Hardware', difficulty: 'Hard' },
	{ name: 'Shovel', category: 'Tools & Hardware', difficulty: 'Easy' },
	{ name: 'Rake', category: 'Tools & Hardware', difficulty: 'Medium' },
	// Clothing & Accessories (17)
	{ name: 'Hat', category: 'Clothing & Accessories', difficulty: 'Easy' },
	{ name: 'Baseball Cap', category: 'Clothing & Accessories', difficulty: 'Medium' },
	{ name: 'Scarf', category: 'Clothing & Accessories', difficulty: 'Easy' },
	{ name: 'Glove', category: 'Clothing & Accessories', difficulty: 'Medium' },
	{ name: 'Sock', category: 'Clothing & Accessories', difficulty: 'Easy' },
	{ name: 'Sneaker', category: 'Clothing & Accessories', difficulty: 'Medium' },
	{ name: 'Boot', category: 'Clothing & Accessories', difficulty: 'Medium' },
	{ name: 'Sunglasses', category: 'Clothing & Accessories', difficulty: 'Easy' },
	{ name: 'Necktie', category: 'Clothing & Accessories', difficulty: 'Easy' },
	{ name: 'Bow Tie', category: 'Clothing & Accessories', difficulty: 'Easy' },
	{ name: 'Wristwatch', category: 'Clothing & Accessories', difficulty: 'Medium' },
	{ name: 'Necklace', category: 'Clothing & Accessories', difficulty: 'Medium' },
	{ name: 'Crown', category: 'Clothing & Accessories', difficulty: 'Medium' },
	{ name: 'Wallet', category: 'Clothing & Accessories', difficulty: 'Easy' },
	{ name: 'Handbag', category: 'Clothing & Accessories', difficulty: 'Medium' },
	{ name: 'Belt', category: 'Clothing & Accessories', difficulty: 'Easy' },
	{ name: 'Mitten', category: 'Clothing & Accessories', difficulty: 'Easy' },
	// Vehicles & Transport (15)
	{ name: 'Bicycle', category: 'Vehicles & Transport', difficulty: 'Medium' },
	{ name: 'Car', category: 'Vehicles & Transport', difficulty: 'Hard' },
	{ name: 'Bus', category: 'Vehicles & Transport', difficulty: 'Hard' },
	{ name: 'Train', category: 'Vehicles & Transport', difficulty: 'Hard' },
	{ name: 'Airplane', category: 'Vehicles & Transport', difficulty: 'Hard' },
	{ name: 'Helicopter', category: 'Vehicles & Transport', difficulty: 'Hard' },
	{ name: 'Sailboat', category: 'Vehicles & Transport', difficulty: 'Medium' },
	{ name: 'Submarine', category: 'Vehicles & Transport', difficulty: 'Hard' },
	{ name: 'Hot Air Balloon', category: 'Vehicles & Transport', difficulty: 'Medium' },
	{ name: 'Rocket', category: 'Vehicles & Transport', difficulty: 'Medium' },
	{ name: 'Skateboard', category: 'Vehicles & Transport', difficulty: 'Easy' },
	{ name: 'Scooter', category: 'Vehicles & Transport', difficulty: 'Medium' },
	{ name: 'Tractor', category: 'Vehicles & Transport', difficulty: 'Hard' },
	{ name: 'Wheelchair', category: 'Vehicles & Transport', difficulty: 'Hard' },
	{ name: 'Canoe', category: 'Vehicles & Transport', difficulty: 'Medium' },
	// Sports & Recreation (18)
	{ name: 'Soccer Ball', category: 'Sports & Recreation', difficulty: 'Easy' },
	{ name: 'Basketball', category: 'Sports & Recreation', difficulty: 'Easy' },
	{ name: 'Baseball Bat', category: 'Sports & Recreation', difficulty: 'Easy' },
	{ name: 'Tennis Racket', category: 'Sports & Recreation', difficulty: 'Medium' },
	{ name: 'Golf Club', category: 'Sports & Recreation', difficulty: 'Medium' },
	{ name: 'Bowling Pin', category: 'Sports & Recreation', difficulty: 'Easy' },
	{ name: 'Boxing Glove', category: 'Sports & Recreation', difficulty: 'Medium' },
	{ name: 'Surfboard', category: 'Sports & Recreation', difficulty: 'Easy' },
	{ name: 'Kite', category: 'Sports & Recreation', difficulty: 'Easy' },
	{ name: 'Yo-Yo', category: 'Sports & Recreation', difficulty: 'Easy' },
	{ name: 'Jump Rope', category: 'Sports & Recreation', difficulty: 'Easy' },
	{ name: 'Fishing Rod', category: 'Sports & Recreation', difficulty: 'Medium' },
	{ name: 'Trophy', category: 'Sports & Recreation', difficulty: 'Medium' },
	{ name: 'Medal', category: 'Sports & Recreation', difficulty: 'Easy' },
	{ name: 'Whistle', category: 'Sports & Recreation', difficulty: 'Easy' },
	{ name: 'Dumbbell', category: 'Sports & Recreation', difficulty: 'Easy' },
	{ name: 'Parachute', category: 'Sports & Recreation', difficulty: 'Medium' },
	{ name: 'Snowboard', category: 'Sports & Recreation', difficulty: 'Easy' },
	// School & Office (18)
	{ name: 'Pencil', category: 'School & Office', difficulty: 'Easy' },
	{ name: 'Pen', category: 'School & Office', difficulty: 'Easy' },
	{ name: 'Eraser', category: 'School & Office', difficulty: 'Easy' },
	{ name: 'Ruler', category: 'School & Office', difficulty: 'Easy' },
	{ name: 'Scissors', category: 'School & Office', difficulty: 'Easy' },
	{ name: 'Stapler', category: 'School & Office', difficulty: 'Medium' },
	{ name: 'Backpack', category: 'School & Office', difficulty: 'Medium' },
	{ name: 'Notebook', category: 'School & Office', difficulty: 'Easy' },
	{ name: 'Calculator', category: 'School & Office', difficulty: 'Medium' },
	{ name: 'Paperclip', category: 'School & Office', difficulty: 'Easy' },
	{ name: 'Glue Stick', category: 'School & Office', difficulty: 'Easy' },
	{ name: 'Crayon', category: 'School & Office', difficulty: 'Easy' },
	{ name: 'Chalkboard', category: 'School & Office', difficulty: 'Medium' },
	{ name: 'Globe', category: 'School & Office', difficulty: 'Medium' },
	{ name: 'Magnifying Glass', category: 'School & Office', difficulty: 'Medium' },
	{ name: 'Envelope', category: 'School & Office', difficulty: 'Easy' },
	{ name: 'Stamp', category: 'School & Office', difficulty: 'Easy' },
	{ name: 'Calendar', category: 'School & Office', difficulty: 'Medium' },
];

/** Objects matching a category filter ('all' returns the full list), in fixed list order. */
export function objectsForFilter(filter: CategoryFilter): DrawableObject[] {
	if (filter === 'all') return OBJECTS;
	return OBJECTS.filter((o) => o.category === filter);
}

export interface CategoryCount {
	category: ObjectCategory;
	count: number;
}

/** How many objects are in each category, in CATEGORY_ORDER. */
export function categoryCounts(): CategoryCount[] {
	return CATEGORY_ORDER.map((category) => ({
		category,
		count: OBJECTS.filter((o) => o.category === category).length,
	}));
}

export interface DifficultyCount {
	difficulty: Difficulty;
	count: number;
}

/** How many objects carry each difficulty rating, in DIFFICULTY_ORDER. */
export function difficultyCounts(): DifficultyCount[] {
	return DIFFICULTY_ORDER.map((difficulty) => ({
		difficulty,
		count: OBJECTS.filter((o) => o.difficulty === difficulty).length,
	}));
}

/**
 * Draw `count` objects from `pool`.
 * unique=true: sample without replacement (random-remaining-index removal,
 * equivalent to a partial Fisher-Yates shuffle) -- capped at pool.length.
 * unique=false: each pick is independent (with replacement) -- the same
 * object can appear more than once.
 * Injectable RNG for testability.
 */
export function drawObjects(
	count: number,
	pool: DrawableObject[],
	unique: boolean,
	rng: () => number = Math.random,
): DrawableObject[] {
	const n = Math.max(0, Math.floor(count));
	if (pool.length === 0) return [];

	if (unique) {
		const remaining = [...pool];
		const capped = Math.min(n, remaining.length);
		const result: DrawableObject[] = [];
		for (let i = 0; i < capped; i++) {
			const idx = Math.floor(rng() * remaining.length);
			result.push(remaining[idx]!);
			remaining.splice(idx, 1);
		}
		return result;
	}

	const result: DrawableObject[] = new Array(n);
	for (let i = 0; i < n; i++) {
		result[i] = pool[Math.floor(rng() * pool.length)]!;
	}
	return result;
}
