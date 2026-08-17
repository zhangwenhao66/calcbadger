/**
 * Random animal generator: a curated 131-animal list, each tagged with its
 * taxonomic class and primary native region (both standard textbook/general-
 * reference classifications, not disputed edge cases -- see tools.ts sources
 * for the general references used).
 *
 * Picking uses the same cumulative-weight method as this site's other random
 * tools (see randomLetter.ts / yesNoWheel.ts), but every animal in the active
 * pool carries an equal weight -- there is no frequency-style bias here, just
 * a uniform draw. "Unique only" draws without replacement (Fisher-Yates-style
 * partial shuffle: pick a random remaining index, remove it, repeat), so the
 * same animal can't appear twice in one batch; "Allow repeats" draws each
 * pick independently, the same way rolling a die twice gives two unrelated
 * results.
 */

export type AnimalClass = 'Mammal' | 'Bird' | 'Reptile' | 'Amphibian' | 'Fish' | 'Invertebrate';
export type ClassFilter = 'all' | AnimalClass;

export interface Animal {
	name: string;
	animalClass: AnimalClass;
	region: string;
}

export const ANIMALS: Animal[] = [
	// Mammals (52)
	{ name: 'Lion', animalClass: 'Mammal', region: 'Africa' },
	{ name: 'African Elephant', animalClass: 'Mammal', region: 'Africa' },
	{ name: 'Giraffe', animalClass: 'Mammal', region: 'Africa' },
	{ name: 'Plains Zebra', animalClass: 'Mammal', region: 'Africa' },
	{ name: 'Hippopotamus', animalClass: 'Mammal', region: 'Africa' },
	{ name: 'White Rhinoceros', animalClass: 'Mammal', region: 'Africa' },
	{ name: 'Cheetah', animalClass: 'Mammal', region: 'Africa' },
	{ name: 'Western Lowland Gorilla', animalClass: 'Mammal', region: 'Africa' },
	{ name: 'Chimpanzee', animalClass: 'Mammal', region: 'Africa' },
	{ name: 'Meerkat', animalClass: 'Mammal', region: 'Africa' },
	{ name: 'Spotted Hyena', animalClass: 'Mammal', region: 'Africa' },
	{ name: 'Okapi', animalClass: 'Mammal', region: 'Africa' },
	{ name: 'Aardvark', animalClass: 'Mammal', region: 'Africa' },
	{ name: 'Fennec Fox', animalClass: 'Mammal', region: 'Africa' },
	{ name: 'Bengal Tiger', animalClass: 'Mammal', region: 'Asia' },
	{ name: 'Giant Panda', animalClass: 'Mammal', region: 'Asia' },
	{ name: 'Snow Leopard', animalClass: 'Mammal', region: 'Asia' },
	{ name: 'Sumatran Orangutan', animalClass: 'Mammal', region: 'Asia' },
	{ name: 'Asian Elephant', animalClass: 'Mammal', region: 'Asia' },
	{ name: 'Red Panda', animalClass: 'Mammal', region: 'Asia' },
	{ name: 'Bactrian Camel', animalClass: 'Mammal', region: 'Asia' },
	{ name: 'Red Kangaroo', animalClass: 'Mammal', region: 'Australia & Oceania' },
	{ name: 'Koala', animalClass: 'Mammal', region: 'Australia & Oceania' },
	{ name: 'Common Wombat', animalClass: 'Mammal', region: 'Australia & Oceania' },
	{ name: 'Tasmanian Devil', animalClass: 'Mammal', region: 'Australia & Oceania' },
	{ name: 'Platypus', animalClass: 'Mammal', region: 'Australia & Oceania' },
	{ name: 'Sugar Glider', animalClass: 'Mammal', region: 'Australia & Oceania' },
	{ name: 'Quokka', animalClass: 'Mammal', region: 'Australia & Oceania' },
	{ name: 'Grizzly Bear', animalClass: 'Mammal', region: 'North America' },
	{ name: 'American Bison', animalClass: 'Mammal', region: 'North America' },
	{ name: 'Moose', animalClass: 'Mammal', region: 'North America' },
	{ name: 'Raccoon', animalClass: 'Mammal', region: 'North America' },
	{ name: 'Coyote', animalClass: 'Mammal', region: 'North America' },
	{ name: 'Bobcat', animalClass: 'Mammal', region: 'North America' },
	{ name: 'American Beaver', animalClass: 'Mammal', region: 'North America' },
	{ name: 'Striped Skunk', animalClass: 'Mammal', region: 'North America' },
	{ name: 'Sea Otter', animalClass: 'Mammal', region: 'North America (Pacific coast)' },
	{ name: 'Polar Bear', animalClass: 'Mammal', region: 'Arctic' },
	{ name: 'Arctic Fox', animalClass: 'Mammal', region: 'Arctic' },
	{ name: 'Jaguar', animalClass: 'Mammal', region: 'South America' },
	{ name: 'Llama', animalClass: 'Mammal', region: 'South America' },
	{ name: 'Brown-throated Sloth', animalClass: 'Mammal', region: 'South America' },
	{ name: 'Capybara', animalClass: 'Mammal', region: 'South America' },
	{ name: 'Giant Anteater', animalClass: 'Mammal', region: 'South America' },
	{ name: 'Nine-banded Armadillo', animalClass: 'Mammal', region: 'South America' },
	{ name: 'Vampire Bat', animalClass: 'Mammal', region: 'South America' },
	{ name: 'Red Fox', animalClass: 'Mammal', region: 'Europe' },
	{ name: 'Eurasian Brown Bear', animalClass: 'Mammal', region: 'Europe' },
	{ name: 'European Hedgehog', animalClass: 'Mammal', region: 'Europe' },
	{ name: 'Bottlenose Dolphin', animalClass: 'Mammal', region: 'Oceans worldwide' },
	{ name: 'Blue Whale', animalClass: 'Mammal', region: 'Oceans worldwide' },
	{ name: 'Orca', animalClass: 'Mammal', region: 'Oceans worldwide' },
	// Birds (26)
	{ name: 'Bald Eagle', animalClass: 'Bird', region: 'North America' },
	{ name: 'Ruby-throated Hummingbird', animalClass: 'Bird', region: 'North America' },
	{ name: 'Downy Woodpecker', animalClass: 'Bird', region: 'North America' },
	{ name: 'Brown Pelican', animalClass: 'Bird', region: 'North America' },
	{ name: 'Turkey Vulture', animalClass: 'Bird', region: 'North America' },
	{ name: 'American Crow', animalClass: 'Bird', region: 'North America' },
	{ name: 'Great Horned Owl', animalClass: 'Bird', region: 'North America' },
	{ name: 'Indian Peafowl', animalClass: 'Bird', region: 'Asia' },
	{ name: 'Common Kingfisher', animalClass: 'Bird', region: 'Asia' },
	{ name: 'Snowy Owl', animalClass: 'Bird', region: 'Arctic' },
	{ name: 'Emperor Penguin', animalClass: 'Bird', region: 'Antarctica' },
	{ name: 'Atlantic Puffin', animalClass: 'Bird', region: 'Europe' },
	{ name: 'Mute Swan', animalClass: 'Bird', region: 'Europe' },
	{ name: 'White Stork', animalClass: 'Bird', region: 'Europe' },
	{ name: 'European Robin', animalClass: 'Bird', region: 'Europe' },
	{ name: 'Ostrich', animalClass: 'Bird', region: 'Africa' },
	{ name: 'Greater Flamingo', animalClass: 'Bird', region: 'Africa' },
	{ name: 'African Grey Parrot', animalClass: 'Bird', region: 'Africa' },
	{ name: 'Scarlet Macaw', animalClass: 'Bird', region: 'South America' },
	{ name: 'Keel-billed Toucan', animalClass: 'Bird', region: 'Central America' },
	{ name: 'Andean Condor', animalClass: 'Bird', region: 'South America' },
	{ name: 'Wandering Albatross', animalClass: 'Bird', region: 'Southern Ocean' },
	{ name: 'Kiwi', animalClass: 'Bird', region: 'Australia & Oceania' },
	{ name: 'Southern Cassowary', animalClass: 'Bird', region: 'Australia & Oceania' },
	{ name: 'Laughing Kookaburra', animalClass: 'Bird', region: 'Australia & Oceania' },
	{ name: 'Peregrine Falcon', animalClass: 'Bird', region: 'Worldwide' },
	// Reptiles (16)
	{ name: 'Komodo Dragon', animalClass: 'Reptile', region: 'Asia' },
	{ name: 'King Cobra', animalClass: 'Reptile', region: 'Asia' },
	{ name: 'Reticulated Python', animalClass: 'Reptile', region: 'Asia' },
	{ name: 'Green Anaconda', animalClass: 'Reptile', region: 'South America' },
	{ name: 'American Alligator', animalClass: 'Reptile', region: 'North America' },
	{ name: 'Nile Crocodile', animalClass: 'Reptile', region: 'Africa' },
	{ name: 'Saltwater Crocodile', animalClass: 'Reptile', region: 'Australia & Southeast Asia' },
	{ name: 'Panther Chameleon', animalClass: 'Reptile', region: 'Africa (Madagascar)' },
	{ name: 'Green Iguana', animalClass: 'Reptile', region: 'South America' },
	{ name: 'Gila Monster', animalClass: 'Reptile', region: 'North America' },
	{ name: 'Eastern Diamondback Rattlesnake', animalClass: 'Reptile', region: 'North America' },
	{ name: 'Galápagos Tortoise', animalClass: 'Reptile', region: 'South America (Galápagos)' },
	{ name: 'Green Sea Turtle', animalClass: 'Reptile', region: 'Oceans worldwide' },
	{ name: 'Bearded Dragon', animalClass: 'Reptile', region: 'Australia & Oceania' },
	{ name: 'Leopard Gecko', animalClass: 'Reptile', region: 'Asia' },
	{ name: 'Nile Monitor', animalClass: 'Reptile', region: 'Africa' },
	// Amphibians (10)
	{ name: 'Golden Poison Frog', animalClass: 'Amphibian', region: 'South America' },
	{ name: 'Axolotl', animalClass: 'Amphibian', region: 'North America (Mexico)' },
	{ name: 'American Bullfrog', animalClass: 'Amphibian', region: 'North America' },
	{ name: 'Fire Salamander', animalClass: 'Amphibian', region: 'Europe' },
	{ name: 'Common Toad', animalClass: 'Amphibian', region: 'Europe' },
	{ name: 'Red-eyed Tree Frog', animalClass: 'Amphibian', region: 'Central America' },
	{ name: 'Cane Toad', animalClass: 'Amphibian', region: 'South America' },
	{ name: 'Smooth Newt', animalClass: 'Amphibian', region: 'Europe' },
	{ name: 'Hellbender', animalClass: 'Amphibian', region: 'North America' },
	{ name: 'Goliath Frog', animalClass: 'Amphibian', region: 'Africa' },
	// Fish (12)
	{ name: 'Great White Shark', animalClass: 'Fish', region: 'Oceans worldwide' },
	{ name: 'Clownfish', animalClass: 'Fish', region: 'Indo-Pacific oceans' },
	{ name: 'Manta Ray', animalClass: 'Fish', region: 'Tropical oceans' },
	{ name: 'Seahorse', animalClass: 'Fish', region: 'Coastal oceans worldwide' },
	{ name: 'Red-bellied Piranha', animalClass: 'Fish', region: 'South America' },
	{ name: 'Atlantic Salmon', animalClass: 'Fish', region: 'North Atlantic' },
	{ name: 'Freshwater Angelfish', animalClass: 'Fish', region: 'South America' },
	{ name: 'Channel Catfish', animalClass: 'Fish', region: 'North America' },
	{ name: 'Swordfish', animalClass: 'Fish', region: 'Oceans worldwide' },
	{ name: 'Anglerfish', animalClass: 'Fish', region: 'Deep oceans worldwide' },
	{ name: 'Pufferfish', animalClass: 'Fish', region: 'Tropical & subtropical oceans' },
	{ name: 'Koi', animalClass: 'Fish', region: 'Asia' },
	// Invertebrates (15)
	{ name: 'Western Honey Bee', animalClass: 'Invertebrate', region: 'Europe, Africa & Asia' },
	{ name: 'Monarch Butterfly', animalClass: 'Invertebrate', region: 'North America' },
	{ name: 'Seven-spot Ladybird', animalClass: 'Invertebrate', region: 'Europe' },
	{ name: 'Giant Pacific Octopus', animalClass: 'Invertebrate', region: 'North Pacific Ocean' },
	{ name: 'Moon Jellyfish', animalClass: 'Invertebrate', region: 'Coastal oceans worldwide' },
	{ name: 'Garden Snail', animalClass: 'Invertebrate', region: 'Europe' },
	{ name: 'Mexican Redknee Tarantula', animalClass: 'Invertebrate', region: 'North America (Mexico)' },
	{ name: 'Emperor Scorpion', animalClass: 'Invertebrate', region: 'Africa' },
	{ name: 'European Mantis', animalClass: 'Invertebrate', region: 'Europe, Africa & Asia' },
	{ name: 'Common Green Darner', animalClass: 'Invertebrate', region: 'North America' },
	{ name: 'Red Wood Ant', animalClass: 'Invertebrate', region: 'Europe' },
	{ name: 'Caribbean Hermit Crab', animalClass: 'Invertebrate', region: 'Caribbean & tropical coasts' },
	{ name: 'American Lobster', animalClass: 'Invertebrate', region: 'North America (NW Atlantic)' },
	{ name: 'Common Starfish', animalClass: 'Invertebrate', region: 'Europe (NE Atlantic)' },
	{ name: 'Giant Weta', animalClass: 'Invertebrate', region: 'Australia & Oceania (New Zealand)' },
];

