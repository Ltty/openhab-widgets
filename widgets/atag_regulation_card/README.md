# atag_regulation_card — ATAG ONE Regulation Settings

The ATAG ONE's "Regulation" settings screen — central heating, weather-dependent control, hot
water, and display — as a four-section accordion card.

---

## Screenshot

![ATAG ONE Regulation](screenshots/card.png)

## What it shows

Four accordion sections:

- **Central Heating** — operating mode, schedule base temperature, vacation temperature,
  vacation/extend duration defaults
- **Weather Dependent** — heating type, insulation, building size, room influence, climate zone,
  max preheat, summer eco mode/temperature, frost protection (mode + room/outside thresholds).
  Visually dimmed and non-interactive while Central Heating's operating mode is `thermostat`
  (these settings are ignored by the device in that mode)
- **Hot Water** — DHW base temperature, legionella protection (on/off, day, time)
- **Display** — brightness, time zone

## Quick start

### 1. Install the widget

1. Open **Developer Tools → Widgets** in the Main UI sidebar
2. Click **+** → **Code** tab
3. Paste the contents of [`widget.yaml`](widget.yaml)
4. Click **Save**

### 2. Add to a page

Add a Custom Widget block, set type to `atag_regulation_card`, and set the item props for the
channels you want to expose.

---

## Props reference

All props are optional item pickers except `controlModeItem`, grouped in the editor as Central
Heating / Weather Dependent / Hot Water / Display. See `widget.yaml` for the full list — each
prop's description names the exact `atagone` channel it targets.

**DHW note**: use `dhwScheduleBaseTempItem` (→ `hotwater#schedule-base-temperature`) for the hot
water setpoint, not the binding's `hotwater#target-temperature` channel — that channel is
derived/read-only on the device side and a known broken write path (see the `atagone` binding's
own test notes).

**Unit note**: `vacationDurationDefaultItem` and `extendDurationDefaultItem` display and step in
raw seconds (the channel's declared display unit doesn't match its actual reported value scale) —
labelled accordingly ("s — steps of 1 day" / "s — steps of 15 min"). `displayBrightnessItem`
steps 0.1–1.0 (a fraction), not 10–100, for the same reason.

## Requirements

- OpenHAB 5.x (tested on 5.2.x)
- The `atagone` binding

---

## Changelog

### Version 1.0.0

- Initial release
