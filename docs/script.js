const STEP_NAMES = [
  "Insert the tape",
  "Rewind the tape",
  "Check the cable connections",
  "Power on the equipment",
  "Open the capture software",
  "Select input source & format",
  "Preview & adjust tracking",
  "Start capture (Record, then Play)",
  "Let it run, then Stop",
  "Save the file",
  "Eject and return the tape"
];

const STEP_COPY = [
  { instruction: "Click the tape sitting on the desk to load it into the VCR.", tip: "Make sure the label faces up — it should slide in smoothly." },
  { instruction: "Press Rewind to confirm the tape is cued to the very beginning.", tip: "Never assume a tape's already rewound — always check first." },
  { instruction: "One cable has come loose — click it back into its port, then confirm the other two.", tip: "Hover or tap the cable run for a hookup guide — yellow is video, white/red are audio." },
  { instruction: "Power on both the VCR and the capture device.", tip: "Both units need power before the software can see a signal." },
  { instruction: "Open the capture software from the desktop.", tip: "Look for the ClipCatch icon — not Mail, Photos, or the browser." },
  { instruction: "Select the correct input source and video format.", tip: "Composite In + NTSC is the standard for home VHS tapes." },
  { instruction: "Drag the tracking slider until the picture locks in clean.", tip: "The closer you get, the calmer the static — listen to the picture." },
  { instruction: "Press Record on the software first, then Play on the VCR.", tip: "Order matters — Play before Record wastes the tape's leader." },
  { instruction: "Let the capture run, then press Stop when the bar completes.", tip: "Keep an eye on the progress bar as the tape plays through." },
  { instruction: "Confirm the filename and click Save.", tip: "Files save to the Patron Digitization Requests folder." },
  { instruction: "Click the tape to eject it and hand it back with a claim ticket.", tip: "Always return the original — you're making a copy, not keeping it." }
];

const PATRONS = {
  carol: {
    name: "CAROL",
    tapeLabel: "Carol's Graduation<br>Ridgeline University, 1998",
    counterStart: 347,
    intro: "Hi — I'd love to get this digitized if possible. It's a recording I made of my college graduation. We had a pretty well-known speaker that year, so I want to make sure it survives!",
    closing: "Thank you so much — this means a lot. My mom's going to cry when she sees this.",
    filename: "Whitfield_Graduation_1998.mp4",
    outcome: "stable"
  },
  gary: {
    name: "GARY",
    tapeLabel: "Speech Night",
    counterStart: 512,
    intro: "Hey, could you copy this one too? It's just an old recording of a speech — my dad would love a copy for his birthday.",
    outcome: "warning"
  }
};

const ELIGIBILITY_FEEDBACK = {
  yes: "Correct — personal recordings are always eligible. Let's get started.",
  unsure: "You don't need to escalate this one — it's clearly Carol's own footage. Let's get started."
};

const CONSEQUENCES = {
  a: "You duplicate the tape. Later, your supervisor checks in: \"Hey — I noticed a duplication request for 'American Voices.' That's licensed network content; we can't copy that here, even as a favor. I'll need you to let patrons down gently in this situation going forward.\"",
  b: "Gary's expression falls. \"Oh... okay. I didn't realize. Sorry to bother you.\" He leaves looking embarrassed — you followed policy, but he walked away feeling blamed for something he didn't know was wrong.",
  c: "You explain: \"This looks like it's from a TV special, not something home-recorded — our policy only covers personal recordings. If your dad's a fan of this speech, the library actually has 'American Voices' available to borrow on DVD — I can check if that title's in our system.\" Gary nods: \"Oh — I had no idea. Yeah, that'd be great, thanks for explaining instead of just saying no.\""
};

const REFLECTION = {
  a: "Duplicating copyrighted material — even as a small favor — puts the library at legal risk and isn't something patrons are entitled to ask for, even unknowingly.",
  b: "Saying no was the right call, but patrons deserve to know why — most people aren't trying to break the rules, they just don't know where the line is.",
  c: "You made the right call and helped Gary understand why — and still found him a way to get what he actually wanted."
};

