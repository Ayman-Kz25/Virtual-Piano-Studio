const pianoState = {
  power: false,
  volume: 0.5,
  instrument: "Piano",
  currentNote: null,
};

const display = document.getElementById("display");
const powerBtn = document.getElementById("power-btn");
const instrumentSelect = document.getElementById("instrument");
const volumeSlider = document.getElementById("volume");
const pianoKeys = document.querySelectorAll(".white-key, .black-key");

const effects = document.querySelector(".background-effects");

let instrument = new Tone.Synth().toDestination();

function updateDisplay(text) {
  display.textContent = text;
}

async function togglePower() {
  if (!pianoState.power) {
    await Tone.start();
  }

  pianoState.power = !pianoState.power;
  instrumentSelect.disabled = !pianoState.power;
  volumeSlider.disabled = !pianoState.power;
  display.style.color = pianoState.power
    ? "var(--power_on)"
    : "var(--power_off)";

  if (pianoState.power) {
    updateDisplay(`Instrument: ${pianoState.instrument}`);
    powerBtn.textContent = "ON";
    powerBtn.classList.remove("power-off");
    powerBtn.classList.add("power-on");
  } else {
    updateDisplay("Power Off");
    powerBtn.textContent = "OFF";
    powerBtn.classList.remove("power-on");
    powerBtn.classList.add("power-off");
  }
}

function playNote(note) {
  if (!pianoState.power) {
    return;
  }

  const key = document.querySelector(`[data-note="${note}"]`);

  key.classList.add("active");

  setTimeout(() => {
    key.classList.remove("active");
  }, 120);

  instrument.triggerAttackRelease(note, "8n");

  updateDisplay(note);
}

function createBlobs(count = 4) {
  const colors = ["#ffb3d1", "#ffd4e5", "#ffc8dd", "#ffe4f1"];

  for (let i = 0; i < count; i++) {
    const blob = document.createElement("span");

    blob.className = "blob";

    const size = 220 + Math.random() * 180;

    blob.style.width = `${size}px`;
    blob.style.height = `${size}px`;

    blob.style.left = `${Math.random() * 100}%`;
    blob.style.top = `${Math.random() * 100}%`;

    blob.style.background = colors[i % colors.length];

    blob.style.opacity = 0.35 + Math.random() * 0.2;

    blob.style.animationDuration = `${18 + Math.random() * 10}s`;

    effects.appendChild(blob);
  }
}

function createBubbles(count = 100) {
  for (let i = 0; i < count; i++) {
    const bubble = document.createElement("span");

    bubble.className = "bubble";

    const size = 8 + Math.random() * 28;

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.top = `${Math.random() * 100}%`;

    bubble.style.animationDuration = `${8 + Math.random() * 15}s`;

    bubble.style.animationDelay = `${Math.random() * 10}s`;

    bubble.style.opacity = 0.15 + Math.random() * 0.45;

    effects.appendChild(bubble);
  }
}

function reactBackground() {
  document.querySelectorAll(".bubble").forEach((bubble) => {
    const x = (Math.random() - 0.5) * 120;
    const y = (Math.random() - 0.5) * 120;
    const s = 1 + Math.random();

    bubble.style.transform = `translate(${x}px,${y}px)
         scale(${s})`;
  });

  setTimeout(() => {
    document
      .querySelectorAll(".bubble")
      .forEach((b) => (b.style.transform = ""));
  }, 250);
}

function createRipple(x, y) {
  const ripple = document.createElement("span");

  ripple.className = "note-ripple";

  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  effects.appendChild(ripple);

  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
}

powerBtn.addEventListener("click", togglePower);

const keyMap = {
  a: "C4",
  w: "C#4",

  s: "D4",
  e: "D#4",

  d: "E4",

  f: "F4",
  t: "F#4",

  g: "G4",
  y: "G#4",

  h: "A4",
  u: "A#4",

  j: "B4",
};

document.addEventListener("keydown", (e) => {
  const note = keyMap[e.key];
  if (note) {
    playNote(note);
    reactBackground();
    createRipple(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight,
    );
  }
});

volumeSlider.addEventListener("input", () => {
  pianoState.volume = volumeSlider.value / 100;
  instrument.volume.value = Tone.gainToDb(pianoState.volume);
  if (pianoState.power) {
    updateDisplay(`Volume: ${volumeSlider.value}%`);
  }
});

instrumentSelect.addEventListener("change", () => {
  if (!pianoState.power) return;
  pianoState.instrument = instrumentSelect.value;
  updateDisplay(
    `Instrument: ${instrumentSelect.options[instrumentSelect.selectedIndex].text}`,
  );
  switch (instrumentSelect.value) {
    case "piano":
      instrument = new Tone.Synth().toDestination();
      instrument.volume.value = Tone.gainToDb(pianoState.volume);
      break;
    case "electric":
      instrument = new Tone.FMSynth().toDestination();
      instrument.volume.value = Tone.gainToDb(pianoState.volume);
      break;
    case "organ":
      instrument = new Tone.AMSynth().toDestination();
      instrument.volume.value = Tone.gainToDb(pianoState.volume);
      break;
  }
});

pianoKeys.forEach((key) => {
  key.addEventListener("click", () => {
    if (key.classList.contains("spacer")) return;

    playNote(key.dataset.note);
    reactBackground();
    createRipple(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight,
    );
  });
});

window.addEventListener("DOMContentLoaded", () => {
  createBlobs();
  createBubbles();
});