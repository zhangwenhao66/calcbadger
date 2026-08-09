/**
 * World clock and time zone conversion.
 *
 * Formula authority: time zone identifiers and their UTC offset/DST rules
 * come from the IANA Time Zone Database (tzdata), the same source every
 * major OS and browser ships. Rather than hardcoding UTC offsets — which
 * silently go stale the moment a zone's daylight-saving rule changes or a
 * date crosses a DST boundary — every calculation here reads the offset
 * live from the JavaScript engine's built-in `Intl` API (ECMA-402), which
 * is required by spec to implement IANA tzdata for any `timeZone` it
 * accepts. This is the same technique documented in the TC39 Intl
 * `formatToParts` proposal for extracting zone-aware date components.
 */

export interface CityZone {
	id: string;
	city: string;
	region: string;
	timeZone: string;
}

// Curated to cover the "time in <place>" queries this page targets: major
// world capitals/cities plus the largest US metros, spanning every UTC
// offset from -10 to +13. A few large countries (USA, Russia, Brazil,
// Australia) span multiple zones — the entry uses that country's most
// commonly searched-for zone (e.g. "time in Brazil" overwhelmingly means
// Brasília time), noted in the FAQ rather than modeled per-region.
export const CITIES: CityZone[] = [
	{ id: 'new-york', city: 'New York', region: 'USA', timeZone: 'America/New_York' },
	{ id: 'los-angeles', city: 'Los Angeles', region: 'USA', timeZone: 'America/Los_Angeles' },
	{ id: 'chicago', city: 'Chicago', region: 'USA', timeZone: 'America/Chicago' },
	{ id: 'houston', city: 'Houston', region: 'USA', timeZone: 'America/Chicago' },
	{ id: 'dallas', city: 'Dallas', region: 'USA', timeZone: 'America/Chicago' },
	{ id: 'phoenix', city: 'Phoenix', region: 'USA', timeZone: 'America/Phoenix' },
	{ id: 'denver', city: 'Denver', region: 'USA', timeZone: 'America/Denver' },
	{ id: 'seattle', city: 'Seattle', region: 'USA', timeZone: 'America/Los_Angeles' },
	{ id: 'san-francisco', city: 'San Francisco', region: 'USA', timeZone: 'America/Los_Angeles' },
	{ id: 'las-vegas', city: 'Las Vegas', region: 'USA', timeZone: 'America/Los_Angeles' },
	{ id: 'atlanta', city: 'Atlanta', region: 'USA', timeZone: 'America/New_York' },
	{ id: 'boston', city: 'Boston', region: 'USA', timeZone: 'America/New_York' },
	{ id: 'miami', city: 'Miami', region: 'USA', timeZone: 'America/New_York' },
	{ id: 'honolulu', city: 'Honolulu', region: 'USA', timeZone: 'Pacific/Honolulu' },
	{ id: 'hawaii', city: 'Hawaii', region: 'USA', timeZone: 'Pacific/Honolulu' },
	{ id: 'anchorage', city: 'Anchorage', region: 'USA', timeZone: 'America/Anchorage' },
	{ id: 'alaska', city: 'Alaska', region: 'USA', timeZone: 'America/Anchorage' },
	{ id: 'toronto', city: 'Toronto', region: 'Canada', timeZone: 'America/Toronto' },
	{ id: 'vancouver', city: 'Vancouver', region: 'Canada', timeZone: 'America/Vancouver' },
	{ id: 'mexico-city', city: 'Mexico City', region: 'Mexico', timeZone: 'America/Mexico_City' },
	{ id: 'cancun', city: 'Cancún', region: 'Mexico', timeZone: 'America/Cancun' },
	{ id: 'puerto-rico', city: 'Puerto Rico', region: 'Puerto Rico', timeZone: 'America/Puerto_Rico' },
	{ id: 'jamaica', city: 'Jamaica', region: 'Jamaica', timeZone: 'America/Jamaica' },
	{ id: 'bahamas', city: 'Bahamas', region: 'Bahamas', timeZone: 'America/Nassau' },
	{ id: 'aruba', city: 'Aruba', region: 'Aruba', timeZone: 'America/Aruba' },
	{ id: 'costa-rica', city: 'Costa Rica', region: 'Costa Rica', timeZone: 'America/Costa_Rica' },
	{ id: 'bogota', city: 'Bogotá', region: 'Colombia', timeZone: 'America/Bogota' },
	{ id: 'colombia', city: 'Colombia', region: 'Colombia', timeZone: 'America/Bogota' },
	{ id: 'lima', city: 'Lima', region: 'Peru', timeZone: 'America/Lima' },
	{ id: 'peru', city: 'Peru', region: 'Peru', timeZone: 'America/Lima' },
	{ id: 'santiago', city: 'Santiago', region: 'Chile', timeZone: 'America/Santiago' },
	{ id: 'chile', city: 'Chile', region: 'Chile', timeZone: 'America/Santiago' },
	{ id: 'buenos-aires', city: 'Buenos Aires', region: 'Argentina', timeZone: 'America/Argentina/Buenos_Aires' },
	{ id: 'argentina', city: 'Argentina', region: 'Argentina', timeZone: 'America/Argentina/Buenos_Aires' },
	{ id: 'sao-paulo', city: 'São Paulo', region: 'Brazil', timeZone: 'America/Sao_Paulo' },
	{ id: 'brazil', city: 'Brazil', region: 'Brazil', timeZone: 'America/Sao_Paulo' },
	{ id: 'london', city: 'London', region: 'UK', timeZone: 'Europe/London' },
	{ id: 'scotland', city: 'Scotland', region: 'UK', timeZone: 'Europe/London' },
	{ id: 'dublin', city: 'Dublin', region: 'Ireland', timeZone: 'Europe/Dublin' },
	{ id: 'ireland', city: 'Ireland', region: 'Ireland', timeZone: 'Europe/Dublin' },
	{ id: 'lisbon', city: 'Lisbon', region: 'Portugal', timeZone: 'Europe/Lisbon' },
	{ id: 'portugal', city: 'Portugal', region: 'Portugal', timeZone: 'Europe/Lisbon' },
	{ id: 'madrid', city: 'Madrid', region: 'Spain', timeZone: 'Europe/Madrid' },
	{ id: 'amsterdam', city: 'Amsterdam', region: 'Netherlands', timeZone: 'Europe/Amsterdam' },
	{ id: 'rome', city: 'Rome', region: 'Italy', timeZone: 'Europe/Rome' },
	{ id: 'zurich', city: 'Zurich', region: 'Switzerland', timeZone: 'Europe/Zurich' },
	{ id: 'stockholm', city: 'Stockholm', region: 'Sweden', timeZone: 'Europe/Stockholm' },
	{ id: 'iceland', city: 'Iceland', region: 'Iceland', timeZone: 'Atlantic/Reykjavik' },
	{ id: 'athens', city: 'Athens', region: 'Greece', timeZone: 'Europe/Athens' },
	{ id: 'greece', city: 'Greece', region: 'Greece', timeZone: 'Europe/Athens' },
	{ id: 'istanbul', city: 'Istanbul', region: 'Turkey', timeZone: 'Europe/Istanbul' },
	{ id: 'moscow', city: 'Moscow', region: 'Russia', timeZone: 'Europe/Moscow' },
	{ id: 'cairo', city: 'Cairo', region: 'Egypt', timeZone: 'Africa/Cairo' },
	{ id: 'egypt', city: 'Egypt', region: 'Egypt', timeZone: 'Africa/Cairo' },
	{ id: 'morocco', city: 'Morocco', region: 'Morocco', timeZone: 'Africa/Casablanca' },
	{ id: 'nairobi', city: 'Nairobi', region: 'Kenya', timeZone: 'Africa/Nairobi' },
	{ id: 'kenya', city: 'Kenya', region: 'Kenya', timeZone: 'Africa/Nairobi' },
	{ id: 'johannesburg', city: 'Johannesburg', region: 'South Africa', timeZone: 'Africa/Johannesburg' },
	{ id: 'south-africa', city: 'South Africa', region: 'South Africa', timeZone: 'Africa/Johannesburg' },
	{ id: 'dubai', city: 'Dubai', region: 'UAE', timeZone: 'Asia/Dubai' },
	{ id: 'india', city: 'India', region: 'India', timeZone: 'Asia/Kolkata' },
	{ id: 'mumbai', city: 'Mumbai', region: 'India', timeZone: 'Asia/Kolkata' },
	{ id: 'delhi', city: 'Delhi', region: 'India', timeZone: 'Asia/Kolkata' },
	{ id: 'maldives', city: 'Maldives', region: 'Maldives', timeZone: 'Indian/Maldives' },
	{ id: 'thailand', city: 'Thailand', region: 'Thailand', timeZone: 'Asia/Bangkok' },
	{ id: 'bangkok', city: 'Bangkok', region: 'Thailand', timeZone: 'Asia/Bangkok' },
	{ id: 'vietnam', city: 'Vietnam', region: 'Vietnam', timeZone: 'Asia/Ho_Chi_Minh' },
	{ id: 'bali', city: 'Bali', region: 'Indonesia', timeZone: 'Asia/Makassar' },
	{ id: 'singapore', city: 'Singapore', region: 'Singapore', timeZone: 'Asia/Singapore' },
	{ id: 'philippines', city: 'Philippines', region: 'Philippines', timeZone: 'Asia/Manila' },
	{ id: 'manila', city: 'Manila', region: 'Philippines', timeZone: 'Asia/Manila' },
	{ id: 'hong-kong', city: 'Hong Kong', region: 'Hong Kong', timeZone: 'Asia/Hong_Kong' },
	{ id: 'china', city: 'China', region: 'China', timeZone: 'Asia/Shanghai' },
	{ id: 'beijing', city: 'Beijing', region: 'China', timeZone: 'Asia/Shanghai' },
	{ id: 'seoul', city: 'Seoul', region: 'South Korea', timeZone: 'Asia/Seoul' },
	{ id: 'tokyo', city: 'Tokyo', region: 'Japan', timeZone: 'Asia/Tokyo' },
	{ id: 'sydney', city: 'Sydney', region: 'Australia', timeZone: 'Australia/Sydney' },
	{ id: 'melbourne', city: 'Melbourne', region: 'Australia', timeZone: 'Australia/Melbourne' },
	{ id: 'brisbane', city: 'Brisbane', region: 'Australia', timeZone: 'Australia/Brisbane' },
	{ id: 'perth', city: 'Perth', region: 'Australia', timeZone: 'Australia/Perth' },
	{ id: 'auckland', city: 'Auckland', region: 'New Zealand', timeZone: 'Pacific/Auckland' },
	{ id: 'wellington', city: 'Wellington', region: 'New Zealand', timeZone: 'Pacific/Auckland' },
	{ id: 'fiji', city: 'Fiji', region: 'Fiji', timeZone: 'Pacific/Fiji' },
];

