/**
 * Molarity (molar concentration) math.
 *
 * Formula authority: IUPAC Gold Book, "amount concentration" — c = n/V, with
 * n = m/M (amount of substance = mass / molar mass). So:
 *
 *   molarity (mol/L) = mass (g) / (molar mass (g/mol) x volume (L))
 *
 * Dilution follows the standard c1V1 = c2V2 relation (conservation of amount
 * of substance, any general-chemistry text).
 */

/** c = m / (M x V). Mass in grams, molar mass in g/mol, volume in liters. */
export function molarity(massG: number, molarMassGPerMol: number, volumeL: number): number {
	return massG / (molarMassGPerMol * volumeL);
}

/** m = c x M x V. */
export function massForMolarity(
	molarityMolPerL: number,
	molarMassGPerMol: number,
	volumeL: number,
): number {
	return molarityMolPerL * molarMassGPerMol * volumeL;
}

/** V = m / (M x c). */
export function volumeForMolarity(
	massG: number,
	molarMassGPerMol: number,
	molarityMolPerL: number,
): number {
	return massG / (molarMassGPerMol * molarityMolPerL);
}

/** M = m / (c x V). */
export function molarMassFromMolarity(
	massG: number,
	molarityMolPerL: number,
	volumeL: number,
): number {
	return massG / (molarityMolPerL * volumeL);
}

/** Moles of solute actually present: n = c x V. */
export function molesOfSolute(molarityMolPerL: number, volumeL: number): number {
	return molarityMolPerL * volumeL;
}

/** c1V1 = c2V2 -> V1 = c2V2/c1 (volume of stock needed for a dilution). */
export function dilutionStockVolume(c1: number, c2: number, v2: number): number {
	return (c2 * v2) / c1;
}
