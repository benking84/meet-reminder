// Fetches calendar events and sets alarms for upcoming meetings
function fetchCalendarEvents(token) {
  const timeMin = new Date().toISOString();
  // Attempt to filter for events with Google Meet links directly in the query.
  // We will also need to check for the 'hangoutLink' property in the response items.
  const params = new URLSearchParams({
    timeMin: timeMin,
    maxResults: '10', // Consider making this configurable or fetching more
    singleEvents: 'true',
    orderBy: 'startTime',
    // q: 'meet.google.com' // Keep this to pre-filter, but primary filter is hangoutLink
  });
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`;

  fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (!response.ok) {
      // If token is invalid (e.g., revoked), try to re-authenticate interactively
      if (response.status === 401) {
        console.warn('Authorization error (401). Attempting to re-authenticate.');
        getAuthToken(true); // Force interactive auth
        return Promise.reject(new Error('Token expired or revoked. Re-authentication initiated.'));
      }
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Raw calendar events:', data.items);
    const meetEvents = (data.items || []).filter(event => 
      event.hangoutLink && 
      event.status !== 'cancelled' &&
      (event.start.dateTime || event.start.date) // Ensure there's a start time
    );

    console.log('Events with Google Meet links after filtering:', meetEvents);

    chrome.storage.sync.get({ reminderMinutes: 0 }, (settings) => { // Default to 0 minutes
      const reminderOffsetMs = settings.reminderMinutes * 60 * 1000;
      console.log(`Using reminder offset: ${settings.reminderMinutes} minutes (${reminderOffsetMs}ms)`);

      meetEvents.forEach(event => {
        try {
          const eventStartTimeMs = new Date(event.start.dateTime || event.start.date).getTime();
          const currentTimeMs = Date.now();
          const alarmName = `gmeet-opener-meeting-${event.id}`; // Using the prefix from previous step

          // Calculate when the reminder alarm should ideally fire
          let intendedAlarmTimeMs = eventStartTimeMs - reminderOffsetMs;

          // Only schedule if the original meeting start time is in the future
          if (eventStartTimeMs > currentTimeMs) {
            // If the calculated reminder time is now or in the past,
            // but the meeting is still in the future, schedule it to open ASAP (e.g., in a few seconds).
            // Otherwise, use the calculated reminder time.
            const scheduleTimeMs = Math.max(currentTimeMs + 2000, intendedAlarmTimeMs); // At least 2s in future

            chrome.storage.local.set({
              [alarmName]: {
                meetLink: event.hangoutLink,
                title: event.summary || 'Untitled Meeting',
                startTime: eventStartTimeMs,
                // Store the intended opening time based on reminder for clarity if needed
                intendedOpenTime: intendedAlarmTimeMs 
              }
            }, () => {
              if (chrome.runtime.lastError) {
                console.error(`Error saving meeting details for alarm ${alarmName}:`, chrome.runtime.lastError.message);
                return;
              }
              chrome.alarms.create(alarmName, { when: scheduleTimeMs });
              console.log(`Alarm set for "${event.summary || 'Untitled Meeting'}" - scheduled at ${new Date(scheduleTimeMs).toLocaleString()} (meeting at ${new Date(eventStartTimeMs).toLocaleString()})`);
            });
          } else {
            // console.log(`Event "${event.summary || 'Untitled Meeting'}" (ID: ${event.id}) is in the past. Not scheduling.`);
          }
        } catch (e) {
          console.error(`Error processing event ${event.id} ("${event.summary || 'Untitled Meeting'}") for alarm scheduling:`, e);
        }
      });
    });
  })
  .catch(error => {
    // This will catch errors from the fetch itself, or if .json() fails.
    // Errors inside the .then() before the forEach, or within sync.get's callback if not handled, might not be caught here.
    console.error('Error fetching calendar events or initial processing:', error.message);
  });
}

// Handles OAuth token retrieval
function getAuthToken(interactive = true) {
  chrome.identity.getAuthToken({ interactive: interactive }, function(token) {
    if (chrome.runtime.lastError) {
      console.error('Error getting auth token:', chrome.runtime.lastError.message);
      // Example: If non-interactive fails, maybe notify user or disable functionality
      // For now, we just log it.
      return;
    }
    console.log('Successfully obtained OAuth token.');
    fetchCalendarEvents(token);
  });
}

// Alarm Listener
chrome.alarms.onAlarm.addListener(async (alarm) => {
  console.log('Alarm fired:', alarm.name);

  if (alarm.name === 'fetchCalendarDataPeriodic') { // Updated alarm name for clarity
    console.log('Periodic alarm: Fetching new calendar data...');
    getAuthToken(false); // Non-interactive
  } else if (alarm.name.startsWith('gmeet-opener-meeting-')) {
    chrome.storage.local.get(alarm.name, (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving meeting data from storage for alarm', alarm.name, ':', chrome.runtime.lastError.message);
        return;
      }
      const meetingData = result[alarm.name];
      if (meetingData && meetingData.meetLink) {
        console.log(`Opening Meet link for "${meetingData.title}" (alarm: ${alarm.name}): ${meetingData.meetLink}`);
        chrome.tabs.create({ url: meetingData.meetLink });
        
        // Clean up the storage for this meeting
        chrome.storage.local.remove(alarm.name, () => {
          if (chrome.runtime.lastError) {
            console.error('Error removing meeting data from storage for alarm', alarm.name, ':', chrome.runtime.lastError.message);
          } else {
            console.log(`Cleaned up storage for alarm ${alarm.name}`);
          }
        });
      } else {
        console.warn(`No meeting data found for alarm ${alarm.name}. It might have been processed, data was not stored, or an error occurred.`);
      }
    });
  }
});

// Setup periodic fetching
function setupPeriodicFetch() {
  const alarmName = 'fetchCalendarDataPeriodic'; // Consistent naming
  // Check if alarm already exists to avoid duplicates or resetting its schedule unnecessarily
  chrome.alarms.get(alarmName, (existingAlarm) => {
    if (existingAlarm) {
      console.log(`Periodic fetch alarm "${alarmName}" already exists. Scheduled for ${new Date(existingAlarm.scheduledTime).toLocaleString()}`);
    } else {
      console.log(`Setting up periodic calendar data fetch alarm "${alarmName}" (every 60 minutes, starting in 1 min).`);
      chrome.alarms.create(alarmName, {
        delayInMinutes: 1, // Start after 1 minute
        periodInMinutes: 60 // Repeat every 60 minutes
      });
    }
  });
}

// Extension lifecycle event listeners
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
  // On first install, clear any potentially stale alarms or storage from previous dev versions
  if (details.reason === 'install') {
    console.log('First install. Clearing all alarms and storage.');
    chrome.alarms.getAll(alarms => {
        alarms.forEach(alarm => {
            if (alarm.name.startsWith('gmeet-opener-') || alarm.name === 'fetchCalendarDataPeriodic') {
                chrome.alarms.clear(alarm.name);
            }
        });
    });
    chrome.storage.local.clear(() => {
        console.log('Storage cleared on first install.');
        // Now proceed with initial setup
        getAuthToken(true); // Initial auth & fetch
        setupPeriodicFetch();
    });
  } else if (details.reason === 'update') {
    console.log('Extension updated to version', chrome.runtime.getManifest().version);
    // Potentially handle updates, like migrating storage or re-setting alarms
    getAuthToken(false); // Fetch on update
    setupPeriodicFetch(); // Ensure periodic fetch is still scheduled
  }
});

chrome.runtime.onStartup.addListener(() => {
  console.log('Browser startup.');
  // Ensure periodic alarm is set (it might have been cleared if browser crashed or was force-quit)
  setupPeriodicFetch(); // This function now checks if alarm already exists
  // Initial fetch on startup as well
  getAuthToken(false); 
});

console.log("Background script loaded and listeners registered."); // Helps confirm script is running
