const pianoState = {
  power: false,
  volume: 0.5,
  instrument: "piano",
  currentNote: null,
};

const display = document.getElementById("display");
const powerBtn = document.getElementById("power-btn");
const instrumentSelect = document.getElementById("instrument");
const volumeSlider = document.getElementById("volume");
const pianoKeys = document.querySelectorAll(".white-key, .black-key");

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
    updateDisplay("Piano Ready");
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

    if(key.classList.contains("spacer")) return;
    
    playNote(key.dataset.note);
  });
});
