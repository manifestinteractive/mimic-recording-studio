Mimic Recording Studio
---

This fork of [Mycrofts Mimic Recording Studio](https://github.com/MycroftAI/mimic-recording-studio) is built specifically for my personal project [Mimic My Voice](https://github.com/manifestinteractive/mimic-my-voice) and is brought in automatically during that projects setup process.

What's Different
===

> Here are the changes I have made in this repository, some of which I would consider to be breaking changes for those used to the original project.

- [X] Refactored to work with [Mimic My Voice](https://github.com/manifestinteractive/mimic-my-voice) Automated Setup Process
- [X] Removed UUID & Name Requirements from App.  Having different UUID's made it impossible to Backup and Restore Recordings on Different Browsers or Computers
- [X] Added Visual Error Handling to Recording Process
- [X] Removed LocalStorage requirements since it was no longer needed
- [X] Restyle to look more modern and work on smaller screens
- [X] Improved User Experience with Recording Process
- [X] Add Confirmation Process when Recording Over current recording ( this drove me crazy )
- [X] Removed Keyboard Triggers as Space Bar is actually an ADA toggle for buttons
- [X] Replaced Keyboard Shortcuts with Clickable Buttons to prevent Keyboard Requirement
- [X] Updated to make new and existing buttons ADA compliant
- [X] Removed Intro Screen since I personally did not feel it was necessary for this kind of installation
- [X] Fixed JavaScript Error with Recording and Incorrect Blob React Prop-Type

So, you probably do not want THIS version of the Mimic Recording Studio, unless you are a developer working with the [Mimic My Voice](https://github.com/manifestinteractive/mimic-my-voice) project.