export interface ZonedParts {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;
	weekday: string;
}

const partsFormatterCache = new Map<string, Intl.DateTimeFormat>();

function getPartsFormatter(timeZone: string): Intl.DateTimeFormat {
	let formatter = partsFormatterCache.get(timeZone);
	if (!formatter) {
		formatter = new Intl.DateTimeFormat('en-US', {
			timeZone,
			hourCycle: 'h23',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			weekday: 'short',
		});
		partsFormatterCache.set(timeZone, formatter);
	}
	return formatter;
}

/** Reads a moment's wall-clock date/time components in a given IANA zone. */
export function partsInZone(date: Date, timeZone: string): ZonedParts {
	const parts = getPartsFormatter(timeZone)
		.formatToParts(date)
		.reduce<Record<string, string>>((acc, p) => {
			acc[p.type] = p.value;
			return acc;
		}, {});
	return {
		year: Number(parts.year),
		month: Number(parts.month),
		day: Number(parts.day),
		hour: Number(parts.hour),
		minute: Number(parts.minute),
		second: Number(parts.second),
		weekday: parts.weekday ?? '',
	};
}

/**
 * The zone's UTC offset, in minutes, at a given moment (positive = ahead of
 * UTC). Computed by re-reading the moment's wall-clock time in that zone and
 * comparing it against the same moment expressed as a UTC instant — the
 * standard `Intl.DateTimeFormat` offset-extraction technique — rather than a
 * stored table, so it automatically reflects daylight saving for that date.
 */