const STAMPS = {
  a: { text: "POLICY VIOLATION", cls: "stamp-a" },
  b: { text: "RIGHT CALL, ROUGH DELIVERY", cls: "stamp-b" },
  c: { text: "BEST OUTCOME", cls: "stamp-c" }
};

const el = (id) => document.getElementById(id);
const scenes = document.querySelectorAll(".scene");

const dom = {
  canvas: el("canvas"),
  stepBanner: el("step-banner"),
  progressDots: el("progress-dots"),
  spotlightOverlay: el("spotlight-overlay"),
  calloutCard: el("callout-card"),
  calloutTitle: el("callout-title"),
  calloutInstruction: el("callout-instruction"),
  calloutTip: el("callout-tip"),
  calloutNext: el("callout-next"),
  vcr: el("vcr"),
  vcrLed: el("vcr-led"),
  monitor: el("monitor"),
  tapeGraphic: el("tape-graphic"),
  tapeLabel: el("tape-label"),
  tapeWaiting: el("tape-waiting"),
  tapeWaitingLabel: el("tape-waiting-label"),
  tapeCounter: el("tape-counter"),
  claimTicket: el("claim-ticket"),
  claimTicketLine: el("claim-ticket-line"),
  btnRewind: el("btn-rewind"),
  btnPlay: el("btn-play"),
  btnPowerVcr: el("btn-power-vcr"),
  cableArea: el("cable-area"),
  cableBundle: el("cable-bundle"),
  cablePopover: el("cable-popover"),
  cablePopoverClose: el("cable-popover-close"),
  captureBox: el("capture-box"),
  captureLed: el("capture-led"),
  desktopView: el("desktop-view"),
  softwareWindow: el("software-window"),
  inputSelect: el("input-select"),
  softwarePreview: el("software-preview"),
  previewNoise: el("preview-noise"),
  recDot: el("rec-dot"),
  trackingSlider: el("tracking-slider"),
  progressTrack: el("progress-track"),
  progressFill: el("progress-fill"),
  btnRecord: el("btn-record"),
  btnStopCapture: el("btn-stop-capture"),
  filenameField: el("filename-field"),
  btnSave: el("btn-save"),
  eligibilityCard: el("eligibility-card"),
  eligibilityToast: el("eligibility-toast"),
  avatarCarol: el("avatar-carol"),
  avatarGary: el("avatar-gary"),
  dialogueName: el("dialogue-name"),
  dialogueText: el("dialogue-text"),
  dialogueNext: el("dialogue-next"),
  warningOverlay: el("warning-overlay"),
  woStatic: el("wo-static"),
  woFbi: el("wo-fbi"),
  woTitle: el("wo-title"),
  woCaption: el("wo-caption"),
  btnPauseThink: el("btn-pause-think"),
  decisionChoices: el("decision-choices"),
  consequenceBox: el("consequence-box"),
  consequenceText: el("consequence-text"),
  btnToReflection: el("btn-to-reflection"),
  reflectionLine: el("reflection-line"),
  reflectionStamp: el("reflection-stamp"),
  btnFinish: el("btn-finish"),
  btnStart: el("btn-start"),
  sfxToggle: el("sfx-toggle")
};

const state = {
  patronKey: null,
  step: 1,
  awaitingEligibility: false,
  rewound: false,
  yellowSeated: false,
  vcrPowered: false,
  capturePowered: false,
  recordClicked: false,
  playClicked: false,
  captureDone: false,
  choice: null
};

