# server_status_card — server hardware status

![Server status card](screenshots/card.png)

One grouped card for the machine openHAB runs on, organised by layer: **Compute** (CPU load ring, load average, temperature bar with clock speed), **Memory** (RAM ring, swap bar, openHAB Java heap bar), **SD card** (used ring plus a bar for the zram log volume) and **SSD** (used rings with used/total GB), a **network** row (received/sent since boot with icons, IP address and interface) and the **controls** Reboot and Shut down. The tiles wrap: two per row on a phone, all four in one row on wide screens. Every tile has an info icon that opens a short explanation (`info_popover`).

Native components only (`f7-gauge`, `f7-card`, `oh-button`); optional parts (the two buttons) render through repeaters. Reboot and shutdown send `ON` to exec
switch items and always ask for confirmation first — shutdown needs physical access to start again; leave `rebootItem` / `shutdownItem` empty to hide a button.

Everything comes straight from the openHAB `systeminfo` binding — no helper rules. What the binding does not provide is not shown (e.g. live throughput: its network channels refresh only about hourly, so the totals can be up to an hour old). Note that the binding's default `network` channel group may map to an idle bridge (e.g. a container bridge);
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
| `storageTitle` | `SD card` | Title of the first storage tile. |
| `logsPctItem` | `Systeminfo_Logs_UsedPercent` | Optional zram log volume (ratio or %): bar under the SD card ring. Empty = hidden. |
| `logsUsedItem` | `Systeminfo_Logs_Used` | Number:DataAmount. |
| `logsTotalItem` | `Systeminfo_Logs_Total` | Number:DataAmount. |
| `logsTitle` | `Logs` | Label of the log bar. |
| `ssdPctItem` | `Systeminfo_SSD_UsedPercent` | Number (ratio or %) of the SSD volume — ring. |
| `ssdUsedItem` | `Systeminfo_SSD_Used` | Number:DataAmount. |
| `ssdTotalItem` | `Systeminfo_SSD_Total` | Number:DataAmount. |
| `ssdTitle` | `SSD` | Title of the second storage tile. |
| `cpuFreqItem` | `Systeminfo_CPU_Freq` | Number:Frequency (Hz); shown next to the temperature. |
| `heapPctItem` | `Systeminfo_Used_Heap_Percent` | Number (ratio or %) of the openHAB JVM heap — bar in the memory tile. |
| `procUsedItem` | `Systeminfo_CurrentProcessUsed` | Number:DataAmount used by the openHAB process. |
| `rxItem` | `Systeminfo_Data_Received` | Number:DataAmount (bytes since boot). |
| `netNameItem` | `Systeminfo_Net_Name` | String item with the interface name (e.g. br0). |
| `netIpItem` | `Systeminfo_Net_IP` | String item with the IP address. |
| `txItem` | `Systeminfo_Data_Sent` | Number:DataAmount (bytes since boot). |
| `rebootItem` | `gSystem_Reboot` | Exec switch; ON reboots the server (with confirmation). Empty = no button. |
| `shutdownItem` | `gSystem_Shutdown` | Exec switch; ON powers the server off (with confirmation). Empty = no button. |

## Changelog

### Version 1.5.0

- SD card tile: bar for the zram log volume ("Logs 29 % · 0.3 GB"); new props `logsPctItem`, `logsUsedItem`, `logsTotalItem`, `logsTitle`

### Version 1.4.0

- Storage split into an **SD card** and an **SSD** tile (four layer tiles); the network tile became a row below them with icons for received, sent and address
- Memory tile shows the openHAB Java heap and process memory; compute shows the CPU clock next to the temperature
- Info icon on every tile with an explanation popover (new widget `info_popover`)
- New props: `storageTitle`, `ssdPctItem`, `ssdUsedItem`, `ssdTotalItem`, `ssdTitle`, `cpuFreqItem`, `heapPctItem`, `procUsedItem`

### Version 1.3.1

- Network tile: live rates and the trend line removed again — the widget uses binding data only. It shows the totals since boot plus interface name and IP address (both optional, hidden when the items are not set)
- Props `rxRateItem` / `txRateItem` removed; the example rate rule is gone

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