export function offsetMinutes(date: Date, timeZone: string): number {
	const p = partsInZone(date, timeZone);
	const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
	return Math.round((asUtc - date.getTime()) / 60000);
}

export function formatOffsetLabel(minutes: number): string {
	const sign = minutes < 0 ? '-' : '+';
	const abs = Math.abs(minutes);
	const h = Math.floor(abs / 60);
	const m = abs % 60;
	return m === 0 ? `UTC${sign}${h}` : `UTC${sign}${h}:${String(m).padStart(2, '0')}`;
}

export interface DstInfo {
	observesDst: boolean;
	isCurrentlyDst: boolean;
	standardOffsetMinutes: number;
	dstOffsetMinutes: number;
}

/**
 * Whether a zone observes daylight saving and whether the given moment falls
 * in it. Standard vs. DST offset is determined by sampling January 1 and
 * July 1 of the moment's year: DST always sets clocks forward, so whichever
 * of the two samples has the larger (more positive / less negative) UTC
 * offset is the DST offset — true in both hemispheres, since a Southern
 * Hemisphere zone's DST period falls in the Northern winter sample (January)
 * rather than July.
 */
export function getDstInfo(date: Date, timeZone: string): DstInfo {
	const year = partsInZone(date, timeZone).year;
	const janOffset = offsetMinutes(new Date(Date.UTC(year, 0, 1, 12, 0, 0)), timeZone);
	const julOffset = offsetMinutes(new Date(Date.UTC(year, 6, 1, 12, 0, 0)), timeZone);
	const standardOffsetMinutes = Math.min(janOffset, julOffset);
	const dstOffsetMinutes = Math.max(janOffset, julOffset);
	const observesDst = janOffset !== julOffset;
	const current = offsetMinutes(date, timeZone);
	return {
		observesDst,
		isCurrentlyDst: observesDst && current === dstOffsetMinutes,
		standardOffsetMinutes,
		dstOffsetMinutes,
	};
}

