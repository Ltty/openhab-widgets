# speedtest_card — Ookla Speedtest Dashboard

An Ookla-inspired OpenHAB Main UI widget powered by the official [Ookla Speedtest binding](https://www.openhab.org/addons/bindings/speedtest/). Shows download/upload speeds with 7-day sparkline trends, ping/jitter, four quality indicators (Browsing, Gaming, Streaming, Video Call), and a "Run Test Again" button.

The widget is a thin `oh-webframe` wrapper around a companion HTML file (`speedtest.html`). All rendering, data fetching, and the run-test flow happen inside the HTML file via the OpenHAB REST API — no additional rules or scripts are needed.

---

## Screenshots

| Widget |
|--------|
| ![speedtest_card](screenshots/card.png) |

---

## Requirements

- OpenHAB 5.x (tested on 5.2.x)
- [Ookla Speedtest binding](https://www.openhab.org/addons/bindings/speedtest/) installed and configured
- The `speedtest` CLI binary present on the host and GDPR accepted (the binding calls it)
- InfluxDB (or another persistence service) — needed to populate the 7-day sparklines; without it the widget still works but sparklines will be empty

---

## Setup

### 1. Install the Speedtest binding

In **Settings → Add-ons → Bindings**, search for "Ookla Speedtest" and install it.

Once installed, add a new **Ookla Speedtest** thing and note the **Thing UID** (e.g. `speedtest:speedtest:79e16ff6c8`).

### 2. Create items and wire channels

Paste [`items/speedtest.items`](items/speedtest.items) into your `.items` file, replacing `YOUR_THING_UID` with your actual Thing UID.

These are the default item names the widget falls back to. You can use any item names — configure them via widget props (see Props reference).

| Item | Type | Channel | Widget prop |
|------|------|---------|-------------|
| `SpeedtestResultDown` | `Number:DataTransferRate` | `downloadBandwidth` | `downloadItem` |
| `SpeedtestResultUp` | `Number:DataTransferRate` | `uploadBandwidth` | `uploadItem` |
| `SpeedtestResultPing` | `Number:Time` | `pingLatency` | `pingItem` |
| `SpeedtestResultJitter` | `Number:Time` | `pingJitter` | `jitterItem` |
| `SpeedtestServer` | `String` | `server` | `serverItem` |
| `SpeedtestResultDate` | `DateTime` | `timestamp` | `dateItem` |
| `SpeedtestRerun` | `Switch` | `triggerTest` | `triggerItem` |

### 3. Deploy the companion HTML file

Copy `speedtest.html` to your OpenHAB static asset folder:

```bash
cp speedtest.html /etc/openhab/html/speedtest.html
```

The file will be served at `/static/speedtest.html`.

### 4. Install the widget

1. Open **Developer Tools → Widgets** in Main UI
2. Click **+** → **Code** tab
3. Paste the contents of [`widget.yaml`](widget.yaml)
4. Click **Save**

### 5. Add the widget to a page

1. Edit a page → drag in a **Custom Widget** block
2. Set the widget type to `speedtest_card`
3. Under **Binding Items**: set the three required item props (Download, Upload, Trigger) — skip if you used the default item names from step 2
4. Under **Plan Speeds**: set **Download Plan** and **Upload Plan** to your contracted speeds (default: 150/20 Mbit/s)

The degradation indicator ("−X% below plan") only appears when speed drops below your plan speed.

---

## Props reference

### Binding Items

| Prop | Required | Default | Description |
|------|----------|---------|-------------|
| `downloadItem` | Yes | `SpeedtestResultDown` | Number item linked to the download result channel. Drives the download speed display and 7-day sparkline. |
| `uploadItem` | Yes | `SpeedtestResultUp` | Number item linked to the upload result channel. Drives the upload speed display and 7-day sparkline. |
| `triggerItem` | Yes | `SpeedtestRerun` | Switch item linked to the run channel. The "Run Test Again" button sends ON and waits for the binding to reset it to OFF. |
| `pingItem` | No | `SpeedtestResultPing` | Number item for ping/latency in milliseconds. |
| `jitterItem` | No | `SpeedtestResultJitter` | Number item for jitter in seconds (widget multiplies by 1000 to display ms). |
| `dateItem` | No | `SpeedtestResultDate` | DateTime or String item for the last test timestamp. Shown as relative time ("3 min ago"). |
| `serverItem` | No | `SpeedtestServer` | String item with the server name or location. Shown next to the timestamp. |

### Plan Speeds

| Prop | Required | Default | Description |
|------|----------|---------|-------------|
| `planDown` | No | `150` | Your contracted download speed in Mbit/s. Used for the sparkline dashed reference line and the degradation warning. |
| `planUp` | No | `20` | Your contracted upload speed in Mbit/s. Used the same way for the upload column. |

---

## How it works

- **Sparklines**: fetches the last 7 days of history via the OpenHAB persistence REST API (uses whatever service your installation is configured with), downsamples to 14 half-day buckets, and renders a smooth bezier curve. The dashed line marks your plan speed.
- **Quality scores**: 5-dot indicators derived from download (Browsing, Streaming), ping (Gaming), and upload (Video Call) using Ookla's published thresholds.
- **Degradation**: nothing shown when at or above plan speed; amber "−X% below plan" at 80–99%; red below 80%.
- **Run Test Again**: POSTs `ON` to `SpeedtestRerun`, polls every 5 seconds until the binding resets it to `OFF`, then refreshes the display.
- **Auto-refresh**: the widget refreshes automatically every 5 minutes.

---

## Changelog

### Version 1.0.1

- Props reorganized into two groups: **Binding Items** (7 item props, required first) and **Plan Speeds**
- All item props now configurable — no longer requires fixed item names
- Removed `persistenceService` prop — sparklines now use the OpenHAB default persistence service automatically; all speedtest items are numeric so RRD4J (the OH default) works out of the box
- Improved prop labels and descriptions throughout
- Fixed "How it works" section which incorrectly stated InfluxDB was required for sparklines

### Version 1.0.0

- Initial release
