# home_pool_quick — pool quick sheet

Bottom sheet for the pool tile on the home page: **Pump on** / **Pump off** (a check mark shows the current state),
a status line with the pump schedule, and a separate section at the bottom that starts the **winter break**
(**Start winter break…**, with a confirmation; sends `OFF` to `seasonItem`). Native list rows only.

Open it from a tile while the season is on: `action: sheet`, `actionModal: widget:home_pool_quick` (no
`actionModalConfig` needed when the prop defaults fit). While the season is off the tile itself starts the season
(command `ON` with a confirmation), so the sheet is only used in season.

## Props
| Prop | Item type | Meaning |
|---|---|---|
| `pumpItem` | `Switch` | Powers the pool pump |
| `seasonItem` | `Switch` | `ON` = pool season (the pump schedule runs), `OFF` = winter break; the sheet's last row sends `OFF` |
| `scheduleText` | text | Status line under the pump rows (default: the 06:00 / 22:00 on, 09:00 / 00:00 off schedule) |

A manual **Pump on** lasts until the schedule's next switch-off; the schedule rules are not changed by the sheet.

## Changelog
### Version 1.0.0

- Initial release.
