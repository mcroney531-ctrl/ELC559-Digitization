# "Rewind" — Media Digitization Desk
### E-Learning Challenge #559 — Storyline Web Object Script
Canvas: 1980×1020 (embedded as a Storyline web object)

---

## FRAMING / PREMISE

You're a volunteer at the **Maple Street Public Library — Media Digitization Desk**, a free public service where patrons bring in personal VHS tapes to have them transferred to digital files while they wait. Two patrons come in during your shift. Your job: run the equipment correctly, and know when a tape is eligible for duplication.

---

## SCENE 0 — Intro Screen

**Visual:** Library media desk backdrop — VCR, capture dongle, monitor, cable spaghetti, a "Digitization Desk" sign, patron queue line implied off-screen.

**On-screen text:**
> **Media Digitization Desk**
> Maple Street Public Library
>
> Patrons can have personal home videos digitized for free — subject to library copyright policy. Run the equipment, greet your patrons, and use good judgment.

**Button:** `[ Start Shift ]`

---

## SCENE 1 — Patron 1: Carol Whitfield (Home Video)

**Beat 1.1 — Arrival**
*Carol approaches the desk holding a labeled VHS tape.*

**Carol (dialogue bubble):**
> "Hi — I'd love to get this digitized if possible. It's a recording I made of my college graduation. We had a pretty well-known speaker that year, so I want to make sure it survives!"

**Tape label (close-up inset):** *"Carol's Graduation — Ridgeline University, 1998"* (handwritten)

**Prompt:** `[ Take the tape ]`

**Micro-decision (optional, light-touch):**
> "Is this tape eligible for duplication?"
- ✅ *Yes — this is Carol's own personal recording of an event she attended.* → brief affirming toast: "Correct — personal recordings are always eligible." → proceeds
- ❌ *Not sure, ask a supervisor* → gentle nudge: "You don't need to escalate this one — it's clearly Carol's own footage. Let's get started." → proceeds anyway

