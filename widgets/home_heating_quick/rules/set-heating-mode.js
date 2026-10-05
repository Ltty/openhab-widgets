// Set Heating Mode — maps commands on the widget's commandItem to ATAG ONE Thing Actions (atagone binding).
// Rule trigger: "Item <commandItem> received a command". Action: Run Script → ECMAScript 262 Edition 11 (JS Scripting).
// Commands: fireplacemorning | vacation<days> | cancel | auto | fireplace<h> | extend<min>
var THING = 'atagone:thermostat:YOUR_THING_ID'; // Settings → Things → ATAG ONE → Thing UID
var MODE_ITEM = 'YOUR_MODE_ITEM';               // same item as the widget's modeItem prop
var MORNING_HOUR = 7; // 'fireplacemorning' runs until the next MORNING_HOUR:00 (ATAG needs whole hours, max 24)
var TIMED_MODES = ['fireplace', 'holiday', 'extend'];
var cmd = event.itemCommand.toString();
var a = actions.thingActions('atagone', THING);
var m;
try {
  if (cmd === 'fireplacemorning') {
    var now = new Date();
    var target = new Date(now.getTime());
    target.setHours(MORNING_HOUR, 0, 0, 0);
    if (target.getTime() - now.getTime() < 3600000) { target.setDate(target.getDate() + 1); }
    var hours = Math.min(24, Math.max(1, Math.ceil((target.getTime() - now.getTime()) / 3600000 - 0.05)));
    a.activateFireplace(hours * 3600);
  } else if (cmd === 'cancel') {
    // Only for timed modes: cancelMode() on manual (summer hold) would flip the boiler back to schedule mode.
    var mode = items.getItem(MODE_ITEM).state.toString();
    if (TIMED_MODES.indexOf(mode) < 0) {
      console.warn('[HeatingQuick] cancel ignored, mode is ' + mode);
    } else if (a.cancelMode()) {
      // cancelling fireplace mode must be confirmed on the thermostat display
      actions.notificationBuilder('Press a button on the thermostat display to confirm cancelling fireplace mode.')
        .withIcon('f7:flame').withTag('info').withTitle('Heating').send();
    }
  } else if (cmd === 'auto') {
    items.getItem(MODE_ITEM).sendCommand('auto');
  } else if ((m = /^fireplace(\d+)$/.exec(cmd))) {
    a.activateFireplace(parseInt(m[1], 10) * 3600);
  } else if ((m = /^vacation(\d+)$/.exec(cmd))) {
    a.activateVacation(parseInt(m[1], 10) * 86400);
  } else if ((m = /^extend(\d+)$/.exec(cmd))) {
    a.activateExtend(parseInt(m[1], 10) * 60);
  } else {
    console.warn('[HeatingQuick] Unknown command: ' + cmd);
  }
} catch (e) {
  console.error('[HeatingQuick] ' + cmd + ' failed: ' + e);
}
