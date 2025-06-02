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

## Configuration: Setting up Google Calendar API Access

To enable the extension to access your Google Calendar, you need to set up an OAuth 2.0 Client ID. Follow these steps:

1.  **Go to Google Cloud Console:**
    Open your web browser and navigate to the [Google Cloud Console](https://console.cloud.google.com/).

2.  **Create or Select a Project:**
    *   If you don't have a project, create a new one by clicking the project selector at the top of the page and then "NEW PROJECT". Follow the on-screen instructions.
    *   If you have an existing project, select it from the project selector.

3.  **Enable Google Calendar API:**
    *   In the navigation menu (usually a hamburger icon ☰ on the left), go to "APIs & Services" > "Library".
    *   In the search bar, type "Google Calendar API" and press Enter.
    *   Click on "Google Calendar API" from the search results.
    *   Click the "Enable" button if it's not already enabled.

4.  **Navigate to Credentials:**
    *   In the navigation menu, go to "APIs & Services" > "Credentials".

5.  **Create OAuth Client ID:**
    *   Click the "+ CREATE CREDENTIALS" button at the top of the page.
    *   Select "OAuth client ID" from the dropdown menu.

6.  **Configure OAuth Consent Screen (if needed):**
    *   If you haven't configured the OAuth consent screen for this project, you'll be prompted to do so. Click "CONFIGURE CONSENT SCREEN".
    *   **User Type:** Choose "External" if you want users outside your organization to use this (common for personal projects or public extensions). Choose "Internal" if this is only for users within your Google Workspace organization.
    *   **App information:**
        *   **App name:** Enter a descriptive name (e.g., "Google Meet Auto-Opener Extension").
        *   **User support email:** Select your email address.
        *   **Developer contact information:** Enter your email address.
    *   Click "SAVE AND CONTINUE" through the "Scopes" and "Test users" sections (you don't need to add scopes or test users here; the extension will request scopes itself).
    *   Finally, click "BACK TO DASHBOARD" on the "Summary" page.
    *   You might need to go back to "APIs & Services" > "Credentials" and click "+ CREATE CREDENTIALS" > "OAuth client ID" again.

7.  **Create the OAuth Client ID for the Chrome Extension:**
    *   **Application type:** Select "Chrome App" from the dropdown.
    *   **Name:** Give your OAuth client ID a name (e.g., "Meet Auto-Opener Client").
    *   **Application ID:** This is crucial. You need to enter your Chrome Extension's ID here.
        *   To find your Extension ID:
            1.  Make sure you have loaded the extension into Chrome using the "Load unpacked" method described in the "How to Install/Load" section above.
            2.  Go to `chrome://extensions`.
            3.  Find your "Google Meet Auto-Opener" extension in the list.
            4.  The ID will be a long string of characters (e.g., `abcdefghijklmnopabcdefghijklmnop`). Copy this ID.
        *   Paste the copied Extension ID into the "Application ID" field in the Google Cloud Console.
    *   Click "CREATE".

8.  **Copy Your Client ID:**
    *   After successful creation, a dialog box will appear showing "Your Client ID".
    *   Copy this Client ID (it will look something like `YOUR_LONG_CLIENT_ID.apps.googleusercontent.com`).

9.  **Update `manifest.json`:**
    *   Open the `manifest.json` file located in your extension's directory.
    *   Find the `oauth2` section:
        ```json
        "oauth2": {
          "client_id": "YOUR_CLIENT_ID_HERE",
          "scopes": [
            "https://www.googleapis.com/auth/calendar.events.readonly"
          ]
        }
        ```
    *   Replace the placeholder `"YOUR_CLIENT_ID_HERE"` with the actual Client ID you copied from the Google Cloud Console.
    *   Save the `manifest.json` file.

After completing these steps and reloading your extension in `chrome://extensions` (if it was already loaded), it should be able to authenticate and access your Google Calendar events.

## Usage
1.  **Grant Permissions:**
    *   After installation and configuration, the extension will prompt you for permission to access your Google Calendar data when it first tries to fetch events. Ensure you grant the necessary permissions.

2.  **Configure Reminder Time:**
    *   Click on the extension's icon in the Chrome toolbar (you might need to pin it first from the puzzle-piece extensions menu).
    *   This will open the extension's options page.
    *   Set your preferred "reminder time" – this is how many minutes before a meeting's start time the Google Meet link will be automatically opened. Save your settings.

3.  **Automatic Operation:**
    *   The extension will then work in the background, periodically checking your Google Calendar for upcoming meetings with Google Meet links.
    *   When a meeting is due according to your configured reminder time, its Meet link will be automatically opened in a new tab.

## Privacy
This extension interacts with your Google Calendar data solely for the purpose of identifying and opening Google Meet links. Your data is processed locally by the extension and is not transmitted to any external servers other than Google's own services for Calendar and Meet access.
