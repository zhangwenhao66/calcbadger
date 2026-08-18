/**
 * Gender, sex, and sexuality symbols from the Unicode Miscellaneous Symbols
 * block, with meaning, common use, and a short verified history note.
 * Restricted to symbols with independently corroborated origin stories.
 * See sources cited in tools.ts for this page.
 */

export interface GenderSymbol {
	name: string;
	symbol: string;
	codePoint: string;
	meaning: string;
	commonUse: string;
	history: string;
}

export const GENDER_SYMBOLS: readonly GenderSymbol[] = [
	{
		name: 'Female',
		symbol: '♀',
		codePoint: 'U+2640',
		meaning: 'Woman, girl, or biologically female',
		commonUse: 'Restroom and locker room signage, biology and medical charts, and astrology (where it marks the planet Venus)',
		history:
			"Ancient astrologers used this glyph for the planet Venus and alchemists reused it for copper, a metal linked to the goddess through her Roman epithet Cyprian, after the copper mines of Cyprus. Carl Linnaeus adopted it for female plants in his 1751 dissertation Plantae hybridae and again in his 1753 Species Plantarum, and zoologists later borrowed the same convention.",
	},
	{
		name: 'Male',
		symbol: '♂',
		codePoint: 'U+2642',
		meaning: 'Man, boy, or biologically male',
		commonUse: 'Restroom and locker room signage, biology and medical charts, and astrology (where it marks the planet Mars)',
		history:
			"Ancient astrologers used this glyph for the planet Mars and alchemists reused it for iron, the metal of the war god's spear and shield. Carl Linnaeus adopted it for male plants alongside the female sign, first in his 1751 Plantae hybridae and then in his 1753 Species Plantarum.",
	},
	{
		name: 'Interlocked Female and Male',
		symbol: '⚤',
		codePoint: 'U+26A4',
		meaning: 'Heterosexuality, or a male-female pair',
		commonUse: 'Marking opposite-sex couples or relationships on charts, forms, and social profiles',
		history:
			'Built by overlapping the female and male signs into one glyph, this character joined Unicode in version 4.1 (2005), decades after gay and lesbian activists had already popularized the doubled versions below as community symbols.',
	},
	{
		name: 'Male and Female',
		symbol: '⚥',
		codePoint: 'U+26A5',
		meaning: 'Intersex, androgynous, or (in botany) hermaphroditic',
		commonUse: 'Biology diagrams for organisms with both male and female reproductive parts, and general references to a blend of both genders',
		history:
			'This glyph also entered Unicode in version 4.1 (2005). It is often confused with the older astrological symbol for Mercury (☿), which Linnaeus actually used for hermaphroditic flowers in his later botanical works; the two look similar but are separate Unicode characters with separate histories.',
	},
	{
		name: 'Doubled Female',
		symbol: '⚢',
		codePoint: 'U+26A2',
		meaning: 'Lesbian, or a female-female pair',
		commonUse: 'Community and identity symbol for lesbians, used on badges, flags, and profiles',
		history:
			'Gay Liberation Front activists in the UK put two interlocked female signs on the cover of their newspaper Come Together starting in late 1970, pairing it with the doubled male sign below to represent lesbians and gay men side by side.',
	},
	{
		name: 'Doubled Male',
		symbol: '⚣',
		codePoint: 'U+26A3',
		meaning: 'Gay men, or a male-male pair',
		commonUse: 'Community and identity symbol for gay men, used on badges, flags, and profiles',
		history:
			"The same Come Together covers that popularized the doubled female sign in late 1970 used this doubled male sign for gay men, adapting the doubled-ring idea from the Mars symbol's long run as shorthand for masculinity.",
	},
	{
		name: 'Transgender',
		symbol: '⚧',
		codePoint: 'U+26A7',
		meaning: 'Transgender or gender-nonconforming identity',
		commonUse: 'Community and identity symbol for transgender people, used on flags, badges, and profiles',
		history:
			'Transgender activist Holly Boswell drew this design in 1993, adding a third, crossed branch to the combined female and male signs to stand for identities outside the binary; Wendy Parker and Nancy R. Nangeroni helped refine and circulate it before it reached Unicode in version 4.1 (2005).',
	},
];

/** Filters the symbol list by name, glyph, meaning, or common-use text (case-insensitive). */
export function filterGenderSymbols(symbols: readonly GenderSymbol[], query: string): GenderSymbol[] {
	const q = query.trim().toLowerCase();
	if (!q) return [...symbols];
	return symbols.filter(
		(s) =>
			s.name.toLowerCase().includes(q) ||
			s.symbol === query.trim() ||
			s.meaning.toLowerCase().includes(q) ||
			s.commonUse.toLowerCase().includes(q),
	);
}
