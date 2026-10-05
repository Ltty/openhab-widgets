# atag_schedule_card — ATAG ONE Weekly Schedule Editor

A weekly central-heating / hot-water schedule editor styled after the ATAG ONE app's schedule
screen — a 24 h timeline per day with editable temperature periods.

---

## Screenshot

![ATAG ONE Schedule Editor](screenshots/card.png)

## What it shows

- Tab pair: Central Heating / Domestic Hot Water
- Seven day rows, each a 24 h pill timeline. Color is a fixed threshold per tab — CH pills above
  18°C and DHW pills above 45°C are red, everything at or below is blue — not relative to the
  schedule's base temperature
- Any time of day not covered by an explicit period is filled in as a dimmed pill at the base
  temperature, so every day always reads as a complete 24 h picture instead of showing gaps. Tap a
  gap to add a new period prefilled to exactly that range
- A light hourly reference ruler runs across the top of the grid, and each pill's own boundary gets
  a time label directly below it, centered exactly on the point where the temperature changes
- Tap a pill to edit its start/end time and temperature, or remove it. Editing or adding a period
  that would overlap another one automatically trims/splits/drops the conflicting period — the
  schedule can never end up with two periods covering the same minute
- "+ Add period" per day (max 6, matching the ATAG ONE controller's own limit)
- Save writes only the changed periods via the binding's per-period Thing Actions, sequentially
  with a pause between writes (the device firmware requires ≥ 2 s between requests)
- Revert discards unsaved local edits

## Requirements — read this first

This widget reads two read-only JSON channels on the `atagone` binding — `heating#schedule` /
`hotwater#schedule`. If the linked items read `UNDEF` (a binding predating those channels), the
widget shows an explicit "waiting for binding update" state and Save stays disabled — this is
expected, not a bug. See `atag-binding-schedule-spec.md` in the `openhab-server` repo for the full
channel/action spec, including a follow-up (Section D) asking the binding to reject writes that
would create overlapping periods — this widget already prevents that client-side, but the binding's
write actions are directly callable over REST by anything else too.

---

## Quick start

### 1. Install the widget

1. Open **Developer Tools → Widgets** in the Main UI sidebar
2. Click **+** → **Code** tab
3. Paste the contents of [`widget.yaml`](widget.yaml)
4. Click **Save**

### 2. Deploy the companion HTML

Upload [`schedule.html`](schedule.html) to `$OPENHAB_CONF/html/atag/schedule.html` (served at
`/static/atag/schedule.html`).

### 3. Add to a page

Add a Custom Widget block, set type to `atag_schedule_card`, and set the **ATAG Thing** and the
two schedule-JSON item props.

---

## Props reference

| Prop | Required | Description |
|------|----------|-------------|
| `thingUID` | Yes | The `atagone:thermostat:...` Thing UID — used to call the per-period schedule Thing Actions |
| `chScheduleItem` | Yes | CH weekly schedule as JSON — `heating#schedule` |
| `dhwScheduleItem` | Yes | DHW weekly schedule as JSON — `hotwater#schedule` |

## Schedule JSON shape

```json
{
  "baseTemp": 22.5,
  "days": {
    "monday": [ { "start": 360, "end": 1260, "temp": 20.5 } ],
    "tuesday": [], "wednesday": [], "thursday": [], "friday": [], "saturday": [], "sunday": []
  }
}
```

`start`/`end` are minutes since midnight; array order within a day must match the binding's own
`periodIndex` order for `setChSchedulePeriod`/`clearChSchedulePeriod` — see the spec doc.

## Requirements

- OpenHAB 5.x (tested on 5.2.x)
- The `atagone` binding with `heating#schedule`/`hotwater#schedule` channels and the
  `setChSchedulePeriod`/`clearChSchedulePeriod`/`setDhwSchedulePeriod`/`clearDhwSchedulePeriod`
  Thing Actions

---

## Changelog

### Version 1.1.0

- The binding's `heating#schedule`/`hotwater#schedule` channels are now live — the editor renders
  real weekly data instead of the "waiting for binding update" state (still shown automatically on
  a binding that predates them)
- Pill color now uses a fixed threshold per tab (CH >18°C, DHW >45°C → red, else blue) instead of
  relative to the schedule's base temperature
- Uncovered time ranges are filled with the base temperature as a dimmed pill instead of showing a
  blank gap; tapping a gap opens a new period prefilled to that exact range
- Added a time label directly below each pill boundary (hidden when two would overlap) plus a
  light hourly reference ruler above the grid
- Editing or adding a period that overlaps another one now automatically trims, splits, or drops
  the conflicting period — schedules can no longer end up with overlapping ranges
- Fixed the period editor's +/− stepper buttons rendering off-center (missing flex centering)

### Version 1.0.0

- Initial release — builds against the pending schedule channels; shows a "waiting for binding
  update" state until they exist
