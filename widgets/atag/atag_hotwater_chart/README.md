# atag_hotwater_chart — Domestic Hot Water Temperature Chart

A daily time-series chart for the ATAG ONE domestic hot water circuit: target vs. current water
temperature, plus a shaded "Heating" overlay showing when the burner was actively heating water.

## What it shows

- **Target** (dashed) — the setpoint, step-plotted since it genuinely changes in discrete jumps
- **Water** — current hot water temperature
- **Heating** — a translucent red band across the bottom showing when domestic hot water was
  actively heating

Both temperature series use the `rrd4j` persistence service and no artificial smoothing,
deliberately — the data reflects the ATAG device's real reporting resolution, not a cosmetic
curve fit.

## Quick start

### 1. Install the widget

1. Open **Developer Tools → Widgets** in the Main UI sidebar
2. Click **+** → **Code** tab
3. Paste the contents of [`widget.yaml`](widget.yaml)
4. Click **Save**

### 2. Add to a page

1. Edit a page → drag in a **Custom Widget** block
2. Set the widget type to `atag_hotwater_chart`
3. Set all 3 item props to the matching `atagone:thermostat` channel items

## Props reference

| Prop | Required | Default | Description |
|------|----------|---------|-------------|
| `targetTempItem` | Yes | — | Setpoint hot water temperature — `hotwater#target-temperature` |
| `waterTempItem` | Yes | — | Current hot water temperature — `hotwater#temperature` |
| `statusItem` | Yes | — | Domestic hot water active Switch — `hotwater#status` |
| `title` | No | `Domestic Hot Water` | Chart title |
| `height` | No | `340` | Chart height in pixels |

---

## Requirements

- OpenHAB 5.x
- `atagone` binding, `hotwater#*` channels linked to items
- `rrd4j` persistence enabled for all 3 items (default persistence config covers this house's `*`)

---

## Changelog

### Version 1.0.0

- Extracted from a raw inline `oh-chart` block on the Indoor page (`page_d0ed112f1a`) into a
  reusable custom widget, so the same chart definition can be embedded by reference on any page
  instead of copy-pasted. Series config carried over verbatim (colors, names, `rrd4j` service,
  no smoothing) — this is a packaging change only, not a visual or behavioral change.
