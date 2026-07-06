const STEP_COPY = [
  { instruction: "Click the tape sitting on the desk to load it into the VCR.", tip: "Make sure the label faces up — it should slide in smoothly." },
  { instruction: "Press Rewind to confirm the tape is cued to the very beginning.", tip: "Never assume a tape's already rewound — always check first." },
  { instruction: "Click each of the three cables to confirm they're seated in the right port.", tip: "Yellow carries video. White and red carry left/right audio." },
  { instruction: "Power on both the VCR and the capture device.", tip: "Both units need power before the software can see a signal." },
  { instruction: "Open the capture software from the desktop.", tip: "Look for the ClipCatch icon — not Mail, Photos, or the browser." },
  { instruction: "Select the correct input source and video format.", tip: "Composite In + NTSC is the standard for home VHS tapes." },
  { instruction: "Drag the tracking slider until the picture locks in clean.", tip: "A rolling or staticky picture means the tracking's off." },
  { instruction: "Press Record on the software first, then Play on the VCR.", tip: "Order matters — Play before Record wastes the tape's leader." },
  { instruction: "Let the capture run, then press Stop when it's done.", tip: "Keep an eye on the progress bar as the tape plays through." },
  { instruction: "Confirm the filename and click Save.", tip: "Files save to the Patron Digitization Requests folder." },
  { instruction: "Click the tape to eject it and hand it back with a claim ticket.", tip: "Always return the original — you're making a copy, not keeping it." }
];

const PATRONS = {
  carol: {
    name: "Carol",
    avatar: "C",
    tapeLabel: "Carol's Graduation<br>Ridgeline University, 1998",
    counterStart: 347,
    intro: "Hi — I'd love to get this digitized if possible. It's a recording I made of my college graduation. We had a pretty well-known speaker that year, so I want to make sure it survives!",
    closing: "Thank you so much — this means a lot. My mom's going to cry when she sees this.",
    filename: "Whitfield_Graduation_1998.mp4",
    outcome: "stable"
  },
  gary: {
    name: "Gary",
    avatar: "G",
    tapeLabel: "Speech Night",
    counterStart: 512,
    intro: "Hey, could you copy this one too? It's just an old recording of a speech — my dad would love a copy for his birthday.",
    outcome: "warning"
  }
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
  monitor: el("monitor"),
  tapeGraphic: el("tape-graphic"),
  tapeLabel: el("tape-label"),
  tapeWaiting: el("tape-waiting"),
  tapeWaitingLabel: el("tape-waiting-label"),
  tapeCounter: el("tape-counter"),
  btnRewind: el("btn-rewind"),
  btnPlay: el("btn-play"),
  btnPowerVcr: el("btn-power-vcr"),
  cableBundle: el("cable-bundle"),
  captureBox: el("capture-box"),
  desktopView: el("desktop-view"),
  softwareWindow: el("software-window"),
  inputSelect: el("input-select"),
  softwarePreview: el("software-preview"),
  trackingSlider: el("tracking-slider"),
  progressTrack: el("progress-track"),
  progressFill: el("progress-fill"),
  btnRecord: el("btn-record"),
  btnStopCapture: el("btn-stop-capture"),
  filenameField: el("filename-field"),
  btnSave: el("btn-save"),
  dialogueAvatar: el("dialogue-avatar"),
  dialogueText: el("dialogue-text"),
  dialogueNext: el("dialogue-next"),
  decisionPrompt: el("decision-prompt"),
  decisionChoices: el("decision-choices"),
  consequenceBox: el("consequence-box"),
  consequenceText: el("consequence-text"),
  btnToReflection: el("btn-to-reflection"),
  reflectionLine: el("reflection-line"),
  btnFinish: el("btn-finish"),
  btnStart: el("btn-start")
};

const state = {
  patronKey: null,
  step: 1,
  rewound: false,
  vcrPowered: false,
  capturePowered: false,
  recordClicked: false,
  playClicked: false,
  choice: null
};

