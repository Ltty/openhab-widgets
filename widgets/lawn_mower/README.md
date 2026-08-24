# lawn_mower — Husqvarna Automower Status Card

A custom OpenHAB Main UI widget that shows your Husqvarna Automower's real-time status, GPS track map, weather guard indicators, and a manual pause button — all in one card.

> **Husqvarna Automower only.** This widget relies on activity strings (`MOWING`, `LEAVING`), error codes (0–12, 110), and Thing actions (`parkUntilFurtherNotice()` / `resumeSchedule()`) that are specific to the [Husqvarna Automower binding](https://www.openhab.org/addons/bindings/automower/). It does not support other smart lawn mowers.

---

## Screenshots

> Add screenshots to `widgets/lawn_mower/screenshots/` and update these links.

| Collapsed | GPS map open |
|-----------|-------------|
| ![Card](screenshots/card.png) | ![Map](screenshots/map.png) |

## What it shows

The card shows:
- Activity badge (green = mowing/leaving, grey = idle/parked, red = error)
- Error code expanded to a human-readable message
- Battery level (tap opens the Analyzer)
- Last-update timestamp
- Manual pause toggle (optional)
- Collapsible GPS track map (optional — requires companion HTML file)
- Weather guard icon strip (optional — shows active/inactive guards)

---

## Tier 1 — Basic Setup

Paste the widget, wire five items from your automower binding channels, done.

### 1. Install the widget

1. Open **Developer Tools → Widgets** in the Main UI sidebar
2. Click **+** → **Code** tab
3. Paste the contents of [`widget.yaml`](widget.yaml)
4. Click **Save**

### 2. Wire binding channels

In **Settings → Things**, open your automower thing. Copy the Thing UID (e.g. `automower:automower:abc123:am415x`). Create these items linked to the corresponding channels:

| Item type | Channel | Widget prop |
|-----------|---------|-------------|
| `String` | `status#activity` | `automowerActivity` |
| `String` | `status#state` | `automowerStatus` |
| `Number` | `status#error-code` | `automowerErrorCode` |
| `Number` | `status#battery` | `automowerBatteryLevel` |
| `DateTime` | `status#last-update` | `automowerLastUpdate` |

See [`items/automower.items`](items/automower.items) for a ready-to-paste `.items` file.

### 3. Add the widget to a page

1. Edit a page → drag in a **Custom Widget** block
2. Set the widget type to `lawn_mower`
3. Fill in the five required props with your item names

That's it. The card shows live status with error decoding.

### Optional: GPS track map

The collapsible map accordion requires a companion HTML file served by OpenHAB's built-in web server.

1. Copy [`automower-map.html`](automower-map.html) to `/etc/openhab/html/automower-map.html`
2. Create a `Location` item linked to `status#position`
3. Set the widget's **Automower Position** prop to that item name
4. Set the widget's **Persistence Service** prop to your persistence service ID (e.g. `influxdb`)

> **Important:** The GPS track history requires a persistence service that supports the OpenHAB `Location` item type. RRD4J (the OpenHAB default) only stores numeric types and cannot store Location items — the map will show no track history. Use InfluxDB or another service that persists Location items and configure its service ID in the **Persistence Service** prop.

The map live-polls the mower's current position every 30 seconds regardless of persistence, so the current position marker always works. Only the today's track history requires persistence.

### Optional: control buttons (Home / Start / Pause)

Wire the control action props to unlock three buttons in the card:

- **Home** (blue) — opens a park menu: 30 min, 3 hr, 24 hr, until next schedule, or until further notice
- **Pause** (orange) — visible only when the mower is mowing or leaving; sends pause command
- **Start** (green) — visible when the mower is idle; resumes the mowing schedule

Create these items and wire them to the widget's **Control Actions** props:

| Item | Channel | Widget prop |
|------|---------|-------------|
| `Number Automower_Park` | `command#park` | Park (Timed) Item |
| `Switch Automower_ParkNextSchedule` | `command#park-until-next-schedule` | Park Until Next Schedule Item |
| `Switch Automower_ParkFurtherNotice` | `command#park-until-further-notice` | Park Until Further Notice Item |
| `Switch Automower_Resume` | `command#resume-schedule` | Resume Schedule Item |

Optionally also wire:

| Item | Channel | Widget prop |
|------|---------|-------------|
| `String Automower_WorkAreaName` | `status#work-area` | Work Area Name Item |

When set, this shows the active work area name below the status text.

See [`items/automower.items`](items/automower.items) for ready-to-paste item definitions for all of these.

**Pause button note:** The Pause button sends `ON` to whichever item you wire to the **Manual Pause Switch** prop. Wire it to `command#pause` for a direct binding pause, or to a NAND group member for integrated weather-guard control (see Tier 2 below).

### Optional: simple manual pause

To add only the manual pause toggle (without the full control button row):

1. Create a `Switch` item linked to `command#pause`
2. Set the widget's **Manual Pause** prop to that item name — leave all Control Actions props empty

This pauses the mower in-place via the binding but does not interact with any schedule automation.

---

## Tier 2 — Full Automation (Weather Guards + Manual Pause)

Use a NAND group so that weather guard rules and a manual pause all feed into one schedule control item. The widget prop strip shows which guards are currently active.

### How the NAND group works

`Group:Switch:NAND(OFF,ON)` — group is **OFF** when **any** member is ON, and **ON** only when **all** members are OFF.

- Guard items (weather, darkness, frost…) go ON → group goes OFF → schedule rule parks the mower
- All guards go OFF → group goes ON → schedule rule resumes the schedule (unless it's a weekend)

### 1. Create the items

Paste [`items/automower.items`](items/automower.items) into your `.items` file. The file defines:
- The five required status items
- A `Location` item for the GPS map
- A `Group:Switch:NAND(OFF,ON)` named `AutomowerSchedule`
- Six member Switch items (dark, hot, cold, frost, rain, manual)

### 2. Create the schedule rule

1. Open **Settings → Rules → +** → name it "Automower Schedule"
2. Add trigger: **Item AutomowerSchedule changed**
3. Set action type to **Run Script** → **ECMAScript 262 Edition 11** (JS Scripting)
4. Paste the contents of [`rules/automower-schedule.js`](rules/automower-schedule.js) and replace `THING_UID` with your Thing UID

### 3. Create weather guard rules (Threshold Alert)

Install the **Threshold Alert** template from the [OpenHAB Marketplace](https://community.openhab.org/) (search "Threshold Alert", template ID `144863`).

For each guard you want, create a rule from the template. In the template's action script, set the corresponding guard item:

| Guard | Trigger item | Guard item | Suggested threshold |
|-------|-------------|------------|---------------------|
| High temp | Outdoor temperature | `Automower_Guard_Hot` | > 35 °C |
| Low temp | Outdoor temperature | `Automower_Guard_Cold` | < 5 °C |
| Frost | Outdoor temperature | `Automower_Guard_Frost` | < 2 °C |
| Rain | Rain sensor / forecast | `Automower_Guard_Rain` | > 0 mm |

Example action script for each Threshold Alert rule:
```javascript
var GUARD_ITEM = 'Automower_Guard_Hot'; // ← change per guard

if (isAlerting) {
  items.getItem(GUARD_ITEM).postUpdate('ON');
} else {
  items.getItem(GUARD_ITEM).postUpdate('OFF');
}
```

For darkness/night: create an Astro binding item linked to `astro:sun:local:set#event` (or use a `isDaylight` Switch) and feed it into `Automower_Guard_Dark`.

### 4. Configure widget props

In the widget config, set:

| Prop | Item |
|------|------|
| Automower Activity | `Automower_Activity` |
| Automower Status | `Automower_State` |
| Automower Error Code | `Automower_ErrorCode` |
| Automower Battery Level | `Automower_Battery` |
| Automower Last Update | `Automower_LastUpdate` |
| Automower Position | `Automower_Position` (if using map) |
| Manual Pause | `Automower_Guard_Manual` |
| Darkness | `Automower_Guard_Dark` |
| High Temperature | `Automower_Guard_Hot` |
| Low Temperature | `Automower_Guard_Cold` |
| Rain | `Automower_Guard_Rain` |
| Frost | `Automower_Guard_Frost` |

The weather guard icon strip is hidden when none of the guard props are set.

---

## Props reference

### Binding Channels (required)

| Prop | Description |
|------|-------------|
| `automowerActivity` | String item: `status#activity` channel |
| `automowerStatus` | String item: `status#state` channel |
| `automowerErrorCode` | Number item: `status#error-code` channel |
| `automowerBatteryLevel` | Number item: `status#battery` channel |
| `automowerLastUpdate` | DateTime item: `status#last-update` channel |

### GPS Track Map (optional)

| Prop | Description |
|------|-------------|
| `automowerPosition` | Location item: `status#position` channel. Enables the GPS map. |
| `persistenceService` | Persistence service ID for GPS track history (e.g. `influxdb`). Must support Location items — RRD4J does not. |

### Control Actions (optional)

| Prop | Description |
|------|-------------|
| `automowerWorkAreaName` | String item: `status#work-area` channel. Shows the active work area name. |
| `automowerPark` | Number item: `command#park` channel. Powers timed park options (30 min / 3 hr / 24 hr). |
| `automowerParkNextSchedule` | Switch item: `command#park-until-next-schedule` channel. |
| `automowerParkFurtherNotice` | Switch item: `command#park-until-further-notice` channel. |
| `automowerResume` | Switch item: `command#resume-schedule` channel. Powers the Start button. |

### Schedule & Weather Guards (optional)

| Prop | Description |
|------|-------------|
| `automowerManualPause` | Switch item for manual pause. Also drives the Pause button in the control row. |
| `isDark` | Switch ON when dark/night |
| `isHot` | Switch ON when too hot |
| `isCold` | Switch ON when too cold |
| `isRaining` | Switch ON when raining |
| `isFrost` | Switch ON when frost |

---

## Advanced: synthetic status detail (work area progress %)

The widget's inline status decoding covers all activity and state values with friendly labels. The one thing it cannot show without an external rule is work area progress (e.g. "87% done in House North"), because that requires iterating over work area items at runtime.

If you want this level of detail, [`rules/automower_state_summary.js`](rules/automower_state_summary.js) contains a ready-to-use rule script (adapted from a community contribution). It computes three proxy items:

| Item to create | Type | Description |
|---|---|---|
| `Automower_Summary_Status` | `String` | High-level status label |
| `Automower_Summary_Detail` | `String` | Detail string with work area + progress |
| `Automower_Current_Cutting_Height` | `Number:Length` | Active cutting height in cm |

Setup:
1. Create the three proxy items
2. Create a rule in Main UI with triggers on each status/activity/state/work-area item change, plus a cron trigger `0 * * * * ? *`
3. Paste the script from `rules/automower_state_summary.js` as the rule action
4. Adjust `BASE_PREFIX` and `WORK_AREA_TAG` at the top of the script to match your installation

The widget has no props for these items — they are informational only. To surface them in the card, you could display `Automower_Summary_Status` via the **State Item** prop instead of `Automower_State`.

---

## Advanced: self-hosting Leaflet and tiles

By default `automower-map.html` loads Leaflet from [unpkg.com](https://unpkg.com) and satellite tiles from [Esri World Imagery](https://server.arcgisonline.com). Self-hosting both on your OpenHAB server eliminates all external dependencies, enables offline operation, and removes any CDN rate-limiting risk.

### Self-host Leaflet

Run once on your OpenHAB server:

```bash
sudo -u openhab mkdir -p /etc/openhab/html/leaflet/images
sudo -u openhab curl -sSL https://unpkg.com/leaflet@1.9.4/dist/leaflet.js     -o /etc/openhab/html/leaflet/leaflet.js
sudo -u openhab curl -sSL https://unpkg.com/leaflet@1.9.4/dist/leaflet.css    -o /etc/openhab/html/leaflet/leaflet.css
sudo -u openhab curl -sSL https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png    -o /etc/openhab/html/leaflet/images/marker-icon.png
sudo -u openhab curl -sSL https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png -o /etc/openhab/html/leaflet/images/marker-icon-2x.png
sudo -u openhab curl -sSL https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png  -o /etc/openhab/html/leaflet/images/marker-shadow.png
```

Then edit `automower-map.html` — replace the two CDN references with local paths:

```html
<!-- replace the <link> in <head> -->
<link rel="stylesheet" href="leaflet/leaflet.css"/>

<!-- replace the <script src="https://unpkg.com/..."> -->
<script src="leaflet/leaflet.js"></script>
```

The HTML is served at `/static/automower-map.html`, so `leaflet/` resolves to `/etc/openhab/html/leaflet/`.

### Self-host satellite tiles

For fully offline tile serving you need to pre-download the Esri imagery tiles that cover your property, then point the map at the local copies. This is a one-time setup:

1. Determine the bounding box (NW and SE corners in decimal degrees) for your property — add a generous buffer so the map is usable when the mower is near the boundary.
2. Write a small Python script (see the [Gemini-generated example in the community thread](https://community.openhab.org/)) that iterates over zoom levels 17–20, calls the Esri tile URL for each tile in the bounding box, and saves them to `/etc/openhab/html/tiles/{z}/{x}/{y}.jpg`.
3. Run it once; expect ~100–400 tiles (~10–40 MB) for a typical residential property.
4. In `automower-map.html`, change the `L.tileLayer` URL from the Esri CDN to the local path:

```js
L.tileLayer('tiles/{z}/{x}/{y}.jpg', {
  minZoom: 17, maxZoom: 21, maxNativeZoom: 20, errorTileUrl: ''
}).addTo(map);
```

> **Note:** Satellite imagery is updated periodically by Esri. Local tiles become stale over time. Re-run the downloader script periodically (e.g. yearly) to refresh them.

---

## Requirements

- OpenHAB 5.x (tested on 5.2.x)
- [Husqvarna Automower binding](https://www.openhab.org/addons/bindings/automower/)
- JS Scripting add-on (for the schedule rule, Tier 2 only)
- A persistence service that supports `Location` items, e.g. InfluxDB (for the GPS track map, optional — see note above)

---

## Changelog

### Version 1.3.0

- Added **Control Actions** prop group with Home/Start/Pause button row (all optional — card stays status-only when these props are not wired)
  - **Home** button opens a park popover: 30 min, 3 hr, 24 hr, until next schedule, until further notice
  - **Pause** button (orange) appears when mowing/leaving; sends pause command to `automowerManualPause` item
  - **Start** button (green) appears when idle; sends resume command to `automowerResume` item
- Added optional **Work Area Name** prop — shows the active work area below the status text
- Improved inline status decoding: all activity/state values now show friendly labels (`GOING_HOME` → "Going Home", `CHARGING` → "Charging", `NOT_APPLICABLE` + `IN_OPERATION` → "Planning", etc.) without requiring an external rule
- Badge colour expanded: Charging → yellow, Going Home → teal (previously only Mowing/Leaving were coloured)
- Bundled `rules/automower_state_summary.js` — community-contributed rule for richer status detail including work area progress percentage (advanced, optional)

### Version 1.2.0

- Added **status overlay** — semi-transparent chip in the top-right corner showing current lat/lon and last-updated time; appears once the first position is received
- Fixed persistence fetch to use `boundary=false`, preventing OpenHAB from injecting artificial boundary points into the GPS track
- Added **Advanced: self-hosting** section to README documenting how to serve Leaflet and satellite tiles locally for offline/resilient operation

### Version 1.1.0

- Added **Persistence Service** prop — dropdown selector (InfluxDB, RRD4J, MapDB, JDBC, or OpenHAB default) for the GPS track history service; passed to `automower-map.html` as `?serviceId=` URL parameter
- Reorganized widget props into three groups: **Binding Channels**, **GPS Track Map**, and **Schedule & Weather Guards**
- Improved prop labels and descriptions throughout
- GPS map setup docs updated to explain that RRD4J does not support Location items

### Version 1.0.0

- Initial release
