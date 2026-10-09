# model_equipment_card — default card for Equipment groups

Standalone (`widget` metadata) card for every semantic Equipment group. Shows a hero value, up to two secondary
values, a health value (battery / signal / last update) top right and an inline control (switch, dimmer or
rollershutter up/stop/down). Missing or `NULL`/`UNDEF` values render as `–` plus a "no data" pill, never as `NULL`.
Props are pre-computed per node by rule *Update Model Widgets* (selection order: temperature → light/power switch →
opening → open/alarm status → other measurement → status → setpoint); parents without own points borrow their first
child's hero. Tapping the header opens the analyzer for `analyzerItems`.

## Props
| Prop | Required | Default | Description |
|---|---|---|---|
| `title` | Yes | — | Equipment name. |
| `icon` | No | `square_grid_2x2` | f7 icon name or full icon id. |
| `color` | No | `#0ea5e9` | CSS colour of the icon. |
| `hero` | No | — | Item shown as the big value. |
| `secondary1` | No | — | First detail row. |
| `secondary2` | No | — | Second detail row. |
| `health` | No | — | Item shown top right (battery, signal, last update). |
| `control` | No | — | switch, dimmer or shutter. Empty = no control. |
| `controlItem` | No | — | Item the control sends to. |
| `sub` | No | — | Fallback text such as "8 channels". |
| `analyzerItems` | No | — | Comma-separated items; tapping opens the analyzer. |

## Changelog

### Version 1.0.0

- Initial release.
