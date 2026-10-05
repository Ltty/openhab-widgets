# atag_diagnostics_card — ATAG ONE Boiler Diagnostics

Read-only boiler diagnostics, matching the ATAG ONE app's Information → Diagnosis screen, as a
single list in the shared design style.

---

## Screenshot

![ATAG ONE Diagnostics](screenshots/card.png)

## What it shows

One rounded card (18 px radius) per section with a 12 px bold section title above it, like the Regulation dialog (no accordion — this card only ever appears inside a popup): **Status** (flame), **Alerts** (device/boiler errors), **Central Heating**
(water pressure, modulation level, boiler flow/return temperature, delta temperature, time to
target, average outside temperature, weather status), **Hot Water** (DHW setpoint, DHW water
temperature), **Device** (serial number, device ID, firmware version, burning hours, PCB
temperature, voltage, WiFi signal, controller resets, last report).

All rows are `oh-label-item` — display only, nothing here writes to the device.

## Quick start

### 1. Install the widget

1. Open **Developer Tools → Widgets** in the Main UI sidebar
2. Click **+** → **Code** tab
3. Paste the contents of [`widget.yaml`](widget.yaml)
4. Click **Save**

### 2. Add to a page

Add a Custom Widget block, set type to `atag_diagnostics_card`, and set the item props for the
channels you want to expose.

---

## Props reference

All props are optional item pickers, one per diagnostic channel — see `widget.yaml` for the full
list; each prop's description names the exact `atagone` channel it targets.

## Requirements

- OpenHAB 5.x (tested on 5.2.x)
- The `atagone` binding

---

## Changelog

### Version 2.1.0

- Restyled to the shared design system: one 18 px card per section with a plain section title above it instead of a single card with uppercase letter-spaced headers; the "Diagnostics" title moved into the dialog's navbar; the read-only note is a small line under the cards. Same rows and props

### Version 2.0.0 (BREAKING)

- Binding update removed 5 channels this widget exposed — `minModulationLevelItem`,
  `burnerTargetItem`, `maxBoilerTempItem`, `regulationStateItem`, `memoryAllocationItem` are gone;
  remove them from any existing widget instance's config
- Added `dhwSetpointItem` / `dhwWaterTempItem` (hot water setpoint and current temperature) as a
  new Hot Water section
- Footer text changed from a confusing reference to the ATAG app's own menu path to a plain
  "All values are read-only, reported directly by the boiler."

### Version 1.0.0

- Initial release
