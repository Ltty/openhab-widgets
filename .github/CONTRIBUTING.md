# Contributing

Contributions are welcome — bug fixes, new widgets, and documentation improvements alike.

## Adding a new widget

1. Create `widgets/<widget-name>/` with at least `widget.yaml` and `README.md`
2. `widget.yaml` should be a clean export without server-specific UIDs or item names
3. `README.md` should cover: what it shows, required items, props table, OH version
4. Add a row to the top-level `README.md` widget table
5. Open a pull request

## Widget YAML guidelines

- Remove `timestamp`, `editable`, and any other server-generated metadata fields
- Replace all installation-specific item names with descriptive placeholders in comments
- Keep all props `required: false` except the minimum needed to render the core card
- Add `description` to every prop so users understand what to bind

## Pull requests

- One widget (or one fix) per PR
- Test the widget in a real OpenHAB instance before submitting
- Screenshots are appreciated but not required