const STEP_TARGETS = {
  1: () => [dom.tapeWaiting],
  2: () => [dom.vcr],
  3: () => [dom.cableBundle],
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
  dom.stepBanner.textContent = `Step ${n} of 11`;
  renderDots();
  if (state.patronKey === "carol") {
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
    d.setAttribute("aria-label", `Jump to step ${i}`);
    if (state.patronKey === "carol") {
      d.addEventListener("click", () => fastForwardTo(i));
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
  dom.calloutTitle.textContent = `Step ${step} of 11`;
  dom.calloutInstruction.textContent = copy.instruction;
  dom.calloutTip.textContent = copy.tip;
  dom.calloutNext.textContent = step === 11 ? "Eject ›" : "Next Step ›";
}

function hideCallout() {
  dom.calloutCard.hidden = true;
}

// Silently applies the DOM/state effects of steps 1..(targetStep-1) so the
// player can jump straight to any step of Carol's walkthrough for reference,
// without replaying the whole procedure.
function fastForwardTo(targetStep) {
  if (state.patronKey !== "carol") return;
  targetStep = Math.max(1, Math.min(11, targetStep));
  resetProcedureUI();
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
    dom.cableBundle.querySelectorAll(".cable-jack").forEach((j) => j.classList.add("confirmed"));
  }
  if (targetStep >= 5) {
    state.vcrPowered = true;
    state.capturePowered = true;
    dom.btnPowerVcr.classList.add("active-glow");
    dom.captureBox.classList.add("active-glow");
  }
  if (targetStep >= 6) {
    dom.desktopView.hidden = true;
    dom.softwareWindow.hidden = false;
  }
  if (targetStep >= 7) {
    dom.inputSelect.value = "composite-ntsc";
    dom.trackingSlider.hidden = false;
  }
  if (targetStep >= 8) {
    dom.softwarePreview.className = "software-preview stable";
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
  }
  if (targetStep >= 10) {
    dom.btnStopCapture.hidden = false;
    dom.filenameField.hidden = false;
    dom.filenameField.value = PATRONS.carol.filename;
    dom.btnSave.hidden = false;
  }
  setStep(targetStep);
}

function flashWrong(node) {
  const prev = node.style.outline;
  node.style.outline = "3px solid #a32d2d";
  setTimeout(() => { node.style.outline = prev; }, 500);
}

function resetProcedureUI() {
  dom.tapeGraphic.classList.remove("inserted");
  dom.tapeWaiting.classList.remove("used");
  dom.btnRewind.classList.remove("active-glow");
  dom.btnPowerVcr.classList.remove("active-glow");
  dom.captureBox.classList.remove("active-glow");
  dom.cableBundle.querySelectorAll(".cable-jack").forEach((j) => j.classList.remove("confirmed"));
  dom.desktopView.hidden = false;
  dom.softwareWindow.hidden = true;
  dom.inputSelect.value = "";
  dom.softwarePreview.className = "software-preview";
  dom.softwarePreview.innerHTML = "";
  dom.trackingSlider.hidden = true;
  dom.trackingSlider.value = 0;
  dom.trackingSlider.disabled = false;
  dom.progressTrack.hidden = true;
  dom.progressFill.style.width = "0%";
  dom.btnRecord.hidden = false;
  dom.btnRecord.disabled = false;
  dom.btnRecord.classList.remove("active");
  dom.btnStopCapture.hidden = true;
  dom.filenameField.hidden = true;
  dom.btnSave.hidden = true;
  dom.dialogueNext.hidden = true;
  state.rewound = false;
  state.vcrPowered = false;
  state.capturePowered = false;
  state.recordClicked = false;
  state.playClicked = false;
}

function startPatron(key) {
  state.patronKey = key;
  const p = PATRONS[key];
  resetProcedureUI();
  dom.tapeLabel.innerHTML = p.tapeLabel;
  dom.tapeWaitingLabel.innerHTML = p.tapeLabel;
  dom.tapeCounter.textContent = "----";
  dom.dialogueAvatar.textContent = p.avatar;
  dom.dialogueText.textContent = p.intro;
  setStep(1);
  showScene("scene-procedure");
  if (key === "gary") {
    dom.tapeWaiting.classList.add("used");
    runGaryMontage();
  }
}

// ---- Step 1: Insert tape (click the tape waiting on the desk) ----
dom.tapeWaiting.addEventListener("click", () => {
  if (state.step !== 1 || state.patronKey !== "carol") return;
  dom.tapeWaiting.classList.add("used");
  dom.tapeGraphic.classList.add("inserted");
  dom.tapeCounter.textContent = String(PATRONS.carol.counterStart).padStart(4, "0");
  setTimeout(() => setStep(2), 550);
});

// ---- Step 11: Eject ----
function ejectTape() {
  if (state.step !== 11 || !dom.tapeGraphic.classList.contains("inserted")) return;
  dom.tapeGraphic.classList.remove("inserted");
  dom.dialogueText.textContent = PATRONS.carol.closing;
  hideSpotlight();
  hideCallout();
  setTimeout(() => startPatron("gary"), 1600);
}
dom.tapeGraphic.addEventListener("click", ejectTape);

dom.calloutNext.addEventListener("click", () => {
  if (state.patronKey !== "carol") return;
  if (state.step === 11) {
    ejectTape();
  } else {
    fastForwardTo(state.step + 1);
  }
});

// ---- Step 2: Rewind ----
dom.btnRewind.addEventListener("click", () => {
  if (state.rewound || state.step !== 2) return;
  dom.btnRewind.classList.add("active-glow");
  let n = PATRONS[state.patronKey].counterStart;
  const timer = setInterval(() => {
    if (state.step !== 2) { clearInterval(timer); return; }
    n = Math.max(0, n - Math.ceil(n / 6) - 5);
    dom.tapeCounter.textContent = String(n).padStart(4, "0");
    if (n <= 0) {
      clearInterval(timer);
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

// ---- Step 3: Cables ----
dom.cableBundle.querySelectorAll(".cable-jack").forEach((jack) => {
  jack.addEventListener("click", () => {
    if (state.step !== 3) return;
    jack.classList.add("confirmed");
    const all = dom.cableBundle.querySelectorAll(".cable-jack");
    const done = [...all].every((j) => j.classList.contains("confirmed"));
    if (done) setStep(4);
  });
});

// ---- Step 4: Power ----
function checkPower() {
  if (state.vcrPowered && state.capturePowered) setStep(5);
}
dom.btnPowerVcr.addEventListener("click", () => {
  if (state.step !== 4) return;
  state.vcrPowered = true;
  dom.btnPowerVcr.classList.add("active-glow");
  checkPower();
});
dom.captureBox.addEventListener("click", () => {
  if (state.step !== 4) return;
  state.capturePowered = true;
  dom.captureBox.classList.add("active-glow");
  checkPower();
});

// ---- Step 5: Open software ----
dom.desktopView.querySelectorAll(".desktop-icon").forEach((icon) => {
  icon.addEventListener("click", () => {
    if (state.step !== 5) return;
    if (icon.dataset.icon === "correct") {
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
    dom.trackingSlider.hidden = false;
    dom.softwarePreview.textContent = "";
  }
}

// ---- Step 7: Tracking ----
dom.trackingSlider.addEventListener("input", () => {
  if (state.step !== 7) return;
  const v = Number(dom.trackingSlider.value);
  if (v >= 40 && v <= 60) {
    dom.softwarePreview.className = "software-preview stable";
    dom.trackingSlider.disabled = true;
    setTimeout(() => setStep(8), 700);
  }
});

// ---- Step 8: Record then Play ----
dom.btnRecord.addEventListener("click", () => {
  if (state.step !== 8) return;
  state.recordClicked = true;
  dom.btnRecord.classList.add("active");
  dom.btnRecord.disabled = true;
});
dom.btnPlay.addEventListener("click", () => {
  if (state.step !== 8) return;
  if (!state.recordClicked) {
    dom.dialogueText.textContent = "You just played blank leader — hit Record first, then Play.";
    return;
  }
  state.playClicked = true;
  startCapture();
});

function startCapture() {
  setStep(9);
  dom.progressTrack.hidden = false;
  requestAnimationFrame(() => { dom.progressFill.style.transition = "width 2.2s linear"; dom.progressFill.style.width = "100%"; });
  setTimeout(() => {
    dom.btnStopCapture.hidden = false;
    dom.btnStopCapture.click();
  }, 2300);
}

dom.btnStopCapture.addEventListener("click", () => {
  if (state.step !== 9) return;
  setStep(10);
  dom.filenameField.hidden = false;
  dom.filenameField.value = PATRONS[state.patronKey].filename;
  dom.btnSave.hidden = false;
});

// ---- Step 10: Save ----
dom.btnSave.addEventListener("click", () => {
  if (state.step !== 10) return;
  setStep(11);
});

// ---- Gary's abbreviated montage ----
// Equipment is already known-good from Carol's shift, so setup happens quietly
// in the background; the only manual beat left for Gary is the rewind itself.
function runGaryMontage() {
  setTimeout(() => {
    dom.tapeGraphic.classList.add("inserted");
    dom.tapeCounter.textContent = String(PATRONS.gary.counterStart).padStart(4, "0");
    setStep(2);
  }, 400);
  setTimeout(() => {
    dom.cableBundle.querySelectorAll(".cable-jack").forEach((j) => j.classList.add("confirmed"));
  }, 750);
  setTimeout(() => {
    state.vcrPowered = true; state.capturePowered = true;
    dom.btnPowerVcr.classList.add("active-glow");
    dom.captureBox.classList.add("active-glow");
  }, 1050);
  setTimeout(() => {
    dom.desktopView.hidden = true;
    dom.softwareWindow.hidden = false;
  }, 1350);
  setTimeout(() => {
    dom.inputSelect.value = "composite-ntsc";
  }, 1650);
}

function showWarningReveal() {
  dom.softwarePreview.className = "software-preview warning-card";
  dom.softwarePreview.innerHTML = "FBI ANTI-PIRACY WARNING<br>UNAUTHORIZED REPRODUCTION OF THIS RECORDING IS PROHIBITED";
  setTimeout(() => {
    dom.softwarePreview.innerHTML = "“AMERICAN VOICES: Great Speeches of Our Time” — Heritage Network Special";
    dom.dialogueText.textContent = "Wait — this doesn't look like a home recording...";
    dom.dialogueNext.hidden = false;
  }, 1400);
}

dom.dialogueNext.addEventListener("click", () => {
  showScene("scene-decision");
});

// ---- Decision ----
dom.decisionChoices.querySelectorAll(".choice-card").forEach((card) => {
  card.addEventListener("click", () => {
    state.choice = card.dataset.choice;
    dom.consequenceText.textContent = CONSEQUENCES[state.choice];
    dom.consequenceBox.hidden = false;
    dom.decisionChoices.querySelectorAll(".choice-card").forEach((c) => (c.disabled = true));
  });
});

dom.btnToReflection.addEventListener("click", () => {
  dom.reflectionLine.textContent = REFLECTION[state.choice];
  showScene("scene-reflection");
});

dom.btnFinish.addEventListener("click", () => {
  dom.decisionChoices.querySelectorAll(".choice-card").forEach((c) => (c.disabled = false));
  dom.consequenceBox.hidden = true;
  showScene("scene-intro");
});

// ---- Intro ----
dom.btnStart.addEventListener("click", () => startPatron("carol"));

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
fitCanvas();