export const CLASS_ORDER: AnimalClass[] = ['Mammal', 'Bird', 'Reptile', 'Amphibian', 'Fish', 'Invertebrate'];

/** Animals matching a class filter ('all' returns the full list), in fixed list order. */
export function animalsForFilter(filter: ClassFilter): Animal[] {
	if (filter === 'all') return ANIMALS;
	return ANIMALS.filter((a) => a.animalClass === filter);
}

export interface ClassCount {
	animalClass: AnimalClass;
	count: number;
}

/** How many animals of each class are in the full list, in CLASS_ORDER. */
export function classCounts(): ClassCount[] {
	return CLASS_ORDER.map((animalClass) => ({
		animalClass,
		count: ANIMALS.filter((a) => a.animalClass === animalClass).length,
	}));
}

/**
 * Draw `count` animals from `pool`.
 * unique=true: sample without replacement (random-remaining-index removal,
 * equivalent to a partial Fisher-Yates shuffle) -- capped at pool.length.
 * unique=false: each pick is independent (with replacement) -- the same
 * animal can appear more than once.
 * Injectable RNG for testability.
 */
export function drawAnimals(
	count: number,
	pool: Animal[],
	unique: boolean,
	rng: () => number = Math.random,
): Animal[] {
	const n = Math.max(0, Math.floor(count));
	if (pool.length === 0) return [];

	if (unique) {
		const remaining = [...pool];
		const capped = Math.min(n, remaining.length);
		const result: Animal[] = [];
		for (let i = 0; i < capped; i++) {
			const idx = Math.floor(rng() * remaining.length);
			result.push(remaining[idx]!);
			remaining.splice(idx, 1);
		}
		return result;
	}

	const result: Animal[] = new Array(n);
	for (let i = 0; i < n; i++) {
		result[i] = pool[Math.floor(rng() * pool.length)]!;
	}
	return result;
}
