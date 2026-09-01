/**
 * Electrical power/current/voltage conversion via Watt's Law (P = V x I) and
 * its three-phase variants.
 *
 * Formula authority: Ohm's Law (V = I x R) and the power law P = V x I are
 * the standard relationships among voltage, current, resistance, and power
 * (Wikipedia -- "Ohm's law"; "Electric power"). The AC single-phase form
 * P = V x I x PF and the two three-phase forms (P = sqrt(3) x V_LL x I x PF
 * for line-to-line voltage, P = 3 x V_LN x I x PF for line-to-neutral
 * voltage) are standard electrical-engineering formulas for real power in
 * AC circuits, cross-referenced against IEC 60038 (which defines the
 * line-to-line/line-to-neutral voltage systems these formulas assume).
 *
 * Power factor (PF) accounts for AC voltage and current being out of phase
 * in circuits with inductive or capacitive loads (motors, transformers).
 * PF = 1 for purely resistive loads (heaters, incandescent bulbs) and for
 * all DC circuits, where there is no phase to be out of.
 */

export type CircuitType = 'dc' | 'ac1' | 'ac3';
export type ThreePhaseVoltageType = 'line-to-line' | 'line-to-neutral';

/**
 * The constant multiplier applied to V x I x PF for each circuit type.
 * DC and AC single-phase are both 1; three-phase uses sqrt(3) for a
 * line-to-line voltage reading or 3 for a line-to-neutral reading.
 */
export function multiplierFor(circuit: CircuitType, voltageType: ThreePhaseVoltageType): number {
	if (circuit !== 'ac3') return 1;
	return voltageType === 'line-to-neutral' ? 3 : Math.sqrt(3);
}

export function wattsFrom(
	volts: number,
	amps: number,
	powerFactor: number,
	circuit: CircuitType,
	voltageType: ThreePhaseVoltageType,
): number {
	return volts * amps * powerFactor * multiplierFor(circuit, voltageType);
}

export function ampsFrom(
	watts: number,
	volts: number,
	powerFactor: number,
	circuit: CircuitType,
	voltageType: ThreePhaseVoltageType,
): number {
	return watts / (volts * powerFactor * multiplierFor(circuit, voltageType));
}

export function voltsFrom(
	watts: number,
	amps: number,
	powerFactor: number,
	circuit: CircuitType,
	voltageType: ThreePhaseVoltageType,
): number {
	return watts / (amps * powerFactor * multiplierFor(circuit, voltageType));
}

/** Rounds to 2dp so a clean input doesn't come back with float noise. */
export function round2(n: number): number {
	return Math.round(n * 100) / 100;
}
