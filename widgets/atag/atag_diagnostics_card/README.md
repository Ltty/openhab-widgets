# atag_diagnostics_card — ATAG ONE Boiler Diagnostics

Read-only boiler diagnostics, matching the ATAG ONE app's Information → Diagnosis screen, as a
single accordion card.

---

## Screenshot

![ATAG ONE Diagnostics](screenshots/card.png)

## What it shows

A single flat list (no accordion — this card only ever appears inside a popup, and collapsing a
single section inside something already one tap deep just adds a redundant click), grouped under
plain section headers: **Status** (flame), **Alerts** (device/boiler errors), **Central Heating**
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
