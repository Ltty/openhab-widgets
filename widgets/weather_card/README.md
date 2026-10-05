# weather_card — weather overview card

![weather overview card](screenshots/card.png)

Current weather, the next six hours and six days in one card, built from native components and the OpenWeatherMap forecast items:
temperature with condition and day/night icon, today's min/max, sunrise/sunset, an hourly strip (time, icon, temperature) and a daily list
with min/max range bars. Replaces the marketplace `semanticHomeMenu_Weather`.

Item convention: `<forecastPrefix>Hours01..06_Timestamp/_Iconid/_Temperature` and `<forecastPrefix>Today|Tomorrow|Day2..Day5_Iconid/_Mintemperature/_Maxtemperature`
(the openHAB OpenWeatherMap binding's forecast channel groups).

## Props
| Prop | Default | Description |
|---|---|---|
| `tempItem` | `Netatmo_Weather_Station_Outdoor_Temperature` | Current outdoor temperature. |
| `conditionItem` | `OpenWeatherMap_Forecast_API_Current_Condition` | Condition text (String). |
| `iconItem` | `OpenWeatherMap_Forecast_API_Forecasts_ForecastToday_Iconid` | OpenWeatherMap icon id of today (e.g. 03d); the night variant is picked from the trailing d/n. |
| `minItem` | `OpenWeatherMap_Forecast_API_Forecasts_ForecastToday_Mintemperature` | Today's minimum temperature. |
| `maxItem` | `OpenWeatherMap_Forecast_API_Forecasts_ForecastToday_Maxtemperature` | Today's maximum temperature. |
| `sunriseItem` | `LocalSun_Rise_Start` | DateTime item. |
| `sunsetItem` | `LocalSun_Set_Start` | DateTime item. |
| `soilItem` | `Netatmo_Weather_Station_Soil_Temp` | Optional soil temperature, shown after min/max. |
| `blindsOpenItem` | `LocalSun_CivilDawn_Start` | Optional DateTime item the morning blind routine is triggered from (e.g. civil dawn start). Empty = no blinds line. |
| `blindsOpenOffset` | `20` | Minutes the routine adds to that item's time (the offset in the rule's DateTime trigger). |
| `blindsOpenClamp` | `06:15` | If the open time item equals this time (the astro channel's 'earliest' limit clamps it), the offset is not added — matches the rule, which opens at the limit without delay. Empty = always add. |
| `blindsCloseItem` | `LocalSun_CivilDusk_End` | Optional DateTime item the evening blind routine is triggered from (e.g. civil dusk end). |
| `blindsCloseOffset` | `12` | Minutes the routine adds to that item's time. |
| `updatedItem` | `Netatmo_Weather_Station_Measures_Timestamp` | DateTime of the last station measurement. |
| `forecastPrefix` | `OpenWeatherMap_Forecast_API_Forecasts_Forecast` | Prefix of the OpenWeatherMap forecast items: <prefix>Hours01..06_Timestamp/_Iconid/_Temperature and <prefix>Today/Tomorrow/Day2..Day5_Iconid/_Mintemperature/_Maxtemperature. |

The blinds line shows when the automation opens and closes the blinds: the time of the item the routine is triggered from plus the offset configured in the rule's DateTime trigger. Keep the offset props equal to the rule offsets; `blindsOpenClamp` mirrors the astro channel's `earliest` limit, which the rule respects by opening without delay when the item sits exactly on it; leave `blindsOpenItem` empty to hide the line.

## Changelog

### Version 1.2.1

- Blinds line: when the open-time item equals the clamp time (`blindsOpenClamp`, default 06:15 = the astro channel's `earliest`), the offset is not added, matching the morning rule

### Version 1.2.0

- Optional blinds line ("Blinds open 06:56 · close 19:19") from the dawn/dusk items the blind routines use plus their trigger offsets (new props `blindsOpenItem`, `blindsOpenOffset`, `blindsCloseItem`, `blindsCloseOffset`)

### Version 1.1.0

- Soil temperature after min/max (`soilItem`, "10° / 21° / 18° soil")
- "Updated" time moved to a left-aligned footer line
- Daily range bars are coloured by absolute temperature (blue below zero → light blue → pale yellow → orange → red above 30 °C; no green) instead of the same gradient for every day

### Version 1.0.0

- Initial release.