*(Keep this light — it's here to plant the eligibility question early, not to slow the player down.)*

---

**Beat 1.2 — The Procedure (full walkthrough)**

Each step is a hotspot/interaction on the AV cart graphic. Numbered callouts appear sequentially (only the current step is active/glowing).

| # | Step | Interaction | Success feedback | Error state (if wrong) |
|---|------|-------------|-------------------|--------------------------|
| 1 | Insert tape into VCR | Click the tape waiting on the desk; it slides into the slot, label-up | Tape slides in, clunk sound, counter lights up | — |
| 2 | Check the tape counter — is it rewound? Press **Rewind** | Click Rewind button | Counter animates down to "0000," click sound | — |
| 3 | Check cable connections | All three cords sit connected but dimmed — check each against its port, then click each outlet to confirm | Confirmed outlet turns to a ✓ and its cord lights up with a glow; chime when all three are confirmed | — (the visual check *is* the task; hookup-guide popover on hover/tap for reference) |
| 4 | Power on VCR and capture device | Click both power buttons | LEDs light up | — |
| 5 | Open the capture software | Click correct desktop icon among 3–4 decoys (e.g. "ClipCatch Capture" vs. photo editor, email, browser) | Software window opens | Wrong icon: *"Not quite — that's not the capture software."* |
| 6 | Select input source & format | Dropdown: choose "Composite In" + "NTSC" from a short list | Preview window activates | Wrong format selected: *"Picture looks wrong — check the video standard."* (preview shows static/garbled) |
| 7 | Preview & adjust tracking | Drag tracking slider until picture stabilizes (starts rolling/staticky) | Picture locks in clean | — |
| 8 | Start capture — correct order | Must click **Record** (software) *then* **Play** (VCR) | Recording indicator + waveform starts | If Play clicked first: *"You just recorded blank leader — hit Record first next time."* (auto-corrects, minor time cost) |
| 9 | Let it run / Stop | Progress bar fast-forwards (montage); **Stop** unlocks and pulses when the bar completes, and the player must click it | "Capture complete" chime | — |
| 10 | Save the file | Filename pre-filled: `Whitfield_Graduation_1998.mp4` → click **Save** to `Patron Digitization Requests` folder | Save confirmation | — |
| 11 | Eject and return | Click **Eject**, hand tape + printed claim ticket back to Carol | — | — |

**Carol (closing line):**
> "Thank you so much — this means a lot. My mom's going to cry when she sees this."

**Transition:** Screen wipes / "Next Patron" prompt.

---

## SCENE 2 — Patron 2: Gary Pruitt (Copyrighted Media)

**Beat 2.1 — Arrival**
*Gary approaches with an unlabeled (or vaguely labeled) tape.*

**Tape label (close-up inset):** *"Speech Night"* (faded ballpoint, no date)

**Gary (dialogue bubble):**
> "Hey, could you copy this one too? It's just an old recording of a speech — my dad would love a copy for his birthday."

**Prompt:** `[ Take the tape ]`

---

**Beat 2.2 — Abbreviated Procedure**

To keep pacing tight, compress the steps already taught. Clicking the tape to insert it triggers a quick automated setup sequence (cables already connected from last time → power on → software already open → select input) in ~1.5 seconds, since the player already demonstrated mastery in Scene 1.

**Then, manually:**
1. Player clicks **Rewind** (the one meaningful action left)
2. **Rewind stops — playback preview shows:**

> 🚨 **FBI ANTI-PIRACY WARNING CARD** (original design, not the real seal)
>
> *"UNAUTHORIZED REPRODUCTION OF THIS RECORDING IS PROHIBITED"*
>
> — screen holds for a beat, then cuts to a network broadcast: a title card reading **"AMERICAN VOICES: Great Speeches of Our Time"** with a "Heritage Network" bug in the corner, followed by a few seconds of a polished, professionally-shot podium speech (clearly not home-camcorder footage — different framing, network graphics/lower-third with speaker's name and title).

**On-screen prompt (this is the discovery moment — no dialogue needed, just the visual):**
> *"Wait — this doesn't look like a home recording..."*

**Button:** `[ Pause and think ]`

---

**Beat 2.3 — The Decision**

**On-screen text:**
> This tape isn't Gary's personal footage — it's a copy of a copyrighted broadcast special. What do you do?

**Choice A — "Sure, no problem." (duplicate it anyway)**
> **Consequence:** Screen shows the capture proceeding normally, then cuts to a brief supervisor check-in later:
> *"Hey — I noticed a duplication request for 'American Voices.' That's licensed network content; we can't copy that here, even as a favor. I'll need you to let patrons down gently in this situation going forward."*
> **Feedback tag:** ⚠️ *Policy violation — copyrighted broadcast content was duplicated without authorization.*
> → Routes to reflection screen with this outcome noted.

**Choice B — "No, sorry, can't do it." (flat refusal, no explanation)**
> **Consequence:** Gary's expression falls.
> *"Oh... okay. I didn't realize. Sorry to bother you."* He leaves looking embarrassed.
> **Feedback tag:** ⚠️ *Correct call, rough delivery — Gary didn't do anything wrong on purpose, and a flat refusal left him feeling blamed.*
> → Routes to reflection screen with this outcome noted.

**Choice C — "This looks like it might be copyrighted material — I want to explain why I can't copy it, and see if there's another option." (explain + redirect)** ✅ *Recommended*
> **Consequence:** Gary nods.
> **You:** *"This actually looks like it's from a TV special, not something home-recorded — our policy only covers personal recordings, since copying broadcast or commercial content isn't something we're allowed to do, even for personal use. If your dad's a fan of this speech, the library actually has 'American Voices' available to borrow on DVD from the media collection — I can check if that title's in our system."*
> **Gary:** *"Oh — I had no idea. Yeah, that'd be great, thanks for explaining instead of just saying no."*
> **Feedback tag:** ✅ *Best outcome — policy followed, patron treated with respect, and given a legitimate alternative.*
> → Routes to reflection screen with this outcome noted.

*(All three paths converge to Scene 3, each carrying a tag that changes a line of the summary text.)*

---

## SCENE 3 — Reflection / Wrap-Up

**On-screen text (base, same for all paths):**
> **Shift complete.**
>
> Today you helped two patrons digitize personal media — and ran into a common real-world wrinkle: not everything that *looks* like a home recording actually is one.

**Dynamic line based on Scene 2 choice:**
- (A) *"Duplicating copyrighted material — even as a small favor — puts the library at legal risk and isn't something patrons are entitled to ask for, even unknowingly."*
- (B) *"Saying no was the right call, but patrons deserve to know why — most people aren't trying to break the rules, they just don't know where the line is."*
- (C) *"You made the right call and helped Gary understand why — and still found him a way to get what he actually wanted."*

**Policy callout box:**
> **Why this policy exists:** A personal home recording belongs to the person who filmed it — there's no copyright issue in duplicating it for them. A recording of broadcast or commercial programming (even an old TV special) is copyrighted material owned by someone else — duplicating it, even for a patron's personal use, isn't legally allowed without permission from the rights holder.

**Button:** `[ Finish ]` → optional restart/menu

---

## BUILD NOTES

- **Canvas:** 1980×1020, single HTML file (or small bundle) as a Storyline web object
- **Assets needed:** AV cart/desk background, VCR + capture dongle graphics, cable close-ups, desktop/software mockup UI, tape label insets, patron character art (2 patrons, simple/flat style is fine), original (non-trademarked) warning card graphic, network title card graphic
- **State to track:** current step index, Scene 2 choice (A/B/C) for the dynamic Scene 3 text
- **Keep it lightweight:** no need for real video files — the "capture preview" and "broadcast footage" can be short looping CSS/canvas animations or even static images with a subtle scanline effect to sell "old tape" texture
- **Audio:** small synthesized SFX (clicks, tape clunk, rewind whir, chime, static hiss) via WebAudio — no audio files; user-facing SOUND ON/OFF toggle, all sounds gesture-triggered so autoplay policies don't apply
- **Reveal staging:** Gary's warning card + network title card play as a full-screen CRT takeover overlay (static → warning card → static blip → title card → "Pause and think"), not inside the small software preview
- **Guided mode:** every Carol step spotlights its equipment (rest of scene dims) with an instruction/tip callout card; progress dots are clickable to jump to any step (state fast-forwards silently), with a Next-Step escape hatch on the callout
- **Framing:** the module is "the SOP in playable form" — the landing page is a staff-portal SOP panel (SOP-114) over the Media Preservation Center exterior photo (`assets/mpc-exterior.jpg`), with two entry paths: "Start Shift" (full training walkthrough with the eligibility beat) and "I just need a specific step" (skips straight to the procedure and calls out the jump dots — the scrambling-employee refresher path)
- **Accessibility:** interactive desk objects are real buttons, `prefers-reduced-motion` disables static/pulse loops, dots have aria-labels
