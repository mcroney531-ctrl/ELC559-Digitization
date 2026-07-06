const STEP_LABELS = [
  "Step 1 of 11 — Insert the tape",
  "Step 2 of 11 — Rewind the tape",
  "Step 3 of 11 — Check the cable connections",
  "Step 4 of 11 — Power on the equipment",
  "Step 5 of 11 — Open the capture software",
  "Step 6 of 11 — Select input source & format",
  "Step 7 of 11 — Preview & adjust tracking",
  "Step 8 of 11 — Start capture (Record, then Play)",
  "Step 9 of 11 — Let it run, then Stop",
  "Step 10 of 11 — Save the file",
  "Step 11 of 11 — Eject and return the tape"
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

function showScene(id) {
  scenes.forEach((s) => s.classList.toggle("active", s.id === id));
}

function setStep(n) {
  state.step = n;
  dom.stepBanner.textContent = STEP_LABELS[n - 1];
  renderDots();
}

function renderDots() {
  dom.progressDots.innerHTML = "";
  for (let i = 1; i <= 11; i++) {
    const d = document.createElement("div");
    d.className = "dot" + (i < state.step ? " done" : i === state.step ? " current" : "");
    dom.progressDots.appendChild(d);
  }
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
dom.tapeGraphic.addEventListener("click", () => {
  if (state.step === 11 && dom.tapeGraphic.classList.contains("inserted")) {
    dom.tapeGraphic.classList.remove("inserted");
    dom.dialogueText.textContent = PATRONS.carol.closing;
    setTimeout(() => startPatron("gary"), 1600);
  }
});

// ---- Step 2: Rewind ----
dom.btnRewind.addEventListener("click", () => {
  if (state.rewound || state.step !== 2) return;
  dom.btnRewind.classList.add("active-glow");
  let n = PATRONS[state.patronKey].counterStart;
  const timer = setInterval(() => {
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