// ---- SFX (tiny WebAudio synth — no audio assets needed) ----
const SFX = (() => {
  let ctx = null;
  let enabled = true;
  let whirNodes = null;

  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function tone(freq, dur, type = "square", vol = 0.04) {
    if (!enabled) return;
    try {
      const c = ac();
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(vol, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
      o.connect(g).connect(c.destination);
      o.start();
      o.stop(c.currentTime + dur);
    } catch (e) { /* audio unavailable — stay silent */ }
  }
  function noise(dur, vol = 0.03, filterFreq = 1200) {
    if (!enabled) return null;
    try {
      const c = ac();
      const len = Math.max(1, Math.floor(c.sampleRate * dur));
      const buf = c.createBuffer(1, len, c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      const src = c.createBufferSource();
      src.buffer = buf;
      src.loop = dur > 1;
      const f = c.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = filterFreq;
      const g = c.createGain();
      g.gain.value = vol;
      src.connect(f).connect(g).connect(c.destination);
      src.start();
      if (dur <= 1) src.stop(c.currentTime + dur);
      return { src, g };
    } catch (e) { return null; }
  }
  return {
    click: () => tone(880, 0.04),
    clunk: () => { tone(140, 0.09, "triangle", 0.09); tone(90, 0.12, "sine", 0.06); },
    err: () => tone(110, 0.18, "sawtooth", 0.05),
    chime: () => { tone(660, 0.09, "sine", 0.05); setTimeout(() => tone(990, 0.14, "sine", 0.05), 90); },
    hiss: (dur) => noise(dur, 0.025, 3000),
    whirStart: () => { whirNodes = noise(10, 0.02, 700); },
    whirStop: () => { if (whirNodes) { try { whirNodes.src.stop(); } catch (e) {} whirNodes = null; } },
    toggle: () => { enabled = !enabled; if (!enabled && whirNodes) { try { whirNodes.src.stop(); } catch (e) {} whirNodes = null; } return enabled; }
  };
})();

dom.sfxToggle.addEventListener("click", () => {
  const on = SFX.toggle();
  dom.sfxToggle.textContent = on ? "SOUND: ON" : "SOUND: OFF";
  dom.sfxToggle.classList.toggle("off", !on);
});

// ---- scene / step management ----
const STEP_TARGETS = {
  1: () => [dom.tapeWaiting],
  2: () => [dom.vcr],
  3: () => [dom.cableArea],
  4: () => [dom.btnPowerVcr, dom.captureBox],
  5: () => [dom.monitor],
  6: () => [dom.monitor],
  7: () => [dom.monitor],
  8: () => [dom.btnRecord, dom.btnPlay],
  9: () => [dom.monitor],
  10: () => [dom.monitor],
  11: () => [dom.vcr]
};

function showScene(id) {
  scenes.forEach((s) => s.classList.toggle("active", s.id === id));
}

function setStep(n) {
  state.step = n;
  if (n !== 3) hideCablePopoverNow();
  dom.stepBanner.textContent = `Step ${n} of 11 — ${STEP_NAMES[n - 1]}`;
  renderDots();
  if (state.patronKey === "carol" && !state.awaitingEligibility) {
    updateSpotlight(n);
    updateCallout(n);
  } else {
    hideSpotlight();
    hideCallout();
  }
}

function renderDots() {
  dom.progressDots.innerHTML = "";
  for (let i = 1; i <= 11; i++) {
    const d = document.createElement("button");
    d.type = "button";
    d.className = "dot" + (i < state.step ? " done" : i === state.step ? " current" : "");
    d.title = `Step ${i}: ${STEP_NAMES[i - 1]}`;
    d.setAttribute("aria-label", `Jump to step ${i}: ${STEP_NAMES[i - 1]}`);
    if (state.patronKey === "carol") {
      d.addEventListener("click", () => { SFX.click(); fastForwardTo(i); });
    } else {
      d.disabled = true;
    }
    dom.progressDots.appendChild(d);
  }
}

function updateSpotlight(step) {
  document.querySelectorAll(".spotlight-active").forEach((node) => node.classList.remove("spotlight-active"));
  const targets = (STEP_TARGETS[step] ? STEP_TARGETS[step]() : []).filter(Boolean);
  targets.forEach((t) => t.classList.add("spotlight-active"));
  dom.spotlightOverlay.hidden = targets.length === 0;
}

function hideSpotlight() {
  document.querySelectorAll(".spotlight-active").forEach((node) => node.classList.remove("spotlight-active"));
  dom.spotlightOverlay.hidden = true;
}

function updateCallout(step) {
  const copy = STEP_COPY[step - 1];
  dom.calloutCard.hidden = false;
  dom.calloutTitle.textContent = `Step ${step} of 11 — ${STEP_NAMES[step - 1]}`;
  dom.calloutInstruction.textContent = copy.instruction;
  dom.calloutTip.textContent = copy.tip;
  dom.calloutNext.textContent = step === 11 ? "Eject ›" : "Next Step ›";
}

function hideCallout() {
  dom.calloutCard.hidden = true;
}

function flashWrong(node) {
  SFX.err();
  const prev = node.style.outline;
  node.style.outline = "3px solid #a32d2d";
  setTimeout(() => { node.style.outline = prev; }, 500);
}

function resetProcedureUI() {
  dom.tapeGraphic.classList.remove("inserted");
  dom.tapeWaiting.classList.remove("used");
  dom.claimTicket.hidden = true;
  dom.btnRewind.classList.remove("active-glow");
  dom.btnPowerVcr.classList.remove("active-glow");
  dom.captureBox.classList.remove("active-glow");
  dom.vcrLed.classList.remove("on");
  dom.captureLed.classList.remove("rec");
  dom.cableArea.classList.remove("yellow-seated");
  dom.cableBundle.querySelectorAll(".cable-jack").forEach((j) => j.classList.remove("confirmed"));
  dom.cableBundle.querySelector(".cable-jack.yellow").classList.add("unseated");
  dom.desktopView.hidden = false;
  dom.softwareWindow.hidden = true;
  dom.inputSelect.value = "";
  dom.softwarePreview.className = "software-preview";
  dom.previewNoise.style.opacity = "";
  dom.recDot.hidden = true;
  dom.trackingSlider.hidden = true;
  dom.trackingSlider.value = 0;
  dom.trackingSlider.disabled = false;
  dom.progressTrack.hidden = true;
  dom.progressFill.style.transition = "none";
  dom.progressFill.style.width = "0%";
  dom.btnRecord.hidden = false;
  dom.btnRecord.disabled = false;
  dom.btnRecord.classList.remove("active");
  dom.btnStopCapture.hidden = true;
  dom.btnStopCapture.disabled = true;
  dom.btnStopCapture.classList.remove("ready-pulse");
  dom.filenameField.hidden = true;
  dom.btnSave.hidden = true;
  dom.dialogueNext.hidden = true;
  dom.eligibilityCard.hidden = true;
  dom.eligibilityToast.hidden = true;
  hideCablePopoverNow();
  SFX.whirStop();
  state.rewound = false;
  state.yellowSeated = false;
  state.vcrPowered = false;
  state.capturePowered = false;
  state.recordClicked = false;
  state.playClicked = false;
  state.captureDone = false;
}

function startPatron(key) {
  state.patronKey = key;
  const p = PATRONS[key];
  resetProcedureUI();
  dom.tapeLabel.innerHTML = p.tapeLabel;
  dom.tapeWaitingLabel.innerHTML = p.tapeLabel;
  dom.tapeCounter.textContent = "----";
  dom.avatarCarol.hidden = key !== "carol";
  dom.avatarGary.hidden = key !== "gary";
  dom.dialogueName.textContent = p.name;
  dom.dialogueText.textContent = p.intro;
  state.awaitingEligibility = key === "carol";
  setStep(1);
  showScene("scene-procedure");
  if (key === "carol") {
    dom.eligibilityCard.hidden = false;
  } else {
    dom.tapeWaiting.classList.add("used");
    runGaryMontage();
  }
}

// ---- Carol Beat 1.1: eligibility micro-decision ----
dom.eligibilityCard.querySelectorAll(".elig-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    SFX.click();
    dom.eligibilityToast.textContent = ELIGIBILITY_FEEDBACK[btn.dataset.elig];
    dom.eligibilityToast.hidden = false;
    dom.eligibilityCard.querySelectorAll(".elig-btn").forEach((b) => (b.disabled = true));
    setTimeout(() => {
      dom.eligibilityCard.hidden = true;
      dom.eligibilityCard.querySelectorAll(".elig-btn").forEach((b) => (b.disabled = false));
      state.awaitingEligibility = false;
      setStep(1);
    }, 1700);
  });
});

