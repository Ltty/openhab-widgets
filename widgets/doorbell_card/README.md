# doorbell_card — IP Camera Doorbell Card

An OpenHAB Main UI card for IP cameras using the [ipcamera binding](https://www.openhab.org/addons/bindings/ipcamera/). Shows the last detection event (person/car badges), a latest-capture snapshot, a collapsible live HLS stream, and an optional smart lock unlock button.

---

## Screenshots

| Card | Live view open |
|------|---------------|
| ![Card](screenshots/card.png) | ![Live](screenshots/live.png) |

---

## Requirements

- OpenHAB 5.x (tested on 5.2.x)
- [ipcamera binding](https://www.openhab.org/addons/bindings/ipcamera/) with your camera configured as a thing
- **hls.js** placed at `/etc/openhab/html/doorbell/hls.min.js` — required for the live view in browsers that don't natively support HLS (see below)
- Optional: smart lock binding (Nuki, Z-Wave, etc.) for the lock icon and unlock button
- Optional: `widget:keypad` marketplace widget for PIN-code unlock

---

## Setup

### 1. Install the ipcamera binding and configure your camera

In **Settings → Add-ons → Bindings**, install "IP Camera". Add your camera as a thing and note the **Thing UID** (e.g. `abc12345` — the last segment of `ipcamera:REOLINK:abc12345`).

### 2. Create items

Paste [`items/doorbell.items`](items/doorbell.items) into your `.items` file, replacing `YOUR_THING_UID` with the full ipcamera thing UID.

Required items:

| Item | Type | Description |
|------|------|-------------|
| `GF_Entryway_Doorbell_Image` | `Image` | Receives snapshot images |
| `GF_Entryway_Doorbell_LastEventLabel` | `String` | Last detected event description |
| `GF_Entryway_Doorbell_LastEventTime` | `String` or `DateTime` | Timestamp of last event |

Optional:

| Item | Type | Description |
|------|------|-------------|
| `GF_Entryway_Doorbell_HumanDetected` | `Switch` | Person detection state |
| `GF_Entryway_Doorbell_CarDetected` | `Switch` | Car/vehicle detection state |
| Your lock state item | `Switch` | `ON` = locked |

> You can rename the items — just update the widget props accordingly.

### 3. Set up the live view

The live view uses [hls.js](https://github.com/video-dev/hls.js/) to play the ipcamera binding's HLS stream.

1. Download `hls.min.js` from the [hls.js releases](https://github.com/video-dev/hls.js/releases) page
2. Place it at `/etc/openhab/html/doorbell/hls.min.js`
3. Copy `live.html` to `/etc/openhab/html/doorbell/live.html`

Both files must be in the same `/etc/openhab/html/doorbell/` directory. The live view is loaded via `oh-webframe` and polls the ipcamera HLS stream at `/ipcamera/{thingUID}/ipcamera.m3u8`.

### 4. Install the widget

1. Open **Developer Tools → Widgets** in Main UI
2. Click **+** → **Code** tab
3. Paste the contents of [`widget.yaml`](widget.yaml)
4. Click **Save**

### 5. Add to a page

1. Edit a page → drag in a **Custom Widget** block
2. Set widget type to `doorbell_card`
3. Set the required props

---

## Props reference

| Prop | Required | Type | Description |
|------|----------|------|-------------|
| `imageItem` | Yes | Item | Image item receiving camera snapshots |
| `labelItem` | Yes | Item | String item with the last event description |
| `timeItem` | Yes | Item | DateTime/String item with the last event time |
| `cameraThingId` | Yes | Text | ipcamera thing UID — last segment of the Thing UID |
| `humanItem` | No | Item | Switch: ON when a person is detected |
| `carItem` | No | Item | Switch: ON when a car is detected |
| `lockItem` | No | Item | Switch: ON = locked; shows lock icon in header |
| `pinItem` | No | Item | Item for PIN unlock popup (`widget:keypad` required) |
| `cardTitle` | No | Text | Card header label (default: "Front Door") |

---

## Notes

- **Snapshot**: shown via the `imageItem` OH Image item state (updated by the `image` channel of the ipcamera binding). Refreshes every 30 seconds.
- **Live view**: the `cameraThingId` prop is used to construct `/ipcamera/{id}/ipcamera.m3u8`. The ipcamera binding must have the camera thing ONLINE for the stream to work.
- **Unlock button**: only appears when `pinItem` is set. Requires the [`widget:keypad`](https://community.openhab.org/t/keypad-widget/122765) marketplace widget.
- **hls.js version**: tested with hls.js 1.5.x. The `live.html` includes a stall watchdog that nudges the stream after 8 seconds of no progress and reloads after 20 seconds.
