# home_mower_quick — mower quick sheet

Bottom sheet for the mower tile on the home page: a status line at the top (status and detail, or "Paused"), one
**Pause mowing** toggle row (`oh-toggle-item`, live state), and a **Season** section with **Start winter mode…**
(neutral row with a confirmation; sends `ON` to `winterItem`) and a spring hint as footer. Native list rows only.

Open it from a tile while winter mode is off: `action: sheet`, `actionModal: widget:home_mower_quick`. While winter
mode is on the tile itself ends it (command `OFF` to `winterItem` with a confirmation), so the sheet is only used out
of winter.

Both switches are members of the mower's schedule group (`Group:Switch:NAND(OFF,ON)`), so turning one ON parks the
mower and turning the last one OFF lets the schedule resume. Winter mode additionally marks the mower's Thing status
item as expected-offline (`offlineExpected` metadata, set by a rule), which hides it from the offline chip and
silences the offline notification.

## Props
| Prop | Item type | Meaning |
|---|---|---|
| `pauseItem` | `Switch` | `ON` = manually paused |
| `winterItem` | `Switch` | `ON` = stored for winter; the last row sends `ON` |
| `statusItem` | `String` | One-word status in the status line |
| `detailItem` | `String` | Status detail after the status |

## Changelog
### Version 1.0.0

- Initial release.
