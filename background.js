// Create an alarm to wake up 1 minute before the desired time

const desiredHours = 19;
const desiredMinutes = 53;
const desiredSeconds = 0;

chrome.alarms.create("prepareRefresh", { when: calculateNextAlarmTime() });

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log(alarm);
  if (alarm.name === "prepareRefresh") {
    let checkInterval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === desiredHours && now.getMinutes() === desiredMinutes && now.getSeconds() === desiredSeconds) {
        refreshAllTabs();
        clearInterval(checkInterval);
        chrome.alarms.create("prepareRefresh", { when: calculateNextAlarmTime() });
      }
    }, 200);
  }
});

function refreshAllTabs() {
  console.log("reload called")
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      chrome.tabs.reload(tab.id);
    });
  });
}

function calculateNextAlarmTime() {
  const now = new Date();
  let target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), desiredHours, desiredMinutes - 1, 0, 0);

  if (target.getTime() < now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  console.log(target);
  console.log(target.getTime());
  return target.getTime();
}
