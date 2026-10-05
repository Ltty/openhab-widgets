// Parses every Main UI expression in widgets/*/widget.yaml and widgets/*/widgets.yaml (multi-widget `widgets:` map) with the SAME grammar Main UI uses (JSEP + arrow,
// object, ternary, regex, template plugins) and checks identifiers against the globals Main UI provides.
// Main UI expressions are NOT plain JavaScript: no statements, no block-bodied arrows, no const/let/;.
// Usage: node check-expressions.mjs [widgets/foo/widget.yaml ...]   (default: all widgets)
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
import YAML from 'yaml'; import jsep from 'jsep';
import arrow from '@jsep-plugin/arrow'; import object from '@jsep-plugin/object'; import ternary from '@jsep-plugin/ternary';
import regex from '@jsep-plugin/regex'; import template from '@jsep-plugin/template';
jsep.plugins.register(arrow, object, ternary, regex, template);

const SCOPE = new Set(['items', 'props', 'config', 'fn', 'const', 'vars', 'loop', 'Math', 'Number', 'theme', 'themeOptions',
  'device', 'screen', 'JSON', 'dayjs', 'user', 'translation', 't', 'true', 'false', 'null', 'undefined']);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'widgets');
const files = process.argv.length > 2 ? process.argv.slice(2)
  : fs.readdirSync(root).flatMap(d => {
      const dir = path.join(root, d);
      // a folder is either a widget (widget.yaml / widgets.yaml) or a group of widgets (e.g. widgets/atag/<widget>/)
      const dirs = fs.existsSync(path.join(dir, 'widget.yaml')) || fs.existsSync(path.join(dir, 'widgets.yaml')) ? [dir]
        : fs.readdirSync(dir, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => path.join(dir, e.name));
      return dirs.flatMap(x => ['widget.yaml', 'widgets.yaml'].map(n => path.join(x, n)));
    }).filter(f => fs.existsSync(f));

function collect(node, out) {
  if (Array.isArray(node)) return node.forEach(n => collect(n, out));
  if (node && typeof node === 'object') {
    // oh-repeater config: filter/map are expressions WITHOUT the '=' prefix (not to be confused with CSS `filter`)
    if ('for' in node && 'sourceType' in node) for (const k of ['filter', 'map']) if (typeof node[k] === 'string') out.push(node[k]);
    return Object.values(node).forEach(v => collect(v, out));
  }
  if (typeof node === 'string' && node.startsWith('=')) out.push(node.slice(1));
}
function freeIdentifiers(ast) {
  const free = new Set();
  (function walk(n, bound) {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(x => walk(x, bound));
    if (n.type === 'ArrowFunctionExpression') { const b = new Set(bound); (n.params || []).forEach(p => b.add(p.name)); return walk(n.body, b); }
    if (n.type === 'Identifier') { if (!bound.has(n.name)) free.add(n.name); return; }
    if (n.type === 'MemberExpression') { walk(n.object, bound); if (n.computed) walk(n.property, bound); return; }
    if (n.type === 'Property') { if (n.computed) walk(n.key, bound); walk(n.value, bound); return; }
    for (const k of Object.keys(n)) if (k !== 'type') walk(n[k], bound);
  })(ast, new Set());
  return free;
}
let bad = 0, total = 0, skipped = 0;
for (const f of files) {
  const exprs = [];
  try { collect(YAML.parse(fs.readFileSync(f, 'utf8')), exprs); }
  catch (err) {   // some older widgets use unquoted scalars OpenHAB's lenient parser accepts but strict YAML rejects
    console.log(`SKIP ${path.relative(root, f)}: not strict YAML (${String(err.message).split('\n')[0]})`); skipped++; continue;
  }
  for (const e of exprs) {
    total++;
    try {
      const unknown = [...freeIdentifiers(jsep(e))].filter(x => !SCOPE.has(x));
      if (unknown.length) { bad++; console.log(`${path.relative(root, f)}: unknown global ${unknown.join(',')} :: ${e.slice(0, 100)}`); }
    } catch (err) { bad++; console.log(`${path.relative(root, f)}: ${err.message} :: ${e.slice(0, 100)}`); }
  }
}
console.log(`checked ${total} expressions in ${files.length - skipped} widget(s), ${bad} problem(s), ${skipped} skipped`);
process.exit(bad ? 1 : 0);
