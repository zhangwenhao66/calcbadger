import { useEffect, useMemo, useState } from 'preact/hooks';
import { ANSI_104_LAYOUT, classifyRollover, totalKeyCount, trackMaxSimultaneous } from '../../lib/keyboardTest';

const MODIFIER_CODES = new Set([
	'ShiftLeft',
	'ShiftRight',
	'ControlLeft',
	'ControlRight',
	'AltLeft',
	'AltRight',
	'MetaLeft',
	'MetaRight',
]);

// Prevent the page from scrolling under the tester while these are held.
const SCROLL_KEYS = new Set(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown']);

const TOTAL_KEYS = totalKeyCount(ANSI_104_LAYOUT);

interface LastKey {
	key: string;
	code: string;
	keyCode: number;
}

export default function KeyboardTest() {
	const [heldCodes, setHeldCodes] = useState<Set<string>>(new Set());
	const [testedCodes, setTestedCodes] = useState<Set<string>>(new Set());
	const [maxHeld, setMaxHeld] = useState(0);
	const [lastKey, setLastKey] = useState<LastKey | null>(null);

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (SCROLL_KEYS.has(e.code)) e.preventDefault();
			setHeldCodes((prev) => (prev.has(e.code) ? prev : new Set(prev).add(e.code)));
			setTestedCodes((prev) => (prev.has(e.code) ? prev : new Set(prev).add(e.code)));
			setLastKey({ key: e.key, code: e.code, keyCode: e.keyCode });
		}
		function onKeyUp(e: KeyboardEvent) {
			setHeldCodes((prev) => {
				if (!prev.has(e.code)) return prev;
				const next = new Set(prev);
				next.delete(e.code);
				return next;
			});
		}
		function onBlur() {
			// Losing window focus means the browser stops delivering keyup events
			// for keys that are still physically held, so clear the held set.
			setHeldCodes(new Set());
		}
		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);
		window.addEventListener('blur', onBlur);
		return () => {
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('keyup', onKeyUp);
			window.removeEventListener('blur', onBlur);
		};
	}, []);

	const nonModifierHeldCount = useMemo(
		() => [...heldCodes].filter((c) => !MODIFIER_CODES.has(c)).length,
		[heldCodes],
	);

	useEffect(() => {
		setMaxHeld((prev) => trackMaxSimultaneous(nonModifierHeldCount, prev));
	}, [nonModifierHeldCount]);

	const rollover = classifyRollover(maxHeld);
	const testedCount = testedCodes.size;
	const testedPct = Math.round((testedCount / TOTAL_KEYS) * 100);

	function reset() {
		setTestedCodes(new Set());
		setMaxHeld(0);
		setLastKey(null);
	}

	return (
		<div class="calc">
			<p class="calc-note" style="margin-top:0">
				Click anywhere on this page first so your browser is sending key events here, then press keys
				(including several at once) on a physical keyboard. Nothing you type is recorded, stored, or sent
				anywhere: this runs entirely in your browser tab.
			</p>

			<div class="kbtest-wrap">
				<div class="kbtest-board">
					{ANSI_104_LAYOUT.map((row, i) => (
						<div class="kbtest-row" key={i}>
							{row.map((k) => {
								const held = heldCodes.has(k.code);
								const tested = testedCodes.has(k.code);
								return (
									<div
										key={k.code}
										class={`kbtest-key${held ? ' held' : ''}${!held && tested ? ' tested' : ''}`}
										style={`flex-basis:${k.width * 2.5}rem`}
										title={k.code}
									>
										{k.label}
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>

			<div class="calc-results" style="margin-top:1rem">
				<div>
					<p class="calc-result-label">Keys held right now (excluding modifiers)</p>
					<p class="calc-result-value">{nonModifierHeldCount}</p>
				</div>
				<div>
					<p class="calc-result-label">Highest rollover reached</p>
					<p class="calc-result-value primary">{rollover.tier}</p>
				</div>
				<div>
					<p class="calc-result-label">Keys tested on this layout</p>
					<p class="calc-result-value">
						{testedCount} / {TOTAL_KEYS} ({testedPct}%)
					</p>
				</div>
			</div>
			<p class="calc-note">{rollover.description}</p>

			{lastKey && (
				<p class="calc-note">
					Last key: <strong>{lastKey.key === ' ' ? 'Space' : lastKey.key}</strong>, event.code{' '}
					<code>{lastKey.code}</code>, legacy keyCode <code>{lastKey.keyCode}</code>
				</p>
			)}

			<button type="button" class="pixel-test-launch" style="margin-top:0.9rem" onClick={reset}>
				<span>Reset test</span>
				<span style="font-weight:400;font-size:0.85rem;opacity:0.75">
					Clears which keys are marked tested and resets the rollover count
				</span>
			</button>
		</div>
	);
}
