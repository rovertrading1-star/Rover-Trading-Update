# Rover Trading — Video Library

Four narrated videos, all recorded from the live site: three cuts of the website walkthrough plus a deep dive into how learning works inside the student portal.

| File | Format | Length | Size | Use it for |
| --- | --- | --- | --- | --- |
| `rover-trading-walkthrough.mp4` | 1920×1080 (16:9) | 2:58 | 9.5 MB | Website hero, YouTube, course page, email |
| `rover-trading-60s.mp4` | 1920×1080 (16:9) | 1:02 | 4.8 MB | Facebook, LinkedIn, YouTube pre-roll, X |
| `rover-trading-60s-vertical.mp4` | 1080×1920 (9:16) | 1:02 | 8.0 MB | TikTok, Instagram Reels, YouTube Shorts |
| `rover-trading-learning-guide.mp4` | 1920×1080 (16:9) | 2:28 | 8.7 MB | Explaining the portal to enrolled or paying students |
| `rover-trading-walkthrough.srt` | captions | — | 3 KB | Subtitles for the full walkthrough (20 cues) |
| `rover-trading-60s.srt` | captions | — | 1.4 KB | Subtitles for both 60-second cuts (18 cues) |
| `rover-trading-learning-guide.srt` | captions | — | 1.5 KB | Subtitles for the learning guide (16 cues) |
| `thumbnail.jpg` | 1920×1080 | — | 122 KB | Poster frame for the full walkthrough |
| `thumbnail-60s.jpg` | 1920×1080 | — | 127 KB | Poster frame for the 60-second cut |
| `thumbnail-vertical.jpg` | 1080×1920 | — | 112 KB | Cover frame for TikTok / Reels / Shorts |
| `thumbnail-learning.jpg` | 1920×1080 | — | 139 KB | Poster frame for the learning guide |
| `script.md` | — | — | 3 KB | Full walkthrough shot list + narration script |

## The 60-second cuts

Both 60-second versions share the same voice-over and run in the same order, so you can post them side by side:

| Time | Beat |
| --- | --- |
| 0:00 | Hero and price action lab |
| 0:14 | Three-chapter curriculum |
| 0:21 | Book edition and pricing |
| 0:29 | Timetable, reviews, terms, contact |
| 0:39 | Sign-up, login, student dashboard |
| 0:49 | Admin portal and sign-off |

The vertical cut is a real 9:16 edit, not a cropped landscape video: page sections are reframed as
floating cards on the brand background with a slow camera pan, chapter labels at the top and
**burned-in captions** at the bottom, so it reads with the sound off.

## How learning works (the learning guide)

`rover-trading-learning-guide.mp4` answers the question students ask most: *what do I actually get,
and when?* It walks the whole chain in one take — payment, approval, the live Zoom class, progress
tracking and the protected notes — with a burned-in chapter label for every step.

| Time | Chapter | What is on screen |
| --- | --- | --- |
| 0:00 | The learning flow | Student dashboard: account info and the three-step path |
| 0:23 | Payment & proof of payment | ABSA banking details, your student number as reference, the POP upload form |
| 0:42 | Approval unlocks the portal | Admin POP review, then the locked-screen state before approval |
| 0:59 | The live Zoom lesson | Live lesson card: date and time, meeting ID, passcode, instructor, Join button |
| 1:18 | Progress tracking | 75% complete bar, chapter-by-chapter verification and instructor feedback |
| 1:36 | Published course notes | The protected in-app reader, chapter tabs and watermark, then the admin publisher |
| 1:57 | Admin controls | Zoom links, student progress monitoring, the document manager |
| 2:13 | One portal, every step | Recap and sign-off |

Two rules worth knowing when you talk over this video:

- **The Zoom link is not a static link.** It is generated from whatever lecture the admin has
  scheduled in *Zoom Meeting Links* — the card on the student dashboard shows that lecture's topic,
  slot, meeting ID and passcode, and the Join button points at it.
- **Notes are gated, not public.** Documents are published from *Learning Document Manager*, and a
  student only reaches them once their payment is `paid` or their application is `accepted`. The
  reader is watermarked and read-only.

## Posting tips

- **TikTok / Reels / Shorts:** upload `rover-trading-60s-vertical.mp4` with `thumbnail-vertical.jpg` as the cover. The captions are already burned in, so no SRT is needed.
- **YouTube / Facebook / LinkedIn:** upload a 16:9 file and attach the `.srt` so viewers can toggle captions.
- **Website embed:**
  ```html
  <video controls poster="video/thumbnail-60s.jpg">
    <source src="video/rover-trading-60s.mp4" type="video/mp4" />
    <track kind="captions" src="video/rover-trading-60s.srt" srclang="en" label="English" default />
  </video>
  ```
- **Explaining the portal:** send `rover-trading-learning-guide.mp4` to applicants who have paid but
  have not logged in yet, or embed it above the pricing section.
- All files are under 10 MB, so they send fine over WhatsApp and email.
