// Fixture tests for the waste widgets' date logic. Extracts the REAL expressions from the widget YAML and runs
// them with a controllable clock. Run with TZ=Europe/Vienna (default below) so the DST cases are meaningful.
process.env.TZ ||= 'Europe/Vienna';
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url'; import YAML from 'yaml'; import dayjs from 'dayjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'widgets');
const fam = YAML.parse(fs.readFileSync(path.join(root, 'waste_pickup_card', 'widgets.yaml'), 'utf8')).widgets;
const load = (n) => fam[n];
const row = load('waste_pickup_row'), chips = load('waste_pickup_chips'), card = load('waste_pickup_card');
const rel = row.slots.default[2].config.text.slice(1);
const rowBg = row.config.style.background.slice(1);
const chip = chips.slots.default[0].slots.default[0];
const chipVisible = chip.config.visible.slice(1);
const chipText = chip.slots.default[0].slots.default[1].config.text.slice(1);
const rowsRepeater = card.slots.default[0].slots.default[1].slots.default[0].slots.default[0];
const cardIn = rowsRepeater.config.in.slice(1), cardFilter = rowsRepeater.config.filter;

let fails = 0;
const ok = (name, got, want) => { const pass = JSON.stringify(got) === JSON.stringify(want); if (!pass) fails++; console.log((pass ? 'PASS ' : 'FAIL ') + name + ' -> ' + JSON.stringify(got) + (pass ? '' : `  (wanted ${JSON.stringify(want)})`)); };
function env(nowIso, states) {
  const real = dayjs, NOW = real(nowIso), dj = (...a) => a.length ? real(...a) : NOW;
  const items = new Proxy({}, { get: (t, k) => ({ state: states[k] ?? 'UNDEF' }) });
  return { mk: (src) => { const f = new Function('dayjs', 'items', 'props', 'loop', 'return (' + src + ');'); return (props = {}, loop = {}) => f(dj, items, props, loop); } };
}
const day = (d) => dayjs(d).toISOString();          // openHAB REST delivers UTC "Z" strings
const P = (i) => ({ dateItem: i, color: '#0f766e' });
let e = env('2026-10-05T10:30:00+02:00', { A: day('2026-10-05T00:00:00+02:00'), B: day('2026-10-06T00:00:00+02:00'), C: day('2026-10-12T00:00:00+02:00'), D: 'UNDEF' });
let r = e.mk(rel);
ok('today', r(P('A')), 'Today'); ok('tomorrow', r(P('B')), 'Tomorrow'); ok('in 7 days', r(P('C')), 'in 7 days'); ok('UNDEF -> blank', r(P('D')), '');
ok('row tint only when today', [e.mk(rowBg)(P('A')).startsWith('color-mix'), e.mk(rowBg)(P('B'))], [true, 'transparent']);
e = env('2026-03-28T12:00:00+01:00', { A: day('2026-03-29T00:00:00+01:00'), B: day('2026-03-30T00:00:00+02:00') }); r = e.mk(rel);
ok('DST spring: 29 Mar is Tomorrow (23 h day)', r(P('A')), 'Tomorrow'); ok('DST spring: 30 Mar in 2 days', r(P('B')), 'in 2 days');
e = env('2026-10-24T12:00:00+02:00', { A: day('2026-10-25T00:00:00+02:00'), B: day('2026-10-26T00:00:00+01:00') }); r = e.mk(rel);
ok('DST autumn: 25 Oct is Tomorrow (25 h day)', r(P('A')), 'Tomorrow'); ok('DST autumn: 26 Oct in 2 days', r(P('B')), 'in 2 days');
const L = (i) => ({ u: { i, n: 'Organic', c: '#0f766e' } });
e = env('2026-10-05T10:30:00+02:00', { A: day('2026-10-05T00:00:00+02:00'), B: day('2026-10-06T00:00:00+02:00'), C: day('2026-10-07T00:00:00+02:00'), D: 'UNDEF' });
const vis = e.mk(chipVisible), txt = e.mk(chipText);
ok('chip today visible', vis({}, L('A')), true); ok('chip tomorrow visible', vis({}, L('B')), true);
ok('chip +2 hidden', vis({}, L('C')), false); ok('chip UNDEF hidden', vis({}, L('D')), false);
ok('chip text today', txt({}, L('A')), 'Organic · today'); ok('chip text tomorrow', txt({}, L('B')), 'Organic · tomorrow');
ok('card sorted by date, UNDEF last, maxItems=3',
  e.mk(cardIn)({ maxItems: 3 }, { u_source: [{ i: 'C', n: 'Paper' }, { i: 'D', n: 'Plastic' }, { i: 'A', n: 'Organic' }, { i: 'B', n: 'General' }] }).map(x => x.n), ['Organic', 'General', 'Paper']);
e = env('2026-10-19T10:00:00+02:00', { A: day('2026-10-05T00:00:00+02:00'), B: day('2026-10-19T00:00:00+02:00'), C: day('2026-10-20T00:00:00+02:00'), D: 'UNDEF' });
const f = e.mk(cardFilter), LL = (i) => ({ r: { i } });
ok('stale past date dropped', f({}, LL('A')), false); ok('today kept', f({}, LL('B')), true); ok('future kept', f({}, LL('C')), true); ok('UNDEF kept (shows —)', f({}, LL('D')), true);
console.log(fails ? `\n${fails} FAILED` : '\nall passed'); process.exit(fails ? 1 : 0);
