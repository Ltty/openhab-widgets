# openhab-widgets

Custom OpenHAB Main UI widgets for home automation.

## Widgets

### Home page

| Widget | Description | OH Version |
|--------|-------------|------------|
| [home_hero](widgets/home_hero/) | Greeting, weather, sun times and exception-driven alert chips (smoke, weather, waste, doorbell, batteries, humidity, offline) with detail sheets — one family in `widgets.yaml` | 5.x |
| [home_heating_quick](widgets/home_heating_quick/) | Heating quick-mode sheet — fireplace until morning, vacation 3/5/7/14 days, back to auto (needs a command rule, example in `rules/`) | 5.x |
| [waste_pickup_card](widgets/waste_pickup_card/) | Group-driven waste collection card (replaces `garbage_list_v1`) with `row` / `chips` / `schedule` parts — sorted by date, relative days, bin colours from item metadata | 5.x |
| [doorbell_card](widgets/doorbell_card/) | IP camera doorbell card: relative event time, person/car badges, 4-image history with swipe viewer, live HLS popup (`doorbell_live`), optional lock icon and unlock | 5.x |
| [gas_cost_card](widgets/gas_cost_card/) | Cost card/tile for gas and electricity: period cost, YoY badge, forecast vs. last period, optional live value and 24 h trend line | 5.x |
| [speedtest_card](widgets/speedtest_card/) | Ookla Speedtest card: download and upload tiles with plan pill and trend, ping/jitter, quality indicators, refresh icon — native components only | 5.x |

### Garden, climate and heating

| Widget | Description | OH Version |
|--------|-------------|------------|
| [air_quality_card](widgets/air_quality_card/) | European Air Quality Index card — verdict, driving pollutant, 6-band strip, per-pollutant detail | 5.x |
| [lawn_mower](widgets/lawn_mower/) | Husqvarna Automower status card with GPS track map, weather guards and manual pause | 5.x |
| [humidity_room_card](widgets/humidity_room_card/) | Per-room humidity + temperature card with zone bar and optional heating-valve indicator | 5.x |
| [atag_one_card](widgets/atag_one_card/) | ATAG ONE thermostat control face — current/target temperature, mode selector, vacation/extend/fireplace pickers | 5.x |
| [atag_schedule_card](widgets/atag_schedule_card/) | ATAG ONE weekly CH/DHW schedule editor | 5.x |
| [atag_regulation_card](widgets/atag_regulation_card/) | ATAG ONE regulation settings — central heating, weather-dependent, hot water, display | 5.x |
| [atag_diagnostics_card](widgets/atag_diagnostics_card/) | ATAG ONE read-only boiler diagnostics | 5.x |
| [atag_heating_chart](widgets/atag_heating_chart/) | ATAG ONE central heating daily chart — target vs. room vs. outside temperature | 5.x |
| [atag_hotwater_chart](widgets/atag_hotwater_chart/) | ATAG ONE domestic hot water daily chart — target vs. current water temperature | 5.x |

---

## How to install a widget

1. Copy the widget's `widget.yaml` content (families use one `widgets.yaml` with a `widgets:` map, one key per UID)
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
    widget.yaml        ← paste into OH widget editor (or widgets.yaml: a family, one key per UID)
    rules/             ← optional JS Scripting rules
```

Widgets are UI only — they never ship items. Every item a widget reads or commands is a prop; the README documents
the contract per prop (item type, binding channel, meaning of the state) so it can be wired to any existing model.

## Validation

`scripts/` has two helpers (`npm install` there once): `node scripts/check-expressions.mjs` parses every `=` expression
in all `widget.yaml` / `widgets.yaml` with the same grammar Main UI uses (it is *not* plain JavaScript — no block-bodied arrows, no
`const`, only `items/props/loop/vars/Math/Number/dayjs/…`), and `node scripts/test-waste-logic.mjs` runs date-logic
fixtures (DST included) against the waste widgets' real expressions.

## Conventions

- **No items, no hidden model.** Widgets read and command items through props only; READMEs document the contract per prop.
- **Editor-safe.** Optional or looping content renders through `oh-repeater` (`in: =cond ? [1] : []` or a `filter`), not `visible` —
  the page editor ignores `visible` and would draw every variant at once.
- **Native components first.** HTML companions (`oh-webframe`) only where Main UI has no equivalent (HLS video, GPS map, ATAG editors).
- **Props with defaults**, every prop described, grouped with `parameterGroups`.
- **Families** (a widget plus sub-widgets/sheets) live in one folder as `widgets.yaml` (`widgets:` map keyed by UID).

## Contributing

See [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md).