function dismissEligibility() {
  state.awaitingEligibility = false;
  dom.eligibilityCard.hidden = true;
  dom.eligibilityToast.hidden = true;
  dom.eligibilityCard.querySelectorAll(".elig-btn").forEach((b) => (b.disabled = false));
}

// ---- Step 1: Insert tape ----
dom.tapeWaiting.addEventListener("click", () => {
  if (state.step !== 1 || state.patronKey !== "carol" || state.awaitingEligibility) return;
  SFX.clunk();
  dom.tapeWaiting.classList.add("used");
  dom.tapeGraphic.classList.add("inserted");
  dom.tapeCounter.textContent = String(PATRONS.carol.counterStart).padStart(4, "0");
  setTimeout(() => setStep(2), 550);
});

// ---- Step 11: Eject ----
function ejectTape() {
  if (state.step !== 11 || !dom.tapeGraphic.classList.contains("inserted")) return;
  SFX.clunk();
  dom.tapeGraphic.classList.remove("inserted");
  dom.claimTicketLine.textContent = "Nº 0047 — WHITFIELD";
  dom.claimTicket.hidden = false;
  dom.dialogueText.textContent = PATRONS.carol.closing;
  hideSpotlight();
  hideCallout();
  setTimeout(() => startPatron("gary"), 2200);
}
dom.tapeGraphic.addEventListener("click", ejectTape);

