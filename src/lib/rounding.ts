/**
 * Exact decimal rounding: seven modes matching Wikipedia's "Rounding"
 * article (Directed rounding to an integer / Rounding to the nearest
 * integer sections) — half-up, half-down, half-away-from-zero,
 * half-to-even, ceiling, floor, truncate.
 *
 * This works on the decimal digits of the input string via BigInt, never
 * converting through a binary float. That sidesteps a real, well-documented
 * IEEE 754 quirk: 1.005 has no exact binary floating-point representation
 * (the nearest double is ~1.00499999999999989), so naive
 * `Math.round(1.005 * 100) / 100` rounds it down to 1.00 instead of up to
 * 1.01. Operating on the typed digits directly means this calculator's
 * result always matches what the decimal digits actually say, with no
 * float-precision artifacts.
 */

export type RoundingMethod = 'half-up' | 'half-down' | 'half-away-from-zero' | 'half-to-even' | 'ceiling' | 'floor' | 'truncate';

interface ParsedDecimal {
	negative: boolean;
	/** All digits (integer + fractional part) as one unsigned integer. */
	digits: bigint;
	/** How many of those digits sit after the decimal point. */
	scale: number;
}

const DECIMAL_PATTERN = /^([+-]?)(\d*)(?:\.(\d+))?$/;

export function parseDecimalString(input: string): ParsedDecimal | null {
	const trimmed = input.trim();
	if (trimmed === '' || trimmed === '-' || trimmed === '+') return null;
	const match = DECIMAL_PATTERN.exec(trimmed);
	if (!match) return null;
	const [, signStr, intPart, fracPart = ''] = match;
	if (intPart === '' && fracPart === '') return null;
	const digitsStr = (intPart || '0') + fracPart;
	return {
		negative: signStr === '-',
		digits: BigInt(digitsStr),
		scale: fracPart.length,
	};
}

export interface RoundResult {
	/** Exact decimal string, e.g. "123.40" or "-2000". */
	formatted: string;
	/** Number(formatted) — safe for display/arithmetic within normal double precision. */
	value: number;
	/** Power of ten the result is a multiple of (3 = nearest 1000, -2 = nearest 0.01). */
	placeExponent: number;
	/** True when the input landed exactly on the halfway point at this place value. */
	wasExactTie: boolean;
}

function formatUnsigned(quotient: bigint, placeExponent: number): string {
	if (placeExponent >= 0) {
		return quotient === 0n ? '0' : quotient.toString() + '0'.repeat(placeExponent);
	}
	const decimals = -placeExponent;
	const digitsStr = quotient.toString().padStart(decimals + 1, '0');
	const intPart = digitsStr.slice(0, digitsStr.length - decimals);
	const fracPart = digitsStr.slice(digitsStr.length - decimals);
	return `${intPart}.${fracPart}`;
}

/**
 * Rounds a decimal string to the nearest multiple of 10^placeExponent using
 * the given tie-breaking / directed rounding method. Returns null if the
 * input isn't a plain decimal number.
 */
