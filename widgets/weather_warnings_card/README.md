# weather_warnings_card — weather warnings

Shows one amber card per active weather warning (event, validity, description) and nothing at all when there is no warning. The group's
members are the warning *event* items (`…_Alerts_Event`); the sibling items `…_Alerts_Description` and `…_Alerts_Expires` are found by replacing
`_Event` in the item name (the OpenWeatherMap binding's naming). Warnings with state `UNDEF`, `undefined`, `-` or `NULL` are hidden.

No screenshot: it only renders while a warning is active.

## Props
| Prop | Required | Default | Description |
|---|---|---|---|
| `group` | No | `gWeatherWarnings` | Group of the weather-warning event items (…_Alerts_Event); sibling items …_Alerts_Description and …_Alerts_Expires are found by name. |

## Changelog

### Version 1.0.0

- Initial release.
