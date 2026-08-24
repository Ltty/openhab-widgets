// Automower synthetic status rule
// Creates three proxy items that the lawn_mower widget can display for richer status detail,
// including work area progress (e.g. "87% done in House North").
//
// Setup:
//   1. Create these three items (see items/automower.items for the pattern):
//        String  Automower_Summary_Status  "Summary Status"
//        String  Automower_Summary_Detail  "Summary Detail"
//        Number:Length  Automower_Current_Cutting_Height  "Cutting Height [%d cm]"
//   2. Create a rule with triggers on every status/activity/state change plus a cron at 0 * * * * ? *
//   3. Paste this script as the rule action
//   4. Update BASE_PREFIX and WORK_AREA_TAG to match your item naming and tag setup
//
// Adapted from https://community.openhab.org/t/automower-control-page/167898
// Original author credit: community contributor at the link above

// =========================================================================
// CONFIGURATION — adjust to match your installation
// =========================================================================
var BASE_PREFIX   = "Automower";              // prefix used in your items file
var WORK_AREA_TAG = "AutomowerWorkAreas";     // tag on each work-area parent group

// =========================================================================
// ITEM STATE RETRIEVAL
// =========================================================================
var state          = items.getItem(BASE_PREFIX + "_State").state;
var activity       = items.getItem(BASE_PREFIX + "_Activity").state;
var mode           = items.getItem(BASE_PREFIX + "_Mode").state;
var inactiveReason = items.getItem(BASE_PREFIX + "_Inactive_Reason").state || "NONE";
var nextStartRaw   = items.getItem(BASE_PREFIX + "_Next_Start").state;
var errorMessage   = items.getItem(BASE_PREFIX + "_Error_Message").state || "NULL";
var errorCode      = items.getItem(BASE_PREFIX + "_Error_Code").state || "NULL";
var activeAreaName = items.getItem(BASE_PREFIX + "_WorkAreaName").state;
var globalHeight   = items.getItem(BASE_PREFIX + "_Cutting_Height").state;

var mainStatus = "Unknown";
var mainDetail = "";

// =========================================================================
// WORK AREA PROGRESS & CUTTING HEIGHT LOOKUP
// =========================================================================
var activeProgress = null;
var activeHeight   = null;

if (activeAreaName && activeAreaName !== "NULL" && activeAreaName !== "UNDEF") {
    var areaItems = items.getItemsByTag(WORK_AREA_TAG);
    for (var i = 0; i < areaItems.length; i++) {
        var areaBase = areaItems[i].name;
        var nameItem = areaBase + "_Name";
        try {
            if (items.getItem(nameItem).state === activeAreaName) {
                var progState   = items.getItem(areaBase + "_Progress").state;
                var heightState = items.getItem(areaBase + "_Cutting_Height").state;
                if (progState !== "NULL" && progState !== "UNDEF") activeProgress = progState;
                if (heightState !== "NULL" && heightState !== "UNDEF") activeHeight = heightState;
                break;
            }
        } catch (e) { /* item may not exist for this area */ }
    }
}

var currentCuttingHeight = activeHeight || globalHeight || "NULL";

// =========================================================================
// NEXT START FORMATTING
// =========================================================================
var nextStartText = "Until further notice";

if (nextStartRaw && nextStartRaw !== "NULL" && nextStartRaw !== "UNDEF" && nextStartRaw !== "") {
    var cleanStr = nextStartRaw.toString().replace(' ', 'T');
    var nextDate = new Date(cleanStr);

    if (!isNaN(nextDate.getTime())) {
        var now = new Date();
        var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var targetStart = new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());
        var diffDays = Math.round((targetStart - todayStart) / (1000 * 60 * 60 * 24));

        var hours   = nextDate.getHours().toString().padStart(2, '0');
        var minutes = nextDate.getMinutes().toString().padStart(2, '0');
        var timeStr = hours + ":" + minutes;

        if (diffDays === 0) {
            nextStartText = "Next start today at " + timeStr;
        } else if (diffDays === 1) {
            nextStartText = "Next start tomorrow at " + timeStr;
        } else {
            var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            nextStartText = "Next start " + days[nextDate.getDay()] + " " + timeStr;
        }
    }
}

// =========================================================================
// STATUS EVALUATION
// =========================================================================

if (state === "ERROR" || state === "FATAL_ERROR") {
    mainStatus = "Error";
    mainDetail = (errorMessage && errorMessage !== "NULL" && errorMessage !== "UNDEF" && errorMessage !== "")
        ? errorMessage
        : (errorCode && errorCode !== "NULL" && errorCode !== "UNDEF" && errorCode !== "")
            ? "Error code: " + errorCode
            : "Check mower console";

} else if (state === "STOPPED" || activity === "STOPPED_IN_GARDEN") {
    mainStatus = "Stopped";
    mainDetail = "Stopped in garden";

} else if (state === "PAUSED") {
    mainStatus = "Paused";
    mainDetail = "Manual pause";

} else if (inactiveReason === "PLANNING" || inactiveReason === "SEARCHING_FOR_SATELLITES" || activity === "NOT_APPLICABLE") {
    mainStatus = "Planning";
    mainDetail = (inactiveReason === "SEARCHING_FOR_SATELLITES") ? "Acquiring satellite signal" : "Preparing & calculating path";

} else if (activity === "LEAVING") {
    mainStatus = "On the Way";
    mainDetail = (activeAreaName && activeAreaName !== "NULL" && activeAreaName !== "UNDEF")
        ? "Going to " + activeAreaName
        : "Going to work area";

} else if (activity === "GOING_HOME") {
    mainStatus = "Going Home";
    mainDetail = "Going to charging station";

} else if (activity === "CHARGING") {
    mainStatus = "Charging";
    mainDetail = (nextStartRaw && nextStartRaw !== "NULL" && nextStartRaw !== "UNDEF" && nextStartRaw !== "")
        ? nextStartText
        : "Charging battery";

} else if (state === "RESTRICTED_PARK_OVERRIDE" || state === "RESTRICTED_WEEK_SCHEDULE" || activity === "PARKED_IN_CS" || mode === "HOME") {
    mainStatus = "Parked";
    mainDetail = (state === "RESTRICTED_FROST") ? "Frost guard active"
        : (state === "RESTRICTED_SENSOR") ? "Weather timer active"
        : nextStartText;

} else if (activity === "MOWING") {
    mainStatus = "Mowing";
    if (activeAreaName && activeAreaName !== "NULL" && activeAreaName !== "UNDEF") {
        mainDetail = (activeProgress !== null && activeProgress !== "")
            ? activeProgress + " done in " + activeAreaName
            : "Cutting " + activeAreaName;
    } else {
        mainDetail = (mode === "SECONDARY_AREA") ? "Cutting secondary area" : "Cutting main area";
    }

} else {
    mainStatus = (state === "IN_OPERATION") ? "Planning" : state;
    mainDetail = (activity !== "NULL" && activity !== "NOT_APPLICABLE") ? activity.replace(/_/g, ' ') : "Updating status...";
}

// =========================================================================
// POST UPDATES
// =========================================================================
items.getItem(BASE_PREFIX + "_Summary_Status").postUpdate(mainStatus);
items.getItem(BASE_PREFIX + "_Summary_Detail").postUpdate(mainDetail);
items.getItem(BASE_PREFIX + "_Current_Cutting_Height").postUpdate(currentCuttingHeight);
