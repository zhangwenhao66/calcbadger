/**
 * Board foot (lumber volume) math.
 *
 * Formula authority: University of Wisconsin-Madison Division of Extension,
 * Forestry, FEM-042 "What Is A Board Foot?" — board feet = (thickness in. x
 * width in. x length ft.) / 12, for sawed/dimensional lumber measured by
 * actual (not nominal) dimensions. 1 board foot = 144 cubic inches (12" x
 * 12" x 1").
 *
 * Quarter system (4/4 = 1", 8/4 = 2") is the National Hardwood Lumber
 * Association's rough-sawn thickness convention.
 */

export type LengthUnit = 'ft' | 'in';

const TO_FEET: Record<LengthUnit, number> = {
	ft: 1,
	in: 1 / 12,
};

export function toFeet(value: number, unit: LengthUnit): number {
	return value * TO_FEET[unit];
}

/** Rough-sawn quarter notation to inches: 4/4 -> 1", 8/4 -> 2". */
export function quartersToInches(quarters: number): number {
	return quarters * 0.25;
}

/** Board feet for one piece: (thickness in. x width in. x length ft.) / 12. */
export function boardFeetPerPiece(thicknessIn: number, widthIn: number, lengthFt: number): number {
	return (thicknessIn * widthIn * lengthFt) / 12;
}

export function totalBoardFeet(perPieceBf: number, quantity: number): number {
	return perPieceBf * quantity;
}

/** Add a waste/defect allowance (common shop rule of thumb, 10-20% for hardwood). */
export function withWaste(boardFeet: number, wastePercent: number): number {
	return boardFeet * (1 + wastePercent / 100);
}

export function costEstimate(boardFeet: number, pricePerBf: number): number {
	return boardFeet * pricePerBf;
}
