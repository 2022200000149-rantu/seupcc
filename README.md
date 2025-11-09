# সাউথইস্ট বিশ্ববিদ্যালয় পূজা উদযাপন কমিটি
hosted at [https://seupcc.github.io](https://seupcc.github.io).
---

## Written By

[**Shree Rantu Samadder**](https://rantusamadder.github.io)  

---

## Overview

This is designed to serve as the digital landing platform for the organization, offering the following features:

### 1. News Wheel
- Dynamic scrolling news ticker at the top of the page.
- Content is fetched from a Google Sheet.
- Includes a **play/pause system** to have a text-to-speech assistant read the news items aloud.

### 2. Notices Section
- Displays multiple notices from the Google Sheet.
- Each notice includes:
  - Subject
  - Body
  - Optional registration link
- Users can send notices via email directly from the website to the registered students.
- Email sending can be scheduled based on:
  1. Every 108 seconds
  2. Every 108 minutes
  3. Every 108 hours
  4. Daily at 4:00 AM

### 3. Countdown Section
- Displays a countdown timer for special events such as **শ্রীশ্রী সরস্বতী পূজা**.
- Countdown target date is configurable from the Google Sheet.

### 4. Students Directory
- Student names, IDs, and emails are stored in a separate Google Sheet.
- Emails are automatically generated if not provided (`student_id@seu.edu.bd`).

### 5. Additional Features
- Fully integrated with Google Sheets for easy content updates.
- Automatic email notifications and TTS assistant for enhanced user engagement.
- Modular structure allows easy addition of subpages or updates to the current landing page.

---

## Technology Stack
- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Google Apps Script (for Google Sheet integration, email automation, and data fetching)
- **Hosting:** GitHub Pages

---

## Future Plans
- Add more subpages for events, gallery, registration, and updates.
- Extend the email system for personalized notifications.
- Enhance countdown and notice automation features.

---

## Getting Started
To replicate or contribute to this project:

_“May this system be a humble offering at the lotus feet of Shree Krishna and Goddess Saraswati.”_

1. Fork or clone this repository:  
   ```bash
   git clone https://github.com/seupcc/seupcc.github.io.git

  
