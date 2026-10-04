
let Enabled = false;
let Context: AudioContext | null = null;

export function SetSoundEnabled(Next: boolean) {
  Enabled = Next;
}

function GetContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!Context) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    Context = new Ctor();
  }
  if (Context.state === "suspended") void Context.resume();
  return Context;
}

interface TonePreset {
  Frequency: number;
  Duration: number;
  Type: OscillatorType;
  Gain: number;
}

function PlayTone({ Frequency, Duration, Type, Gain }: TonePreset) {
  if (!Enabled) return;
  const Audio = GetContext();
  if (!Audio) return;

  const Oscillator = Audio.createOscillator();
  const GainNode = Audio.createGain();
  Oscillator.type = Type;
  Oscillator.frequency.setValueAtTime(Frequency, Audio.currentTime);

  GainNode.gain.setValueAtTime(0, Audio.currentTime);
  GainNode.gain.linearRampToValueAtTime(Gain, Audio.currentTime + 0.008);
  GainNode.gain.exponentialRampToValueAtTime(0.0001, Audio.currentTime + Duration);

  Oscillator.connect(GainNode);
  GainNode.connect(Audio.destination);
  Oscillator.start();
  Oscillator.stop(Audio.currentTime + Duration + 0.02);
}

export function PlayClick() {
  PlayTone({ Frequency: 720, Duration: 0.07, Type: "sine", Gain: 0.05 });
}

export function PlayToggleOn() {
  PlayTone({ Frequency: 660, Duration: 0.06, Type: "triangle", Gain: 0.06 });
  setTimeout(() => PlayTone({ Frequency: 990, Duration: 0.08, Type: "triangle", Gain: 0.05 }), 55);
}

export function PlayToggleOff() {
  PlayTone({ Frequency: 520, Duration: 0.09, Type: "triangle", Gain: 0.05 });
}

export function PlayConfirm() {
  PlayTone({ Frequency: 500, Duration: 0.05, Type: "sine", Gain: 0.06 });
  setTimeout(() => PlayTone({ Frequency: 760, Duration: 0.12, Type: "sine", Gain: 0.06 }), 60);
}
