# server_status_card — server hardware status

![Server status card](screenshots/card.png)

One grouped card for the machine openHAB runs on, organised by layer: **Compute** (CPU load ring, load average, temperature bar),
**Memory** (RAM ring, swap bar nested under it), **Storage** (used ring with used/total GB), **Network** (live rates, totals since boot, interface and IP),
and the **controls** Reboot and Shut down. The layer tiles wrap: two per row on a phone (compute+memory, storage+network), all four in one row on wide screens.
Every tile has the same structure — header with icon and title, ring or values, primary line, optional bar. The header shows the hardware model and the uptime. The rings go green → amber above 70 % → red above 85 %.

Native components only (`f7-gauge`, `f7-card`, `oh-button`); optional parts (the two buttons) render through repeaters. Reboot and shutdown send `ON` to exec
switch items and always ask for confirmation first — shutdown needs physical access to start again; leave `rebootItem` / `shutdownItem` empty to hide a button.

Items come from the openHAB `systeminfo` binding. The two rate items are not binding channels: the binding's network counters refresh only hourly, so a small rule reads `/proc/net/dev` once a minute and writes the Mbit/s of your interface to the two rate items (example in [`rules/network-rate.js`](rules/network-rate.js)). Note that the binding's default `network` channel group may map to an idle bridge (e.g. a container bridge);
link the data sent/received items to the channel group of your real interface.

## Props
| Prop | Default | Description |
|---|---|---|
| `title` | `Raspberry Pi` | Card title (default Raspberry Pi). |
| `modelItem` | `Systeminfo_CPUName` | String item with the hardware name, e.g. Raspberry Pi 5 Model B. |
| `uptimeItem` | `Systeminfo_System_Uptime` | Number:Time item (days). |
| `cpuLoadItem` | `Systeminfo_CPULoad` | Number (%) — ring. |
| `cpuTempItem` | `Systeminfo_CPU_Temperature` | Number:Temperature (°C); amber above 70, red above 80. |
| `load1Item` | `Systeminfo_Load1_Average` | Number. |
| `load15Item` | `Systeminfo_Load15_Average` | Number. |
| `memUsedPctItem` | `Systeminfo_Used_` | Number (%) — ring. |
| `memUsedItem` | `Systeminfo_Used` | Number:DataAmount (bytes). |
| `memTotalItem` | `Systeminfo_Total` | Number:DataAmount (bytes). |
| `swapUsedItem` | `Systeminfo_SwapUsed` | Number:DataAmount (bytes). |
| `swapTotalItem` | `Systeminfo_SwapTotal` | Number:DataAmount (bytes). |
| `storageUsedPctItem` | `Systeminfo_UsedStorage_` | Number (%) — ring. |
| `storageUsedItem` | `Systeminfo_UsedStorage` | Number:DataAmount (bytes). |
| `storageTotalItem` | `Systeminfo_Total_Storage` | Number:DataAmount (bytes). |
| `rxItem` | `Systeminfo_Data_Received` | Number:DataAmount (bytes since boot). |
| `rxRateItem` | `Systeminfo_Data_Rate_Down` | Number:DataTransferRate (Mbit/s), also drawn as 24 h trend. Produced by a rule from the counters. |
| `txRateItem` | `Systeminfo_Data_Rate_Up` | Number:DataTransferRate (Mbit/s). |
| `netNameItem` | `Systeminfo_Net_Name` | String item with the interface name (e.g. br0). |
| `netIpItem` | `Systeminfo_Net_IP` | String item with the IP address. |
| `txItem` | `Systeminfo_Data_Sent` | Number:DataAmount (bytes since boot). |
| `rebootItem` | `gSystem_Reboot` | Exec switch; ON reboots the server (with confirmation). Empty = no button. |
| `shutdownItem` | `gSystem_Shutdown` | Exec switch; ON powers the server off (with confirmation). Empty = no button. |

## Changelog

### Version 1.3.0

- Network tile: live download/upload rate (Mbit/s) with a 24 h trend line, the totals since boot as sub lines, and the interface name and IP address
- New props: `rxRateItem`, `txRateItem`, `netNameItem`, `netIpItem` (the rate items need the example rule)

### Version 1.2.0

- Tile order follows the machine: compute, memory, storage, network
- Rings, value lines and bars are centred in every tile

### Version 1.1.0

- Layer tiles wrap responsively (2×2 on phones, one row on desktop) instead of two fixed columns; order compute, network, memory, storage
- CPU temperature moved from the tile header to a bar line under the load, matching the swap bar of the memory tile; consistent info placement across tiles

### Version 1.0.0

- Initial release. Replaces the single status tiles on the System Info page with one semantically grouped card.
