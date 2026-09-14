# atag_regulation_card — ATAG ONE Regulation Settings

The ATAG ONE's "Regulation" settings screen — central heating, weather-dependent control, hot
water, and display — as a four-section accordion card.

---

## Screenshot

![ATAG ONE Regulation](screenshots/card.png)

## What it shows

Four always-visible sections (flat, not collapsible — this card only ever appears inside a popup,
so a second layer of expand/collapse on top of that would just be redundant clicking):

- **Central Heating** — operating mode (tap to switch thermostat ↔ weather-dependent), schedule
  base temperature, vacation temperature, and the vacation/extend duration defaults shown
  read-only, converted to days/minutes (see Gotchas below — editing these two isn't supported by
  the native stepper component; use the duration picker on the main control face instead)
- **Weather Dependent** — heating type, insulation, building size, room influence, climate zone,
  max preheat, summer eco mode/temperature, frost protection (mode + room/outside thresholds).
  Visually dimmed and non-interactive while Central Heating's operating mode is `thermostat`
  (these settings are ignored by the device in that mode)
- **Hot Water** — DHW base temperature, legionella protection (on/off, day, time)
- **Display** — brightness, time zone

Every enum setting (Operating Mode, Heating Type, Insulation, Building Size, Room Influence, Max
Preheat, Frost Protection, Legionella Day, Time Zone) is tappable — `action: "options"` opens the
native selection sheet. A plain `oh-list-item` bound only via `item:` shows nothing and does
nothing (see Gotchas).

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

**Unit note**: `vacationDurationDefaultItem` and `extendDurationDefaultItem` are shown **read-only**
(`oh-label-item`), converted client-side from the item's raw seconds to days/minutes. `oh-stepper-item`
reads and writes the item's raw base-unit value directly — it does not apply `unit` metadata for
display or conversion (confirmed: setting `unit` metadata on these items changed nothing), so a
stepper meant to read "7 days" would actually show and step in raw seconds ("604800"). Editing
these two defaults isn't supported here; use the Vacation/Extend duration picker on
`atag_one_card`'s main control face instead, which does its own day/minute math in JS.
`displayBrightnessItem` steps 0.1–1.0 (a fraction, matching its actual reported scale), not
10–100 as its channel's own `%`-pattern implies.

## Requirements

- OpenHAB 5.x (tested on 5.2.x)
- The `atagone` binding

## Gotchas

- **`oh-list-item` bound via `item:` alone renders nothing and does nothing** — no value shown, no
  tap affordance, confirmed via live DOM inspection (a plain `<div>`, not even an `<a>`). Add
  `action: "options"` to get the standard tap-to-open-a-selection-sheet behavior for a String item
  with enum options; the row then renders as an `<a class="item-link">` with a `›` chevron and
  opens a native picker on tap. This isn't documented in `describe_widget('oh-list-item')`'s prop
  list (which only covers title/subtitle/icon/badge/listButton) — `action` is accepted anyway as
  an "extra" config key per the component's own action-grammar support.
- **A flex row needs an explicit `width: 100%` inside a card-content column, or it shrink-wraps**
  — without it, `flex: "1"` on a child has no free space to grow into, so trailing content sits
  stranded mid-row instead of flush right. See `humidity_room_card`'s header row for the same fix.

---

## Changelog

### Version 1.0.0

- Initial release
