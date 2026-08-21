# openhab-widgets

Custom OpenHAB Main UI widgets for home automation.

## Widgets

| Widget | Description | OH Version |
|--------|-------------|------------|
| [lawn_mower](widgets/lawn_mower/) | Husqvarna Automower status card with GPS track map, weather guards, and manual pause | 5.x |
| [humidity_room_card](widgets/humidity_room_card/) | Per-room humidity + temperature card with colour-coded zone bar | 5.x |
| [speedtest_card](widgets/speedtest_card/) | Ookla Speedtest dashboard — download/upload speeds, 7-day sparklines, ping/jitter, quality indicators, and run-test button | 5.x |
| [doorbell_card](widgets/doorbell_card/) | Doorbell card with snapshot image, live HLS stream, lock toggle, person/car detection badges, and recent-capture thumbnail grid | 5.x |

---

## How to install a widget

1. Copy the widget's `widget.yaml` content
2. In OpenHAB Main UI, open **Developer Tools → Widgets** (sidebar)
3. Click **+** → **Code** tab → paste → **Save**
4. Add the widget to any page via **Custom Widget** block

Each widget folder has its own README with full setup instructions and prop reference.

---

## Structure

```
widgets/
  <widget-name>/
    README.md          ← setup guide and prop reference
    widget.yaml        ← paste into OH widget editor
    items/             ← optional .items files
    rules/             ← optional JS Scripting rules
```

## Contributing

See [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md).
