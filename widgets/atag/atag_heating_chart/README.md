# atag_heating_chart — Central Heating Temperature Chart

A daily time-series chart for the ATAG ONE central heating circuit: target vs. room vs. outside
temperature, a rolling multi-day outside average, the summer eco-mode threshold, and a shaded
"Heating" overlay showing when the burner was actively heating.

## What it shows

- **Target** (dashed) — the setpoint, step-plotted since it genuinely changes in discrete jumps
- **Room** — current room temperature, sourced from the boiler's own sensor
- **Outside** — outdoor temperature per the boiler's local sensor
- **Average** — the boiler's multi-day rolling average outside temperature (weather-compensation
  input, not a substitute for Outside on this daily chart — it moves far too slowly)
- **Eco Threshold** (dashed) — the configured summer eco-mode temperature
- **Heating** — a translucent red band across the bottom showing when central heating was active

All series use the `rrd4j` persistence service and no artificial smoothing, deliberately — the
data reflects the ATAG device's real reporting resolution, not a cosmetic curve fit.

## Quick start

### 1. Install the widget

1. Open **Developer Tools → Widgets** in the Main UI sidebar
2. Click **+** → **Code** tab
3. Paste the contents of [`widget.yaml`](widget.yaml)
4. Click **Save**

### 2. Add to a page

1. Edit a page → drag in a **Custom Widget** block
2. Set the widget type to `atag_heating_chart`
3. Set all 6 item props to the matching `atagone:thermostat` channel items

## Props reference

| Prop | Required | Default | Description |
|------|----------|---------|-------------|
| `targetTempItem` | Yes | — | Setpoint temperature — `heating#target-temperature` |
| `outsideTempItem` | Yes | — | Outdoor temperature — `heating#outside-temperature` |
| `roomTempItem` | Yes | — | Room temperature — `heating#room-temperature` |
| `statusItem` | Yes | — | Central heating active Switch — `heating#central-heating-active` |
| `averageOutsideTempItem` | Yes | — | Rolling average outdoor temp — `heating#average-outside-temperature` |
| `ecoThresholdItem` | Yes | — | Summer eco threshold — `heating#summer-eco-temperature` |
| `title` | No | `Central Heating` | Chart title |
| `height` | No | `340` | Chart height in pixels |

---

## Requirements

- OpenHAB 5.x
- `atagone` binding, `heating#*` channels linked to items
- `rrd4j` persistence enabled for all 6 items (default persistence config covers this house's `*`)

---

## Changelog

### Version 1.0.0

- Extracted from a raw inline `oh-chart` block on the Indoor page (`page_d0ed112f1a`) into a
  reusable custom widget, so the same chart definition can be embedded by reference on any page
  instead of copy-pasted. Series config carried over verbatim (colors, names, `rrd4j` service,
  no smoothing) — this is a packaging change only, not a visual or behavioral change.
