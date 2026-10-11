# home_pool_quick — pool quick sheet

Bottom sheet for the pool tile on the home page: a status line at the top, one **Pump** toggle row
(`oh-toggle-item`, live state), and a **Season** section with **Start winter break…** (neutral row with a confirmation;
sends `OFF` to `seasonItem`) and the pump schedule as footer. Native list rows only.

Open it from a tile while the season is on: `action: sheet`, `actionModal: widget:home_pool_quick` (no
`actionModalConfig` needed when the prop defaults fit). While the season is off the tile itself starts the season
(command `ON` with a confirmation), so the sheet is only used in season.

## Props
| Prop | Item type | Meaning |
|---|---|---|
| `pumpItem` | `Switch` | Powers the pool pump |
| `seasonItem` | `Switch` | `ON` = pool season (the pump schedule runs), `OFF` = winter break; the sheet's last row sends `OFF` |
| `scheduleText` | text | Footer under the season row (default: the 06:00 / 22:00 on, 09:00 / 00:00 off schedule) |

Switching the pump on by hand lasts until the schedule's next switch-off; the schedule rules are not changed by the sheet.

## Changelog
### Version 1.1.0

- Pump on/off rows replaced by one toggle row; status line at the top; SEASON header, neutral winter-break row, schedule as footer.

### Version 1.0.0

- Initial release.
