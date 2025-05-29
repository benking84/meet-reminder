// Saves options to chrome.storage.sync.
function save_options() {
  const reminderTime = document.getElementById('reminderTime').value;
  chrome.storage.sync.set({
    reminderMinutes: parseInt(reminderTime, 10)
  }, function() {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.sync.
function restore_options() {
  // Default to 5 minutes if nothing is set.
  chrome.storage.sync.get({
    reminderMinutes: 5 
  }, function(items) {
    document.getElementById('reminderTime').value = items.reminderMinutes;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
