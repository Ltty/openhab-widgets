# openhab-widgets

Custom OpenHAB Main UI widgets for home automation.

## Widgets

| Widget | Description | OH Version |
|--------|-------------|------------|
| [lawn_mower](widgets/lawn_mower/) | Husqvarna Automower status card with GPS track map, weather guards, and manual pause | 5.x |
| [humidity_room_card](widgets/humidity_room_card/) | Per-room humidity + temperature card with colour-coded zone bar and an optional heating-valve indicator | 5.x |
| [speedtest_card](widgets/speedtest_card/) | Ookla Speedtest dashboard — download/upload speeds, 7-day sparklines, ping/jitter, quality indicators, and run-test button | 5.x |
| [doorbell_card](widgets/doorbell_card/) | Doorbell card with snapshot image, live HLS stream, lock toggle, person/car detection badges, and recent-capture thumbnail grid | 5.x |
| [air_quality_card](widgets/air_quality_card/) | European Air Quality Index card — verdict, driving pollutant, 6-band strip, and expandable per-pollutant detail | 5.x |
| [atag_one_card](widgets/atag_one_card/) | ATAG ONE thermostat control face styled after the official app/portal — current/target temperature, mode selector, vacation/extend/fireplace duration pickers | 5.x |
| [atag_schedule_card](widgets/atag_schedule_card/) | ATAG ONE weekly CH/DHW schedule editor | 5.x |
| [atag_regulation_card](widgets/atag_regulation_card/) | ATAG ONE regulation settings — central heating, weather-dependent, hot water, display | 5.x |
| [atag_diagnostics_card](widgets/atag_diagnostics_card/) | ATAG ONE read-only boiler diagnostics | 5.x |

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
