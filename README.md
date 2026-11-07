# ASIF OS — Personal Workspace

ASIF OS is a lightweight, browser-based personal workspace for organising projects, focused tasks, study, client leads, notes and reusable AI prompts.

## Start using it

1. Extract the `ASIF-OS.zip` file into a folder.
2. Open the folder and double-click `index.html`.
3. The workspace opens in your browser. You can begin editing the starter records immediately.

For the most reliable local-app behaviour (including the optional offline cache), open the folder in VS Code and use the Live Server extension, or run a local server from the folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

## What's included

- **Overview:** task and project summary, quick capture and a 25-minute focus timer.
- **Focus & Tasks:** create, edit, filter, complete and delete tasks; assign tasks to projects.
- **Projects:** create projects, set status and manually track progress.
- **Study Center:** maintain subjects, log study sessions and update mastery progress.
- **Client Pipeline:** track prospects through Contacted, Negotiating, Won and Lost stages.
- **Notes & Ideas:** save and edit short notes.
- **Prompt Lab:** keep reusable AI prompts and copy them to the clipboard.
- **Weekly review:** record wins, blockers and next week's priorities.
- **Settings:** switch themes, export a JSON backup, import a backup or reset the workspace.

## Data and privacy

- Records are stored in the browser's `localStorage` on the device and browser profile where you use ASIF OS.
- There is no sign-in, cloud sync, server database, AI API call or external analytics in this version.
- Export a backup regularly from **Settings → Export backup**. Clearing browser data can erase this workspace.
- If you use multiple browsers or devices, each has its own separate local copy unless you manually move backups.

## Current scope and next stage

This is a functional local MVP, not yet a hosted multi-device product. The Prompt Lab stores prompts; it does not send them to an AI model. Client records are a lightweight personal pipeline, not a full CRM. GitHub publishing, Supabase sync, authentication, AI API integrations and automated workflows are not connected in this version.
