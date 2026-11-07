# Rover Trading — Video Library

Three cuts of the same website walkthrough, all recorded from the live site.

| File | Format | Length | Size | Use it for |
| --- | --- | --- | --- | --- |
| `rover-trading-walkthrough.mp4` | 1920×1080 (16:9) | 2:58 | 9.5 MB | Website hero, YouTube, course page, email |
| `rover-trading-60s.mp4` | 1920×1080 (16:9) | 1:02 | 4.8 MB | Facebook, LinkedIn, YouTube pre-roll, X |
| `rover-trading-60s-vertical.mp4` | 1080×1920 (9:16) | 1:02 | 8.0 MB | TikTok, Instagram Reels, YouTube Shorts |
| `rover-trading-walkthrough.srt` | captions | — | 3 KB | Subtitles for the full walkthrough (20 cues) |
| `rover-trading-60s.srt` | captions | — | 1.4 KB | Subtitles for both 60-second cuts (18 cues) |
| `thumbnail.jpg` | 1920×1080 | — | 122 KB | Poster frame for the full walkthrough |
| `thumbnail-60s.jpg` | 1920×1080 | — | 127 KB | Poster frame for the 60-second cut |
| `thumbnail-vertical.jpg` | 1080×1920 | — | 112 KB | Cover frame for TikTok / Reels / Shorts |
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
- All files are under 10 MB, so they send fine over WhatsApp and email.
