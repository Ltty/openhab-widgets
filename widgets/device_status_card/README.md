# device_status_card — low batteries and offline devices

![low batteries and offline devices](screenshots/card.png)

Two list cards for the System Info page that only appear when there is something to report: **Low batteries** (members of the battery group that are `ON`, named from the `display` metadata `{device, location}`) and **Offline devices** (Thing status switches that are `OFF`; devices with `offlineExpected` metadata are hidden). Group data is fetched once per page load.

## Props
| Prop | Required | Default | Description |
|---|---|---|---|
| `batteryGroup` | No | `gBatteryWarnings` | Group of low-battery Switch items (ON = low); metadata 'display' {device, location} gives the names. |
| `thingsGroup` | No | `gThingWarnings` | Group of Thing status Switch items (OFF = offline); metadata 'offlineExpected' hides expected-offline devices. |

## Changelog

### Version 1.1.1

- The all-clear row of 1.1.0 is removed again: with nothing to report the cards stay invisible

### Version 1.1.0

- When nothing is wrong a single "All devices online, batteries OK" row is shown (with the number of expected-offline devices that are not counted) instead of an empty page section

### Version 1.0.0

- Initial release.
