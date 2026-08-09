import { describe, expect, it } from 'vitest';
import {
	CITIES,
	convertTime,
	findCity,
	formatOffsetLabel,
	getDstInfo,
	offsetMinutes,
	partsInZone,
	wallTimeToUtc,
} from '../src/lib/worldClock';

// Expected values below were computed independently with Python's zoneinfo
// module (stdlib, reads the same IANA tzdata) — not derived from this
// implementation. Reproduction commands are noted per group.
//
//   python3 -c "
//   from zoneinfo import ZoneInfo
//   from datetime import datetime
//   dt = datetime(2026,1,15,12,0,tzinfo=ZoneInfo('America/New_York'))
//   print(dt.utcoffset())"

describe('offsetMinutes', () => {
	it('America/New_York is -300 min (EST) in January 2026', () => {
		expect(offsetMinutes(new Date(Date.UTC(2026, 0, 15, 12, 0, 0)), 'America/New_York')).toBe(-300);
	});

	it('America/New_York is -240 min (EDT) in July 2026', () => {
		expect(offsetMinutes(new Date(Date.UTC(2026, 6, 15, 12, 0, 0)), 'America/New_York')).toBe(-240);
	});

	it('Asia/Kolkata is +330 min year-round (no DST)', () => {
		expect(offsetMinutes(new Date(Date.UTC(2026, 0, 15, 12, 0, 0)), 'Asia/Kolkata')).toBe(330);
		expect(offsetMinutes(new Date(Date.UTC(2026, 6, 15, 12, 0, 0)), 'Asia/Kolkata')).toBe(330);
	});

	it('Australia/Sydney is +660 min (AEDT) in January, +600 (AEST) in July — Southern Hemisphere DST', () => {
		expect(offsetMinutes(new Date(Date.UTC(2026, 0, 15, 1, 0, 0)), 'Australia/Sydney')).toBe(660);
		expect(offsetMinutes(new Date(Date.UTC(2026, 6, 15, 2, 0, 0)), 'Australia/Sydney')).toBe(600);
	});

	it('America/Phoenix has no DST (stays -420 min year-round)', () => {
		expect(offsetMinutes(new Date(Date.UTC(2026, 0, 15, 12, 0, 0)), 'America/Phoenix')).toBe(-420);
		expect(offsetMinutes(new Date(Date.UTC(2026, 6, 15, 12, 0, 0)), 'America/Phoenix')).toBe(-420);
	});
});

describe('formatOffsetLabel', () => {
	it('formats whole-hour offsets', () => {
		expect(formatOffsetLabel(-300)).toBe('UTC-5');
		expect(formatOffsetLabel(540)).toBe('UTC+9');
		expect(formatOffsetLabel(0)).toBe('UTC+0');
	});

	it('formats half/quarter-hour offsets', () => {
		expect(formatOffsetLabel(330)).toBe('UTC+5:30');
		expect(formatOffsetLabel(345)).toBe('UTC+5:45'); // Nepal-style, exercises the padStart path
	});
});

describe('getDstInfo', () => {
	it('flags America/New_York as DST-observing and correctly in/out of DST', () => {
		const info = getDstInfo(new Date(Date.UTC(2026, 6, 15, 12, 0, 0)), 'America/New_York');
		expect(info.observesDst).toBe(true);
		expect(info.isCurrentlyDst).toBe(true);
		expect(info.standardOffsetMinutes).toBe(-300);
		expect(info.dstOffsetMinutes).toBe(-240);

		const winter = getDstInfo(new Date(Date.UTC(2026, 0, 15, 12, 0, 0)), 'America/New_York');
		expect(winter.isCurrentlyDst).toBe(false);
	});

	it('flags Asia/Kolkata as not observing DST', () => {
		const info = getDstInfo(new Date(Date.UTC(2026, 6, 15, 12, 0, 0)), 'Asia/Kolkata');
		expect(info.observesDst).toBe(false);
		expect(info.isCurrentlyDst).toBe(false);
	});

	it('flags Australia/Sydney (Southern Hemisphere) as in DST during the Northern-winter sample month', () => {
		const january = getDstInfo(new Date(Date.UTC(2026, 0, 15, 1, 0, 0)), 'Australia/Sydney');
		expect(january.observesDst).toBe(true);
		expect(january.isCurrentlyDst).toBe(true);
	});
});

