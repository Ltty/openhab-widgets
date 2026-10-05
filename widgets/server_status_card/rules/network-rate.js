// JS Scripting rule, trigger: cron "0 * * * * ?" (every minute).
// Network throughput of the LAN bridge from the kernel counters (/proc/net/dev), once a minute.
// The systeminfo binding only refreshes its data counters hourly (low priority), too coarse for a live rate.
var IFACE = (items.getItem('Systeminfo_Net_Name').state || 'br0').toString();
var lines = Java.type('java.nio.file.Files').readAllLines(Java.type('java.nio.file.Paths').get('/proc/net/dev')).toArray();
var rx = NaN, tx = NaN;
for (var i = 0; i < lines.length; i++) {
  var l = String(lines[i]).trim();
  if (l.indexOf(IFACE + ':') === 0) { var f = l.substring(IFACE.length + 1).trim().split(/\s+/); rx = parseFloat(f[0]); tx = parseFloat(f[8]); }
}
var cur = { t: Date.now(), rx: rx, tx: tx };
var last = cache.private.get('netlast');
cache.private.put('netlast', cur);
if (last && !isNaN(rx) && !isNaN(tx) && cur.t > last.t) {
  var dt = (cur.t - last.t) / 1000;
  var down = Math.max(0, rx - last.rx) * 8 / 1000000 / dt;   // Mbit/s, a counter reset gives 0
  var up = Math.max(0, tx - last.tx) * 8 / 1000000 / dt;
  items.getItem('Systeminfo_Data_Rate_Down').postUpdate(down.toFixed(3) + ' Mbit/s');
  items.getItem('Systeminfo_Data_Rate_Up').postUpdate(up.toFixed(3) + ' Mbit/s');
}