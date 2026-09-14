# atag_one_card — ATAG ONE Thermostat Control Face

A pixel-styled recreation of the official ATAG ONE app/portal control screen — the current and
target room temperature, blue/red steppers, mode selector, and an in-frame duration picker for
Vacation/Extend/Fireplace. Always dark, matching the real device.

---

## Screenshot

![ATAG ONE Control Face](screenshots/card.png)

## What it shows

- Large current-room-temperature readout, with a flame indicator dot top-right
- Target temperature with blue (lower) / red (raise) steppers, debounced to one write per pause
- Bottom bar: mode-change chevron, next scheduled time + temperature (**Automatic mode only** — the
  other modes collapse to a 2-cell Change + Mode bar, since "next scheduled change" doesn't apply
  outside Automatic)
- Tapping the mode cell opens a 5-mode picker (Automatic / Vacation / Extend / Fireplace / Manual)
- Vacation / Extend / Fireplace each open a duration picker (days / 15-min steps / hours) before
  activating, calling the binding's Thing Actions directly
- Cancel button for any active timed mode — surfaces the binding's "requires physical confirmation"
  result rather than reporting a false success (fireplace mode cannot be cancelled remotely; a
  button press on the thermostat is required)

## Quick start

### 1. Install the widget

1. Open **Developer Tools → Widgets** in the Main UI sidebar
2. Click **+** → **Code** tab
3. Paste the contents of [`widget.yaml`](widget.yaml)
4. Click **Save**

### 2. Deploy the companion HTML

Upload [`control.html`](control.html) to `$OPENHAB_CONF/html/atag/control.html` (served at
`/static/atag/control.html`).

### 3. Add to a page

Add a Custom Widget block, set type to `atag_one_card`, and set the **ATAG Thing** prop plus the
item props for the channels you want live.

---

## Props reference

| Prop | Required | Description |
|------|----------|-------------|
| `thingUID` | Yes | The `atagone:thermostat:...` Thing UID — used to resolve and call its Thing Actions |
| `currentTempItem` | Yes | Room (current) temperature — `heating#room-temperature` |
| `targetTempItem` | Yes | Target temperature setpoint — `heating#target-temperature` (writable) |
| `modeItem` | Yes | Preset mode string — `control#preset-mode` |
| `flameItem` | No | Flame indicator — `heating#flame` |
| `chActiveItem` | No | Central heating active — `heating#central-heating-active` (reserved) |
| `nextTimeItem` | No | Next scheduled time — `control#next-schedule-time` |
| `nextTempItem` | No | Next scheduled temperature — `control#next-schedule-temperature` |
| `vacationDurationItem` | No | Seeds the vacation duration picker's default |
| `vacationTempItem` | No | Reserved for future use |
| `vacationRemainingItem` | No | Reserved for future use |
| `extendDurationItem` | No | Seeds the extend duration picker's default |
| `extendRemainingItem` | No | Reserved for future use |
| `fireplaceDurationItem` | No | Seeds the fireplace duration picker's default |
| `fireplaceRemainingItem` | No | Reserved for future use |

## Requirements

- OpenHAB 5.x (tested on 5.2.x)
- The `atagone` binding with a `thermostat` Thing exposing the channels above and the
  `activateVacation` / `activateExtend` / `activateFireplace` / `cancelMode` Thing Actions

## Gotchas

- The widget-config `=` expression sandbox is missing `encodeURIComponent` — the `src` builder
  concatenates prop values raw rather than URL-encoding them. Safe here since item/Thing names
  contain no query-string-reserved characters; don't copy this pattern for values that might.
- Bump `?v=N` in the `src` expression whenever `control.html` changes — browsers cache the file.

---

## Changelog

### Version 1.0.0

- Initial release
