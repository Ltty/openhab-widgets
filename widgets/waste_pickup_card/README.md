# waste_pickup_card — Waste Collection Card (replaces `garbage_list_v1`)

A modern, group-driven waste collection card for the OpenHAB Main UI. One configuration prop (a group), no item
names in the page config, rows sorted by date with relative days, and today's pickup highlighted in the bin's colour.

Part of a small family built on one data contract:

| Widget (UID) | Purpose |
|---|---|
| `waste_pickup_card` | this card — full list of the next pickups (page card) |
| `waste_pickup_row` | one shared row (icon badge, name, date, Today / Tomorrow / in N days) |
| `waste_pickup_chips` | alert chips (bin due today / tomorrow); tapping opens the schedule sheet |
| `waste_pickup_schedule` | bottom sheet "Next pickups" (opened by the chips) |

One logical widget, four definitions, all in [`widgets.yaml`](widgets.yaml) (openHAB's multi-widget `widgets:` map format; each key is the widget UID). In the widget editor create one widget per key (UID = key) and paste that entry's body. The card
needs `row`; the chips need `schedule` (which needs `row`).

## What it shows
- One row per bin: coloured icon badge · bin name · `Mon 12 Oct` · **Today** / **Tomorrow** / `in 7 days`
- Rows sorted by date (soonest first; invalid/UNDEF dates last and shown as `—`; past dates hidden)
- Today's row tinted in the bin colour; today/tomorrow relative text in the bin colour
- Dark-mode safe (uses `color-mix` on card colours)

## Props
| Prop | Default | Description |
|---|---|---|
| `pickupsGroup` | `gWastePickups` | Group whose members are one DateTime item (or DateTime group) per bin |
| `title` | `Waste collection` | Card title |
| `maxItems` | `4` | Show only the next N pickups |

## Data contract (the important part)
Each member of `pickupsGroup` is one bin:
- **State** = the *effective next pickup* (DateTime). It must be **today** while today's pickup is running.
- **Label** = display name (a trailing " Waste" is stripped).
- **Metadata `binColor`** (optional) = hex colour, e.g. `#2563eb`; missing → grey.

### Why not just the iCalendar `next_start` channel?
The iCalendar binding separates the *current* event (`current_*`) from the *next* event (`next_*`). As soon as
today's pickup starts, `next_start` jumps to the **following** pickup, so "today" is invisible if you only link
`next_start`. The old widget worked around that with a second group of `current_presence` switches joined by label.

Here the join is done by the core, with no script: per bin, a `Group:DateTime:EARLIEST` contains both the
`current_start` item and the `next_start` item. `EARLIEST` ignores NULL/UNDEF, so the group equals today's date while
a pickup is running and the next pickup otherwise. Per bin, in your own model:

| Object | Type | Link / membership | Notes |
|---|---|---|---|
| bin group | `Group:DateTime:EARLIEST` | member of `pickupsGroup` | label = bin name; metadata `binColor` = hex colour |
| current item | `DateTime` | channel `icalendar:calendar:<id>:current_start`, member of the bin group | UNDEF when no event is running |
| next item | `DateTime` | channel `…:next_start`, member of the bin group | an existing next-pickup item can simply join the bin group |

> A newly created group starts as NULL and only recalculates when a member changes. Seed it once
> (`group.postUpdate(<earliest valid member>)`), or wait for the next calendar change (midnight).

## Adding a bin
1. Add the calendar Thing; link `next_start` and `current_start` to two DateTime items.
2. Create `Group:DateTime:EARLIEST` `Waste_<Bin>_Pickup` (label `"<Bin> Waste"`) in `gWastePickups`, put both items in it.
3. Set metadata `binColor`. All four widgets pick it up on the next page load — nothing to edit in the widgets.

## Migration from `garbage_list_v1`
Replace the block with `widget:waste_pickup_card` (no config needed with the defaults). Drop the `datearray`,
`footer`, `dates`, `today` and `tomorrow` props. `garbage_list_v1` itself is untouched and can stay installed.

## Tests
`node scripts/test-waste-logic.mjs` — fixture tests of the date logic using the real expressions from the YAML
(today/tomorrow/+N, DST 2026-03-29 and 2026-10-25, UNDEF, sort order, stale-date filter).
`node scripts/check-expressions.mjs` — parses every expression with the same parser Main UI uses.

## Changelog
### Version 1.0.0

- Initial release (replaces `garbage_list_v1`): group-driven, DST-safe, sorted, relative dates, metadata colours.
