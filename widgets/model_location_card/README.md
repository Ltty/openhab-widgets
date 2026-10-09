# model_location_card — default card for Location groups

Standalone (`widget` metadata) card for every semantic Location, so untyped Location groups never show `NULL`
(Settings → Model, item page). Same design language as `stat_tile` (18 px card, icon + 12 px title, 26 px value).
All props are pre-computed per Location by rule *Update Model Widgets* and written as `widget` metadata with
`managed: true`; set `managed: false` on a node to keep a hand-made card. Config values must be strings (lists are
comma-separated; arrays and objects are dropped by openHAB's metadata config).

- **Room with climate**: average temperature and humidity of top-level `Point_Measurement` points, `(xx°)` = average setpoint (same rule as the Home location cards).
- **Room without climate**: up to 3 equipment hero values, then a "N devices" sub line.
- **Floor / building / root**: one row per child location with its climate; tapping a row opens that group.

## Props
| Prop | Required | Default | Description |
|---|---|---|---|
| `title` | Yes | — | Location name. |
| `icon` | No | `square_grid_2x2` | f7 icon name or full icon id. |
| `color` | No | `#0ea5e9` | CSS colour of the icon. |
| `tempItems` | No | — | Comma-separated; averaged. |
| `humItems` | No | — | Comma-separated; averaged. |
| `setpointItems` | No | — | Comma-separated; averaged, shown as (xx°). |
| `fallbackItems` | No | — | Comma-separated items listed when the room has no climate points. |
| `children` | No | — | Floor-level nodes: item|title|tempItems|humItems;… (tap opens the group). |
| `sub` | No | — | Text under the card, e.g. "5 devices". |
| `analyzerItems` | No | — | Comma-separated items; tapping opens the analyzer. |

## Changelog

### Version 1.0.1

- Fix: header icon was oversized for `oh:` image icons (fixed 18 px size).

### Version 1.0.0

- Initial release.
