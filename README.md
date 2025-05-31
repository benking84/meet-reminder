# Google Meet Auto-Opener Chrome Extension

## Description
This Chrome extension automatically opens Google Meet links from your upcoming Google Calendar events in a new tab just before the meeting starts. It helps you join your meetings on time without manually checking your calendar and clicking links.

## Features
*   Automatically fetches upcoming Google Calendar events.
*   Identifies Google Meet links within the event descriptions or designated conference data.
*   Opens the Google Meet link in a new tab at a user-configurable time before the scheduled meeting.
*   Provides an options page to set the reminder offset (how many minutes before the meeting the link should open).
*   Requests necessary permissions for Google Calendar access via Chrome Identity API.

## How to Install/Load
1.  **Clone this repository:**
    ```bash
    git clone https://github.com/yourusername/google-meet-auto-opener.git
    ```
    (Replace the URL with the actual repository URL if available.)

2.  **Open Google Chrome:**
    Navigate to `chrome://extensions` in your Chrome browser.

3.  **Enable Developer Mode:**
    Ensure the "Developer mode" toggle switch (usually located in the top right corner of the extensions page) is enabled.

4.  **Load the Extension:**
    *   Click the "Load unpacked" button.
    *   In the file dialog that appears, select the directory where you cloned or downloaded the extension files (e.g., the `google-meet-auto-opener` directory).

## Usage
1.  **Grant Permissions:**
    *   After installation, the extension might prompt you for permission to access your Google Calendar data when it first tries to fetch events, or you might need to trigger this by opening its options page. Ensure you grant the necessary permissions for it to function correctly.

2.  **Configure Reminder Time:**
    *   Click on the extension's icon in the Chrome toolbar (you might need to pin it first from the puzzle-piece extensions menu).
    *   This will open the extension's options page.
    *   Set your preferred "reminder time" – this is how many minutes before a meeting's start time the Google Meet link will be automatically opened. Save your settings.

3.  **Automatic Operation:**
    *   The extension will then work in the background, periodically checking your Google Calendar for upcoming meetings with Google Meet links.
    *   When a meeting is due according to your configured reminder time, its Meet link will be automatically opened in a new tab.

## Privacy
This extension interacts with your Google Calendar data solely for the purpose of identifying and opening Google Meet links. Your data is processed locally by the extension and is not transmitted to any external servers other than Google's own services for Calendar and Meet access.
