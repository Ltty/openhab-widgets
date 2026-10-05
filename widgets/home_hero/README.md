# home_hero — home page hero card

Greeting (Good morning / afternoon / evening / night + date), weather (day/night icon, current temperature,
condition), today's min/max and sunrise/sunset, and an exception-driven alert chip row (see
[`home_hero_alerts`](../home_hero_alerts/)). Everything is configurable through props with this house's items as
defaults, so a page needs no config: add `widget:home_hero` in a full-width grid column.

## Props
| Group | Prop | Default | Description |
|---|---|---|---|
| Weather | `tempItem` | `Netatmo_Weather_Station_Outdoor_Temperature` | Current outdoor temperature |
| | `conditionItem` | `OpenWeatherMap_Forecast_API_Current_Condition` | Condition text |
| | `iconItem` | `…Forecasts_ForecastToday_Iconid` | OWM icon id (`03d`); day/night variant is chosen from sunrise/sunset |
| | `minItem` / `maxItem` | `…ForecastToday_Min/Maxtemperature` | Today's range |
| | `sunriseItem` / `sunsetItem` | `LocalSun_Rise_Start` / `LocalSun_Set_Start` | DateTime items |
| Behaviour | `weatherPage` | Outdoor page | Opened when the weather block (or a warning chip) is tapped |
| | `showSunTimes` | `true` | Show sunrise/sunset |
| | `name` | empty | Appended to the greeting |
| Alerts | `smokeGroup`, `weatherWarningsGroup`, `batteryGroup`, `humidityGroup`, `thingsGroup`, `pickupsGroup` | `gSmokeAlerts`, `gWeatherWarnings`, `gBatteryWarnings`, `gHumidityWarnings`, `gThingWarnings`, `gWastePickups` | Passed to `home_hero_alerts` |

Look and feel (colours, chip order, greeting hours) is deliberately not configurable.

## Widget family — install all of these together
One logical widget, five definitions, all in [`widgets.yaml`](widgets.yaml) (openHAB's multi-widget `widgets:` map
format; each key is the widget UID). Main UI has no include mechanism and bottom sheets must be separate widgets. In the
widget editor create one widget per key (UID = key) and paste that entry's body. Only `home_hero` is placed on a page.

| UID | Role |
|---|---|
| `home_hero` | the card (place this one) |
| `home_hero_alerts` | chip row |
| `home_offline_devices` | offline sheet |
| `home_low_batteries` | battery sheet |
| `home_humidity` | humidity sheet |

Also needs the waste widgets (`waste_pickup_chips`, `waste_pickup_schedule`, `waste_pickup_row`) from
[`../waste_pickup_card/`](../waste_pickup_card/). On the page give the entry a `config` object (`{}` is enough) or the
editor shows no props.

## Related widgets
`home_hero_alerts` (chip row) → `waste_pickup_chips` / `home_low_batteries` / `home_humidity` / `home_offline_devices`
(bottom sheets). Keep the hero as one widget so the page editor (which ignores `visible`) shows one block.

## Changelog
- **1.0.0** — initial release.
