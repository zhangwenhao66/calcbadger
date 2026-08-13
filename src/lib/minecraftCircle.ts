/**
 * Digital circle rasterization for Minecraft-style block grids.
 *
 * Source: the standard distance-threshold approach used across the
 * Minecraft-building community since Donat Studios' 2012 Pixel Circle / Oval
 * Generator (the tool most later generators in this niche copy). A block is
 * "in" the circle when the straight-line distance from its center to the
 * true center is at most the radius. This is a simpler cousin of the
 * incremental digital-circle-rasterization techniques used to draw circles
 * on any pixel grid. A radius of r always produces an odd diameter of
 * 2r + 1 blocks, since that gives the shape a single true center block
 * rather than splitting the center across four blocks.
 */

export type CircleMode = 'filled' | 'outline';

export interface CircleRow {
	/** Row offset from the center row; 0 is the row through the middle block. */
	rowOffset: number;
	blockCount: number;
	/** Leftmost column offset (relative to center) that has a block in this row. */
	startCol: number;
	/** Rightmost column offset (relative to center) that has a block in this row. */
	endCol: number;
}

export interface CircleResult {
	radius: number;
	diameter: number;
	mode: CircleMode;
	/** grid[row][col], both 0-indexed, size = diameter. True = block placed. */
	grid: boolean[][];
	blockCount: number;
	rows: CircleRow[];
}

export const MIN_RADIUS = 1;
export const MAX_RADIUS = 30;

/**
 * Builds the filled disc: block (row, col), offsets in [-radius, radius],
 * is placed when its center is at most `radius` blocks from the true center.
 */
function buildFilledGrid(radius: number): boolean[][] {
	const size = radius * 2 + 1;
	const grid: boolean[][] = [];
	for (let r = -radius; r <= radius; r++) {
		const row: boolean[] = [];
		for (let c = -radius; c <= radius; c++) {
			const distance = Math.sqrt(r * r + c * c);
			// Epsilon guards against float error putting an exact-radius block
			// (e.g. r=3, offset (0,3), distance exactly 3) just outside the cut.
			row.push(distance <= radius + 1e-9);
		}
		grid.push(row);
	}
	return grid;
}

/**
 * Outline mode keeps only blocks on the surface of the filled disc: a
 * filled block stays if any of its four orthogonal neighbors (or the grid
 * edge) is not filled. This can leave small radii looking sparse — at
 * radius 1 the single center block is fully enclosed by its four neighbors,
 * so it drops out, leaving four disconnected arm blocks. That is the
 * correct result of the rule, not a bug: a 3x3 plus shape has no interior
 * to hollow out.
 */
function buildOutlineGrid(filled: boolean[][]): boolean[][] {
	const size = filled.length;
	return filled.map((row, r) =>
		row.map((isFilled, c) => {
			if (!isFilled) return false;
			const neighbors: Array<[number, number]> = [
				[r - 1, c],
				[r + 1, c],
				[r, c - 1],
				[r, c + 1],
			];
			return neighbors.some(
				([nr, nc]) => nr < 0 || nr >= size || nc < 0 || nc >= size || !filled[nr]![nc],
			);
		}),
	);
}

export function generateCircle(radiusInput: number, mode: CircleMode): CircleResult {
	if (!Number.isFinite(radiusInput) || radiusInput < 0) {
		throw new Error('Radius must be a non-negative number');
	}
	const radius = Math.round(radiusInput);
	const filled = buildFilledGrid(radius);
	const grid = mode === 'outline' ? buildOutlineGrid(filled) : filled;
	const size = grid.length;

	let blockCount = 0;
	const rows: CircleRow[] = [];
	for (let r = 0; r < size; r++) {
		let startCol = -1;
		let endCol = -1;
		let count = 0;
		for (let c = 0; c < size; c++) {
			if (grid[r]![c]) {
				count++;
				if (startCol === -1) startCol = c;
				endCol = c;
			}
		}
		blockCount += count;
		if (count > 0) {
			rows.push({
				rowOffset: r - radius,
				blockCount: count,
				startCol: startCol - radius,
				endCol: endCol - radius,
			});
		}
	}

	return { radius, diameter: size, mode, grid, blockCount, rows };
}

/** Plain-text row-by-row build schematic, suitable for a copy button. */
export function circleToSchematic(result: CircleResult): string {
	const lines = result.rows.map((row) => {
		const width = row.endCol - row.startCol + 1;
		return `Row ${row.rowOffset >= 0 ? '+' : ''}${row.rowOffset}: ${row.blockCount} block${row.blockCount === 1 ? '' : 's'}, columns ${row.startCol} to ${row.endCol} (span ${width})`;
	});
	return [
		`Minecraft circle — radius ${result.radius}, diameter ${result.diameter}, ${result.mode} (${result.blockCount} blocks total)`,
		...lines,
	].join('\n');
}