dom.calloutNext.addEventListener("click", () => {
  if (state.patronKey !== "carol") return;
  SFX.click();
  if (state.step === 11) {
    ejectTape();
  } else {
    fastForwardTo(state.step + 1);
  }
});

// ---- Step 2: Rewind ----
dom.btnRewind.addEventListener("click", () => {
  if (state.rewound || state.step !== 2) return;
  SFX.click();
  SFX.whirStart();
  dom.btnRewind.classList.add("active-glow");
  let n = PATRONS[state.patronKey].counterStart;
  const timer = setInterval(() => {
    if (state.step !== 2) { clearInterval(timer); SFX.whirStop(); return; }
    n = Math.max(0, n - Math.ceil(n / 6) - 5);
    dom.tapeCounter.textContent = String(n).padStart(4, "0");
    if (n <= 0) {
      clearInterval(timer);
      SFX.whirStop();
      SFX.clunk();
      dom.tapeCounter.textContent = "0000";
      state.rewound = true;
      dom.btnRewind.classList.remove("active-glow");
      if (state.patronKey === "gary") {
        showWarningReveal();
      } else {
        setStep(3);
      }
    }
  }, 120);
});

// ---- Step 3: Cables (yellow starts loose — seat it, confirm the rest) ----
dom.cableBundle.querySelectorAll(".cable-jack").forEach((jack) => {
  jack.addEventListener("click", () => {
    if (state.step !== 3) return;
    if (jack.classList.contains("unseated")) {
      SFX.clunk();
      jack.classList.remove("unseated");
      dom.cableArea.classList.add("yellow-seated");
      state.yellowSeated = true;
    } else {
      SFX.click();
    }
    jack.classList.add("confirmed");
    const all = dom.cableBundle.querySelectorAll(".cable-jack");
    const done = [...all].every((j) => j.classList.contains("confirmed"));
    if (done && state.yellowSeated) setStep(4);
  });
});