export function roundToPlaceValue(input: string, placeExponent: number, method: RoundingMethod): RoundResult | null {
	const parsed = parseDecimalString(input);
	if (!parsed) return null;

	const shift = parsed.scale + placeExponent;
	if (shift <= 0) {
		// The requested place value is already at or finer than the input's
		// own precision — nothing to round.
		const formatted = (parsed.negative && parsed.digits !== 0n ? '-' : '') + formatUnsigned(parsed.digits, -parsed.scale);
		return { formatted, value: Number(formatted), placeExponent: parsed.scale === 0 ? 0 : -parsed.scale, wasExactTie: false };
	}

	const divisor = 10n ** BigInt(shift);
	const quotient = parsed.digits / divisor;
	const remainder = parsed.digits % divisor;
	const half = divisor / 2n;
	const isTie = remainder === half;
	const positive = !parsed.negative;
	const roundedUpMagnitude = quotient + 1n; // magnitude if this remainder pushes away from zero
	const magnitudeNearer = remainder * 2n > divisor ? roundedUpMagnitude : quotient; // ignores ties

	// Each branch produces the FINAL SIGNED result directly (not an unsigned
	// magnitude re-signed afterward), because directed rounding (ceiling,
	// floor) is asymmetric: e.g. floor(-2.3) = -3 extends the magnitude away
	// from zero while floor(2.3) = 2 truncates it, so a shared
	// "magnitude + reapply sign" step would get one of the two signs wrong.
	let signedResult: bigint;
	switch (method) {
		case 'ceiling': // toward +Infinity
			signedResult = positive ? (remainder > 0n ? roundedUpMagnitude : quotient) : -quotient;
			break;
		case 'floor': // toward -Infinity
			signedResult = positive ? quotient : -(remainder > 0n ? roundedUpMagnitude : quotient);
			break;
		case 'truncate': // toward zero
			signedResult = positive ? quotient : -quotient;
			break;
		case 'half-away-from-zero': {
			const magnitude = isTie || remainder * 2n > divisor ? roundedUpMagnitude : quotient;
			signedResult = positive ? magnitude : -magnitude;
			break;
		}
		case 'half-up': { // ties toward +Infinity
			const magnitude = isTie ? (positive ? roundedUpMagnitude : quotient) : magnitudeNearer;
			signedResult = positive ? magnitude : -magnitude;
			break;
		}
		case 'half-down': { // ties toward -Infinity
			const magnitude = isTie ? (positive ? quotient : roundedUpMagnitude) : magnitudeNearer;
			signedResult = positive ? magnitude : -magnitude;
			break;
		}
		case 'half-to-even': {
			const magnitude = isTie ? (quotient % 2n === 0n ? quotient : roundedUpMagnitude) : magnitudeNearer;
			signedResult = positive ? magnitude : -magnitude;
			break;
		}
	}

	const formatted = (signedResult < 0n ? '-' : '') + formatUnsigned(signedResult < 0n ? -signedResult : signedResult, placeExponent);
	return { formatted, value: Number(formatted), placeExponent, wasExactTie: isTie };
}

/**
 * Rounds to N significant figures, using the standard "leading nonzero
 * digit" counting convention (see ASTM's public explainer on significant
 * digits, cited on the tool page). Leading zeros in a value like 0.0034
 * don't count; trailing zeros in an integer like 1200
 * are ambiguous without scientific notation, which is why the UI also
 * offers an exponential-form readout for this mode.
 */
export function roundToSignificantFigures(input: string, sigFigs: number, method: RoundingMethod): RoundResult | null {
	const parsed = parseDecimalString(input);
	if (!parsed) return null;
	if (parsed.digits === 0n) {
		return { formatted: '0', value: 0, placeExponent: 0, wasExactTie: false };
	}
	const digitsStr = parsed.digits.toString();
	const leadingExponent = digitsStr.length - 1 - parsed.scale;
	const placeExponent = leadingExponent - (sigFigs - 1);
	return roundToPlaceValue(input, placeExponent, method);
}

/** "1.20 × 10^4"-style string, for showing significant-figure trailing zeros unambiguously. */
export function toExponentialForm(result: RoundResult, sigFigs: number): string {
	if (result.value === 0) return `0 × 10^0`;
	const negative = result.formatted.startsWith('-');
	const digitsOnly = result.formatted.replace('-', '').replace('.', '');
	const trimmedLeadingZeros = digitsOnly.replace(/^0+/, '') || '0';
	const mantissaDigits = trimmedLeadingZeros.padEnd(sigFigs, '0').slice(0, sigFigs);
	const mantissa = mantissaDigits.length > 1 ? `${mantissaDigits[0]}.${mantissaDigits.slice(1)}` : mantissaDigits;
	// Recompute the decimal exponent independently from the formatted string
	// (not reused from the rounding step) so this stays correct even when
	// rounding carried the value across a power of ten (e.g. 995 -> 1000).
	const parsed = parseDecimalString(result.formatted)!;
	const digitsStr = parsed.digits.toString();
	const exponent = digitsStr.length - 1 - parsed.scale;
	return `${negative ? '-' : ''}${mantissa} × 10^${exponent}`;
}
