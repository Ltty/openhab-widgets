# humidity_room_card — Per-Room Humidity & Temperature Card

A compact OpenHAB Main UI widget that shows a room's current humidity with a colour-coded status badge, a zone bar visualising the safe/elevated/critical thresholds, and the current temperature and setpoint.

> **Documentation in progress.** Full setup guide coming soon.

---

## Screenshot

> Add a screenshot to `widgets/humidity_room_card/screenshots/card.png` and update this link.

![Humidity Room Card](screenshots/card.png)

## What it shows

- Room icon + name + **OK / Elevated / Critical** badge (green / amber / red)
- Large humidity value, colour-coded by threshold
- CSS gradient zone bar with a live position indicator
- Three-row legend: Safe · Elevated · Critical with configurable ranges
- Current temperature and thermostat setpoint (optional)
- Tapping the card opens the Analyzer for the humidity and temperature items

---

## Item naming convention

The widget derives the temperature and setpoint items from the humidity item name by string replacement:

| Replacement | Result |
|-------------|--------|
| `_Humidity` → `_ActualTemperature` | temperature reading |
| `_Humidity` → `_SetPointTemperature` | thermostat setpoint |

This convention matches the default item names produced by the **HomeMatic/piVCCU** binding for combined humidity/temperature sensors. If your item names follow a different convention, the temperature and setpoint rows will show `–`.

---

## Quick start

### 1. Install the widget

1. Open **Developer Tools → Widgets** in the Main UI sidebar
2. Click **+** → **Code** tab
3. Paste the contents of [`widget.yaml`](widget.yaml)
4. Click **Save**

### 2. Add to a page

1. Edit a page → drag in a **Custom Widget** block
2. Set the widget type to `humidity_room_card`
3. Set the **Humidity Item** prop to your humidity item name
4. Optionally set a room name, icon, and threshold values

---

## Props reference

| Prop | Required | Default | Description |
|------|----------|---------|-------------|
| `item` | Yes | — | Humidity item (e.g. `FF_KidsRoom_Climate_Humidity`) |
| `title` | No | item label | Room display name |
| `icon` | No | `f7:house` | Icon name (e.g. `iconify:mdi:sofa`) |
| `orange` | No | `60` | Elevated threshold (%) |
| `red` | No | `70` | Critical threshold (%) |
| `min` | No | `40` | Safe zone lower bound (%) displayed in legend |

---

## Requirements

- OpenHAB 5.x (tested on 5.2.x)
- A Number or Number:Dimensionless humidity item

Temperature display requires a temperature item whose name is derived from the humidity item by replacing `_Humidity` with `_ActualTemperature` (HomeMatic convention). Setpoint display requires a corresponding `_SetPointTemperature` item.