describe('wallTimeToUtc / convertTime', () => {
	// python: dt_ny = datetime(2026,3,10,9,0,tzinfo=ZoneInfo('America/New_York'))
	//         dt_ny.astimezone(ZoneInfo('Asia/Tokyo')) -> 2026-03-10T22:00:00+09:00
	it('New York 09:00 on 2026-03-10 (after US DST start) equals Tokyo 22:00 same day', () => {
		const result = convertTime({ year: 2026, month: 3, day: 10, hour: 9, minute: 0 }, 'America/New_York', 'Asia/Tokyo');
		expect(result.target).toMatchObject({ year: 2026, month: 3, day: 10, hour: 22, minute: 0 });
		expect(result.dayShift).toBe(0);
		expect(result.sourceOffsetLabel).toBe('UTC-4');
		expect(result.targetOffsetLabel).toBe('UTC+9');
	});

	// python: dt_la = datetime(2026,6,1,22,0,tzinfo=ZoneInfo('America/Los_Angeles'))
	//         dt_la.astimezone(ZoneInfo('Australia/Sydney')) -> 2026-06-02T15:00:00+10:00
	it('Los Angeles 22:00 on 2026-06-01 rolls forward a day to Sydney 15:00 on 2026-06-02', () => {
		const result = convertTime({ year: 2026, month: 6, day: 1, hour: 22, minute: 0 }, 'America/Los_Angeles', 'Australia/Sydney');
		expect(result.target).toMatchObject({ year: 2026, month: 6, day: 2, hour: 15, minute: 0 });
		expect(result.dayShift).toBe(1);
	});

	// python: dt_akl = datetime(2026,1,1,0,30,tzinfo=ZoneInfo('Pacific/Auckland'))
	//         dt_akl.astimezone(ZoneInfo('Pacific/Honolulu')) -> 2025-12-31T01:30:00-10:00
	it('Auckland 00:30 on 2026-01-01 rolls back a day to Honolulu 01:30 on 2025-12-31', () => {
		const result = convertTime({ year: 2026, month: 1, day: 1, hour: 0, minute: 30 }, 'Pacific/Auckland', 'Pacific/Honolulu');
		expect(result.target).toMatchObject({ year: 2025, month: 12, day: 31, hour: 1, minute: 30 });
		expect(result.dayShift).toBe(-1);
	});

	it('converting a zone to itself is a no-op', () => {
		const result = convertTime({ year: 2026, month: 5, day: 20, hour: 14, minute: 15 }, 'Europe/London', 'Europe/London');
		expect(result.target).toMatchObject({ year: 2026, month: 5, day: 20, hour: 14, minute: 15 });
		expect(result.dayShift).toBe(0);
		expect(result.hourDifference).toBe(0);
	});

	it('half-hour-offset zones (India) produce a fractional hour difference', () => {
		const result = convertTime({ year: 2026, month: 5, day: 20, hour: 12, minute: 0 }, 'UTC', 'Asia/Kolkata');
		expect(result.hourDifference).toBe(5.5);
		expect(result.target).toMatchObject({ year: 2026, month: 5, day: 20, hour: 17, minute: 30 });
	});

	it('round-trips through wallTimeToUtc and partsInZone', () => {
		const wall = { year: 2026, month: 9, day: 3, hour: 8, minute: 45 };
		const utc = wallTimeToUtc(wall, 'Asia/Shanghai');
		const back = partsInZone(utc, 'Asia/Shanghai');
		expect(back).toMatchObject(wall);
	});
});

describe('CITIES data integrity', () => {
	it('every city id is unique', () => {
		const ids = CITIES.map((c) => c.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('every listed IANA time zone is accepted by Intl.DateTimeFormat', () => {
		for (const c of CITIES) {
			expect(() => new Intl.DateTimeFormat('en-US', { timeZone: c.timeZone })).not.toThrow();
		}
	});

	it('findCity resolves a known id and returns undefined for an unknown one', () => {
		expect(findCity('tokyo')?.timeZone).toBe('Asia/Tokyo');
		expect(findCity('atlantis')).toBeUndefined();
	});
});
