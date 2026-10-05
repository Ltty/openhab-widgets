# Contributing

Contributions are welcome — bug fixes, new widgets, and documentation improvements alike.

## Adding a new widget

1. Create `widgets/<widget-name>/` with `widget.yaml` (or `widgets.yaml` for a family) and `README.md`
2. `README.md` should cover: what it shows, a screenshot, the item contract per prop (type, binding channel, meaning),
   props table, requirements, changelog (`### Version X.Y.Z`, newest first)
3. Add a row to the top-level `README.md` widget table
4. Run `node scripts/check-expressions.mjs` (after `npm install` in `scripts/`) — it must report 0 problems
5. Open a pull request

## Widget YAML guidelines

- Widgets never ship `.items` files or item names in code: every item is a prop
- Prop defaults may name the author's items; every prop needs a `description`, a `label` and a `parameterGroups` group
- Keep props `required: false` except the minimum needed to render the core card
- Optional or looping content goes through `oh-repeater` (not `visible`) so the page editor stays clean
- Expressions use the Main UI grammar (JSEP): expression-bodied arrows only, no `const`, no statements
- The `timestamp` field mirrors the live widget and may stay; `editable` and other server fields should not

## Screenshots

Capture the live card at 390 px width (2x). Never include real camera images or personal data.

## Pull requests

- One widget (or one fix) per PR
- Test the widget in a real OpenHAB instance before submitting