// ---- cable hookup-guide popover (hover on desktop, tap on touch) ----
let cablePopTimer = null;
function showCablePopover() {
  if (state.step !== 3 || state.patronKey !== "carol") return;
  clearTimeout(cablePopTimer);
  dom.cablePopover.hidden = false;
}
function hideCablePopoverSoon() {
  clearTimeout(cablePopTimer);
  cablePopTimer = setTimeout(() => { dom.cablePopover.hidden = true; }, 250);
}
function hideCablePopoverNow() {
  clearTimeout(cablePopTimer);
  dom.cablePopover.hidden = true;
}
dom.cableArea.addEventListener("mouseenter", showCablePopover);
dom.cableArea.addEventListener("mouseleave", hideCablePopoverSoon);
dom.cablePopover.addEventListener("mouseenter", showCablePopover);
dom.cablePopover.addEventListener("mouseleave", hideCablePopoverSoon);
dom.cableArea.addEventListener("click", (e) => {
  if (e.target.closest(".cable-jack")) return;
  showCablePopover();
});
dom.cablePopoverClose.addEventListener("click", (e) => {
  e.stopPropagation();
  SFX.click();
  hideCablePopoverNow();
});

function seatAllCables() {
  dom.cableArea.classList.add("yellow-seated");
  dom.cableBundle.querySelectorAll(".cable-jack").forEach((j) => {
    j.classList.remove("unseated");
    j.classList.add("confirmed");
  });
  state.yellowSeated = true;
}

// ---- Step 4: Power ----
function checkPower() {
  if (state.vcrPowered && state.capturePowered) setStep(5);
}
function powerOnVisuals() {
  dom.btnPowerVcr.classList.add("active-glow");
  dom.captureBox.classList.add("active-glow");
  dom.vcrLed.classList.add("on");
}
dom.btnPowerVcr.addEventListener("click", () => {
  if (state.step !== 4) return;
  SFX.click();
  state.vcrPowered = true;
  dom.btnPowerVcr.classList.add("active-glow");
  dom.vcrLed.classList.add("on");
  checkPower();
});
dom.captureBox.addEventListener("click", () => {
  if (state.step !== 4) return;
  SFX.click();
  state.capturePowered = true;
  dom.captureBox.classList.add("active-glow");
  checkPower();
});

// ---- Step 5: Open software ----
dom.desktopView.querySelectorAll(".desktop-icon").forEach((icon) => {
  icon.addEventListener("click", () => {
    if (state.step !== 5) return;
    if (icon.dataset.icon === "correct") {
      SFX.chime();
      dom.desktopView.hidden = true;
      dom.softwareWindow.hidden = false;
      setStep(6);
    } else {
      flashWrong(icon);
    }
  });
});

// ---- Step 6: Input select ----
dom.inputSelect.addEventListener("change", () => {
  if (state.step !== 6) return;
  if (dom.inputSelect.value === "composite-ntsc") {
    SFX.click();
    setStep(7);
    beginPreview();
  } else if (dom.inputSelect.value !== "") {
    flashWrong(dom.inputSelect);
    dom.inputSelect.value = "";
  }
});

function beginPreview() {
  const p = PATRONS[state.patronKey];
  if (p.outcome === "warning") {
    showWarningReveal();
  } else {
    dom.softwarePreview.classList.add("live");
    dom.previewNoise.style.opacity = "1";
    dom.trackingSlider.hidden = false;
  }
}

// ---- Step 7: Tracking (static calms as you approach the sweet spot) ----
dom.trackingSlider.addEventListener("input", () => {
  if (state.step !== 7) return;
  const v = Number(dom.trackingSlider.value);
  const err = Math.abs(v - 50);
  if (err <= 10) {
    SFX.chime();
    dom.previewNoise.style.opacity = "0";
    dom.softwarePreview.classList.add("stable");
    dom.trackingSlider.disabled = true;
    setTimeout(() => setStep(8), 700);
  } else {
    dom.previewNoise.style.opacity = String(Math.min(1, Math.max(0.15, err / 45)));
  }
});

// ---- Step 8: Record then Play ----
dom.btnRecord.addEventListener("click", () => {
  if (state.step !== 8) return;
  SFX.click();
  state.recordClicked = true;
  dom.btnRecord.classList.add("active");
  dom.btnRecord.disabled = true;
});
dom.btnPlay.addEventListener("click", () => {
  if (state.step !== 8) return;
  if (!state.recordClicked) {
    SFX.err();
    dom.dialogueText.textContent = "You just played blank leader — hit Record first, then Play.";
    return;
  }
  SFX.click();
  state.playClicked = true;
  startCapture();
});

