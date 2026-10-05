# atag_regulation_card — ATAG ONE Regulation Settings

The ATAG ONE's "Regulation" settings screen — central heating, weather-dependent control, hot
water and display — as a dialog with **staged edits and a Save button**. Opened as a popup from a
`nav_tile`; the HTML companion follows the shared design system (section cards, theme colours and
font read from the Main UI, ATAG blue `#1472b9`).

---

## Screenshot

![ATAG ONE Regulation](screenshots/card.png)

## What it shows

Three sections, each a rounded card with a plain title above it:

- **General** — season, display brightness (10–100 %), time zone
- **Central Heating** — operating mode (thermostat / weather-dependent), schedule base and vacation
  temperature, summer eco mode and temperature, frost protection (mode, room / outside threshold).
  The weather-dependent rows (heating type, insulation, building size, room influence, climate zone,
  max preheat) are hidden while the operating mode is `thermostat`, because the device ignores them
  then. **Summer Eco Mode/Temperature are shown regardless of operating mode** — in `thermostat`
  mode the device itself ignores them, but the openHAB rule `Toggle Heating Season` reads them to
  drive the seasonal heating on/off switch instead
- **Hot Water** — DHW base temperature, legionella protection (on/off, day, time as `HH:mm`)

Edits are only staged locally; **Save** sends the changed items one by one (400 ms apart), waits out
one binding poll (~70 s), re-reads and retries once what did not stick — the ATAG drops requests
silently. Leaving the dialog with Back discards unsaved edits (there is no Cancel button). Do not
close the dialog while it reads "Sending…" or "confirming…". The frame stretches to the bottom of the
dialog, so the Save bar sits at the very bottom and only the list scrolls.

## Quick start

### 1. Install the widget

1. Open **Developer Tools → Widgets** in the Main UI sidebar
2. Click **+** → **Code** tab
3. Paste the contents of [`widget.yaml`](widget.yaml)
4. Click **Save**

### 2. Deploy the companion HTML

Upload [`regulation.html`](regulation.html) to `$OPENHAB_CONF/html/atag/regulation.html` (served at
`/static/atag/regulation.html`). Bump `?v=N` in the widget's `src` expression whenever the file
changes — browsers cache it.

### 3. Add to a page

Add a Custom Widget block, set type to `atag_regulation_card`, and set the item props for the
channels you want to expose. Typical use: `nav_tile` with `action: popup`, `modal: widget:atag_regulation_card`
and the item props in `modalConfig`.

---

## Props reference

All props are optional item pickers except `controlModeItem`, grouped in the editor as Central
Heating / Weather Dependent / Hot Water / Display. See `widget.yaml` for the full list — each
prop's description names the exact `atagone` channel it targets.

**DHW note**: use `dhwScheduleBaseTempItem` (→ `hotwater#schedule-base-temperature`) for the hot
water setpoint, not the binding's `hotwater#target-temperature` channel — that channel is
derived/read-only on the device side and a known broken write path (see the `atagone` binding's
own test notes).

**`displayBrightnessItem` note**: a `Number:Dimensionless` fraction (0.3 = 30 %); the dialog shows and
steps it in percent and sends the fraction.

**`legionellaProtectionTimeItem` note**: a plain `String` item in `HH:mm` format (e.g. `07:00`).
The dialog validates the format and rejects an edit that doesn't match before it is staged.

## Requirements

- OpenHAB 5.x (tested on 5.2.x)
- The `atagone` binding

## Gotchas

- The bar buttons are `div`s: enable / disable them through the `disabled` **attribute** (the `[disabled]`
  style keys off it), not the DOM property.
- The frame resizes itself to its popup (`frameElement`) and reads colours and font from the parent
  Main UI, so it must be served from the same origin (`/static/…`).

---

## Changelog

### Version 2.3.2

- Removed the Revert / Cancel button: the dialog's Back button already discards unsaved edits, so Save is the only action in the bar. Do not close the dialog while it reads "Sending…" or "confirming…" — the pending changes would not be sent or retried

### Version 2.3.1

- Fixed: Cancel / Save never enabled after an edit (the bar buttons are `div`s, so setting `disabled` as a property left the `disabled` attribute and its style in place); they now enable on the first change
- Accent colour is ATAG's portal blue `#1472b9`

### Version 2.3.0

- Restyled to the shared design system: section cards (18 px radius), the page, card and text colours and the font are read from the Main UI the frame sits in, so light and dark follow the app; Revert is now **Cancel**
- The frame stretches to the bottom of the dialog (popup on desktop, full screen on phones), so the Cancel / Save bar sits at the very bottom and only the list scrolls
- Staged edits with Save / Cancel, the 400 ms write spacing and the confirm-and-retry stay: a native rebuild (immediate writes per control) was tried and rejected, because the ATAG drops requests and a half-sent set of changes is worse than a clear Save step

### Version 2.2.0

- Save now confirms every changed field against the device instead of trusting the write's own
  HTTP response — the ATAG's embedded HTTP server is known to drop requests silently (see the
  `atagone` binding's own test notes), so a value could look saved and then quietly revert once
  the next poll read back the device's unchanged old value. Save now waits out one
  `refreshInterval` poll (~70s) after sending, re-reads, and retries once if a field didn't stick;
  the status line reports "Confirmed" / "…retrying…" / which fields the ATAG rejected, instead of
  an immediate "Saved" that could be wrong

### Version 2.1.0

- Summer Eco Mode/Temperature are now shown regardless of Operating Mode, not just in
  `weather-dependent` — in `thermostat` mode the openHAB rule `Toggle Heating Season` reads these
  two items itself to drive the seasonal heating on/off switch
- Summer Eco Mode row gets a sub-label explaining who applies it in thermostat mode

### Version 2.0.0 (BREAKING)

- Binding update removed the `control#vacation-duration-default` / `control#extend-duration-default`
  channels — `vacationDurationDefaultItem` and `extendDurationDefaultItem` props are gone; remove
  them from any existing widget instance's config. Set these defaults via the Vacation/Extend
  duration picker on `atag_one_card`'s main control face instead
- `legionellaProtectionTimeItem`'s channel changed from `Number:Time` (raw seconds) to a plain
  `String` in `HH:mm` format — the field is now a simple validated text input instead of doing
  seconds↔HH:mm conversion in JS

### Version 1.0.0

- Initial release