export interface WallTime {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
}

/**
 * Converts a wall-clock time meant in `timeZone` to the UTC instant it
 * represents. Two passes: the first treats the wall-clock digits as if they
 * were already UTC to get a same-magnitude instant, reads that zone's offset
 * at (approximately) that instant, and corrects for it; the second pass
 * re-reads the offset at the corrected instant in case the first correction
 * crossed a DST transition boundary. Two passes fully resolve every real
 * tzdata transition (all are single-hour shifts).
 */
export function wallTimeToUtc(wall: WallTime, timeZone: string): Date {
	let utcMillis = Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute, 0);
	for (let i = 0; i < 2; i++) {
		const offset = offsetMinutes(new Date(utcMillis), timeZone);
		utcMillis = Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute, 0) - offset * 60000;
	}
	return new Date(utcMillis);
}

export interface ConversionResult {
	target: ZonedParts;
	targetOffsetLabel: string;
	sourceOffsetLabel: string;
	/** Target date minus source date, in whole days (handles the international date line). */
	dayShift: number;
	/** Target UTC offset minus source UTC offset, in hours (can be fractional, e.g. India's +5:30). */
	hourDifference: number;
	utc: Date;
}

export function convertTime(wall: WallTime, fromTimeZone: string, toTimeZone: string): ConversionResult {
	const utc = wallTimeToUtc(wall, fromTimeZone);
	const target = partsInZone(utc, toTimeZone);
	const sourceOffset = offsetMinutes(utc, fromTimeZone);
	const targetOffset = offsetMinutes(utc, toTimeZone);
	// Day-shift via a proleptic day-number difference (not a naive date
	// subtraction) so it stays correct across month/year boundaries.
	const sourceDayNumber = Date.UTC(wall.year, wall.month - 1, wall.day) / 86400000;
	const targetDayNumber = Date.UTC(target.year, target.month - 1, target.day) / 86400000;
	return {
		target,
		targetOffsetLabel: formatOffsetLabel(targetOffset),
		sourceOffsetLabel: formatOffsetLabel(sourceOffset),
		dayShift: Math.round(targetDayNumber - sourceDayNumber),
		hourDifference: (targetOffset - sourceOffset) / 60,
		utc,
	};
}

export function findCity(id: string): CityZone | undefined {
	return CITIES.find((c) => c.id === id);
}