// ---- Step 9: capture runs, user presses Stop ----
function startCapture() {
  setStep(9);
  dom.recDot.hidden = false;
  dom.captureLed.classList.add("rec");
  dom.progressTrack.hidden = false;
  dom.btnStopCapture.hidden = false;
  dom.btnStopCapture.disabled = true;
  requestAnimationFrame(() => {
    dom.progressFill.style.transition = "width 2.2s linear";
    dom.progressFill.style.width = "100%";
  });
  setTimeout(() => {
    if (state.step !== 9) return;
    SFX.chime();
    dom.btnStopCapture.disabled = false;
    dom.btnStopCapture.classList.add("ready-pulse");
    state.captureDone = true;
  }, 2300);
}

dom.btnStopCapture.addEventListener("click", () => {
  if (state.step !== 9 || !state.captureDone) return;
  SFX.click();
  finishCapture();
});

function finishCapture() {
  dom.recDot.hidden = true;
  dom.captureLed.classList.remove("rec");
  dom.btnStopCapture.classList.remove("ready-pulse");
  dom.btnStopCapture.disabled = true;
  setStep(10);
  dom.filenameField.hidden = false;
  dom.filenameField.value = PATRONS[state.patronKey].filename;
  dom.btnSave.hidden = false;
}

// ---- Step 10: Save ----
dom.btnSave.addEventListener("click", () => {
  if (state.step !== 10) return;
  SFX.chime();
  setStep(11);
});

// ---- Jump-to-step: silently applies the effects of steps 1..(target-1) so
// Carol's walkthrough doubles as a step-by-step reference tool. ----
function fastForwardTo(targetStep) {
  if (state.patronKey !== "carol") return;
  targetStep = Math.max(1, Math.min(11, targetStep));
  resetProcedureUI();
  dismissEligibility();
  dom.tapeCounter.textContent = "----";
  if (targetStep >= 2) {
    dom.tapeWaiting.classList.add("used");
    dom.tapeGraphic.classList.add("inserted");
    dom.tapeCounter.textContent = String(PATRONS.carol.counterStart).padStart(4, "0");
  }
  if (targetStep >= 3) {
    dom.tapeCounter.textContent = "0000";
    state.rewound = true;
  }
  if (targetStep >= 4) {
    seatAllCables();
  }
  if (targetStep >= 5) {
    state.vcrPowered = true;
    state.capturePowered = true;
    powerOnVisuals();
  }
  if (targetStep >= 6) {
    dom.desktopView.hidden = true;
    dom.softwareWindow.hidden = false;
  }
  if (targetStep >= 7) {
    dom.inputSelect.value = "composite-ntsc";
    dom.softwarePreview.classList.add("live");
    dom.previewNoise.style.opacity = "1";
    dom.trackingSlider.hidden = false;
  }
  if (targetStep >= 8) {
    dom.previewNoise.style.opacity = "0";
    dom.softwarePreview.classList.add("stable");
    dom.trackingSlider.value = 50;
    dom.trackingSlider.disabled = true;
  }
  if (targetStep >= 9) {
    state.recordClicked = true;
    state.playClicked = true;
    dom.btnRecord.classList.add("active");
    dom.btnRecord.disabled = true;
    dom.progressTrack.hidden = false;
    dom.progressFill.style.transition = "none";
    dom.progressFill.style.width = "100%";
    dom.btnStopCapture.hidden = false;
    if (targetStep === 9) {
      dom.recDot.hidden = false;
      dom.captureLed.classList.add("rec");
      dom.btnStopCapture.disabled = false;
      dom.btnStopCapture.classList.add("ready-pulse");
      state.captureDone = true;
    }
  }
  if (targetStep >= 10) {
    state.captureDone = true;
    dom.btnStopCapture.disabled = true;
    dom.filenameField.hidden = false;
    dom.filenameField.value = PATRONS.carol.filename;
    dom.btnSave.hidden = false;
  }
  setStep(targetStep);
}

