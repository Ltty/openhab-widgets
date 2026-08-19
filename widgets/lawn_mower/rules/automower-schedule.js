// Automower Schedule Rule — JS Scripting (GraalJS / openhab-js)
//
// Trigger: ItemStateChangeTrigger on your AutomowerSchedule NAND group item.
//
// When the group goes OFF (any guard is active), the mower parks.
// When the group goes ON (all guards clear), the mower resumes — unless it is
// a weekend or bank holiday, in which case it also parks.
//
// Setup:
//   1. Create this as a JS Scripting rule in Settings → Rules → + (Code tab)
//   2. Add trigger: "Item AutomowerSchedule changed"
//   3. Replace THING_UID below with your automower Thing UID
//      (find it in Settings → Things → your mower → copy UID from URL bar)

const THING_UID = "automower:automower:BRIDGE:THING"; // ← replace this

const mowerActions = actions.thingActions("automower", THING_UID);
const scheduleState = event.itemState.toString();

if (scheduleState === "OFF") {
  // A guard is active — park until further notice
  mowerActions.parkUntilFurtherNotice();
} else if (actions.Ephemeris.isWeekend() || actions.Ephemeris.isBankHoliday()) {
  // All guards clear but it's a rest day — still park
  mowerActions.parkUntilFurtherNotice();
} else {
  // All guards clear and it's a working day — resume schedule
  mowerActions.resumeSchedule();
}
