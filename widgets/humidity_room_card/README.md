# humidity_room_card — Per-Room Humidity & Temperature Card

A compact OpenHAB Main UI widget that shows a room's current humidity with a colour-coded status badge, a zone bar visualising the safe/elevated/critical thresholds, and the current temperature and setpoint.

---

## Screenshot

![Humidity Room Card](screenshots/card.png)

## What it shows

- Room icon + name + **OK / Elevated / Critical** badge (green / amber / red)
- Large humidity value, colour-coded by threshold
- CSS gradient zone bar with a live position indicator
- Three-row legend: Safe · Elevated · Critical with configurable ranges
- Current temperature and thermostat setpoint (optional)
- Optional heating-valve indicator in the header — a small icon (blue = any valve open, dim = all
  closed) with a count badge when more than one valve item is configured
- Tapping the card opens the Analyzer for the humidity, temperature, and valve items

---

## Quick start

### 1. Install the widget

1. Open **Developer Tools → Widgets** in the Main UI sidebar
2. Click **+** → **Code** tab
3. Paste the contents of [`widget.yaml`](widget.yaml)
4. Click **Save**

### 2. Add to a page

1. Edit a page → drag in a **Custom Widget** block
2. Set the widget type to `humidity_room_card`
3. Set the **Humidity Item** prop to your humidity item name
4. Optionally set a room name, icon, and threshold values

---

## Props reference

| Prop | Required | Default | Description |
|------|----------|---------|-------------|
| `item` | Yes | — | Humidity item (e.g. `FF_KidsRoom_Climate_Humidity`) |
| `tempItem` | No | — | Temperature item |
| `setpointItem` | No | — | Thermostat setpoint item |
| `title` | No | item label | Room display name |
| `icon` | No | `f7:house` | Icon name (e.g. `iconify:mdi:sofa`) |
| `compact` | No | `false` | Hides the Safe/Elevated/Critical legend rows — use when placing several cards per row |
| `min` | No | `40` | Safe zone lower bound (%) — the floor of the "Safe" label in the legend |
| `orange` | No | `60` | Elevated threshold — above this is amber (%) |
| `red` | No | `70` | Critical threshold — above this is red (%) |
| `valveItems` | No | — | Comma-separated heating actuator `_STATE` Switch item(s) for this room. Shows a header icon (blue when any is `ON`, dim otherwise) with a count badge when more than one is given |

---

## Requirements

- OpenHAB 5.x (tested on 5.2.x)
- A Number or Number:Dimensionless humidity item (0–100 % or 0–1 ratio both accepted)

---

## Changelog

### Version 1.2.0

- Added optional `compact` prop — hides the Safe/Elevated/Critical legend rows so cards can sit
  two-per-row on narrow (phone-width) layouts without the legend repeating for every card

### Version 1.1.1

- The v1.1.0 header alignment fix (below) turned out to be incomplete — Framework7's `.col` grid
  class was still fighting the `margin-left: auto` override in some cases. Fixed by pulling the
  badge/valve-icon/count-label out of their wrapping `f7-col` entirely (now plain row children,
  with `margin-left: auto` on the first) rather than trying to override `.col` from inside it

### Version 1.1.0

- Added optional `valveItems` prop — a small header icon (blue = any configured valve item is
  `ON`, dim = all closed) with a count badge when more than one item is given. States only
  whether the valve is open, deliberately — not whether the room is "heating" (a room can sit at a
  parked-open setpoint with the boiler off for most of the year, so that inference would be wrong
  most of the time)
- Fix: the header row now sets an explicit `width: 100%` — without it, the row shrink-wraps to its
  own content width instead of stretching to the card's full inner width, so the room-name column's
  `flex: "1"` has no free space to grow into and the trailing badge/valve group sits stranded
  mid-card instead of flush right. Badge and valve icon are now one merged flex group (was two
  separate columns) so they stay adjacent regardless of title length
- All six existing prop combinations render identically to v1.0.4 aside from the alignment fix —
  `valveItems` is additive and optional

### Version 1.0.4

- Fix: zone bar still not rendering when `orange`/`red` props were undefined on existing widget instances — gradient expression now uses `(props.orange||60)` / `(props.red||70)` defensive defaults so the CSS is always valid
- Fix: YAML parse error in `setpointItem` description (`: ` inside an unquoted scalar misread as a YAML mapping separator) — description now single-quoted
- Use `text: " "` (non-breaking space) on the zone bar Label to prevent silent suppression in OH releases that skip empty-text Labels

### Version 1.0.3

- Fixed `min` prop label: "Safe max (%)" → "Safe Min (%)" — it is the lower bound of the safe zone, not the upper
- Added descriptions to Humidity Item, Temperature Item, and Setpoint Item props

### Version 1.0.2

- Fix: zone bar not rendering in some Main UI versions — replaced empty `Label` with `f7-block` (empty-text Labels are silently suppressed in certain OH releases)
- Improvement: props reorganised into Sensor Items / Appearance / Thresholds groups; threshold labels clarified (Safe max / Elevated max / Critical from)

### Version 1.0.1

- Explicit `tempItem` and `setpointItem` props — no more implicit `_Humidity` → `_ActualTemperature` name derivation
- Props grouped under "Sensor Items" (humidity first, then temperature, setpoint) at the top of the settings panel
- Humidity normalisation: accepts both 0–100 % and 0–1 dimensionless ratio sensors
- Bar indicator position uses `parseFloat(state)` instead of `numericState` for consistent behaviour across item types

### Version 1.0.0

- Initial release