// ---- Gary's abbreviated montage ----
// Equipment is already known-good from Carol's shift, so setup happens quietly
// in the background; the only manual beat left for Gary is the rewind itself.
function runGaryMontage() {
  setTimeout(() => {
    SFX.clunk();
    dom.tapeGraphic.classList.add("inserted");
    dom.tapeCounter.textContent = String(PATRONS.gary.counterStart).padStart(4, "0");
    setStep(2);
  }, 400);
  setTimeout(() => {
    seatAllCables();
  }, 750);
  setTimeout(() => {
    state.vcrPowered = true;
    state.capturePowered = true;
    powerOnVisuals();
  }, 1050);
  setTimeout(() => {
    dom.desktopView.hidden = true;
    dom.softwareWindow.hidden = false;
  }, 1350);
  setTimeout(() => {
    dom.inputSelect.value = "composite-ntsc";
  }, 1650);
}

// ---- Warning reveal: full-screen CRT takeover ----
function showWarningReveal() {
  hideSpotlight();
  hideCallout();
  dom.warningOverlay.hidden = false;
  dom.woStatic.hidden = false;
  dom.woFbi.hidden = true;
  dom.woTitle.hidden = true;
  dom.woCaption.hidden = true;
  dom.btnPauseThink.hidden = true;
  SFX.hiss(0.8);
  setTimeout(() => {
    dom.woStatic.hidden = true;
    dom.woFbi.hidden = false;
    SFX.err();
  }, 800);
  setTimeout(() => {
    dom.woFbi.hidden = true;
    dom.woStatic.hidden = false;
    SFX.hiss(0.4);
  }, 3100);
  setTimeout(() => {
    dom.woStatic.hidden = true;
    dom.woTitle.hidden = false;
    SFX.chime();
  }, 3500);
  setTimeout(() => {
    dom.woCaption.hidden = false;
    dom.btnPauseThink.hidden = false;
  }, 5400);
}

dom.btnPauseThink.addEventListener("click", () => {
  SFX.click();
  dom.warningOverlay.hidden = true;
  showScene("scene-decision");
});

// (kept for Carol-side dialogue continuations if needed)
dom.dialogueNext.addEventListener("click", () => {
  showScene("scene-decision");
});

// ---- Decision ----
dom.decisionChoices.querySelectorAll(".choice-card").forEach((card) => {
  card.addEventListener("click", () => {
    SFX.click();
    state.choice = card.dataset.choice;
    dom.consequenceText.textContent = CONSEQUENCES[state.choice];
    dom.consequenceBox.hidden = false;
    dom.decisionChoices.querySelectorAll(".choice-card").forEach((c) => (c.disabled = true));
  });
});

dom.btnToReflection.addEventListener("click", () => {
  SFX.click();
  dom.reflectionLine.textContent = REFLECTION[state.choice];
  const stamp = STAMPS[state.choice];
  dom.reflectionStamp.textContent = stamp.text;
  dom.reflectionStamp.className = `report-stamp ${stamp.cls}`;
  showScene("scene-reflection");
});

dom.btnFinish.addEventListener("click", () => {
  SFX.click();
  dom.decisionChoices.querySelectorAll(".choice-card").forEach((c) => (c.disabled = false));
  dom.consequenceBox.hidden = true;
  showScene("scene-intro");
});

// ---- Intro ----
dom.btnStart.addEventListener("click", () => {
  SFX.click();
  startPatron("carol");
});

// ---- Scale-to-fit (canvas is a fixed 1980x1020 stage) ----
const CANVAS_W = 1980;
const CANVAS_H = 1020;
function fitCanvas() {
  const scale = Math.min(window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H);
  const left = (window.innerWidth - CANVAS_W * scale) / 2;
  const top = (window.innerHeight - CANVAS_H * scale) / 2;
  dom.canvas.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
}
window.addEventListener("resize", fitCanvas);
window.addEventListener("orientationchange", fitCanvas);
if (window.visualViewport) window.visualViewport.addEventListener("resize", fitCanvas);
fitCanvas();
