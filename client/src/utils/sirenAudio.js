// Web Audio API emergency siren synthesizer
class SirenSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.oscillator = null;
    this.gainNode = null;
    this.isPlaying = false;
    this.intervalId = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  play() {
    this.init();
    if (this.isPlaying) return;

    try {
      this.oscillator = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      // Sawtooth waveform gives realistic emergency vehicle siren timbre
      this.oscillator.type = 'sawtooth';
      
      // Start with low frequency
      const now = this.audioCtx.currentTime;
      this.oscillator.frequency.setValueAtTime(650, now);

      // Volume envelope
      this.gainNode.gain.setValueAtTime(0.01, now);
      this.gainNode.gain.exponentialRampToValueAtTime(0.18, now + 0.1);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.oscillator.start();
      this.isPlaying = true;

      // Frequency modulation warble (650Hz to 1050Hz cycle)
      let goingUp = true;
      this.intervalId = setInterval(() => {
        if (!this.isPlaying || !this.audioCtx) return;
        const curTime = this.audioCtx.currentTime;
        if (goingUp) {
          this.oscillator.frequency.linearRampToValueAtTime(1050, curTime + 0.7);
        } else {
          this.oscillator.frequency.linearRampToValueAtTime(650, curTime + 0.7);
        }
        goingUp = !goingUp;
      }, 750);
    } catch (e) {
      console.warn('AudioContext failed to start (interaction needed):', e);
    }
  }

  stop() {
    if (!this.isPlaying) return;
    try {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      if (this.gainNode && this.audioCtx) {
        const now = this.audioCtx.currentTime;
        this.gainNode.gain.linearRampToValueAtTime(0.001, now + 0.2);
        setTimeout(() => {
          if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator.disconnect();
            this.oscillator = null;
          }
          this.isPlaying = false;
        }, 250);
      } else {
        this.isPlaying = false;
      }
    } catch (e) {
      console.error('Error stopping siren:', e);
      this.isPlaying = false;
    }
  }

  setVolume(volumePercent) {
    if (this.gainNode && this.audioCtx) {
      const vol = Math.max(0, Math.min(1, volumePercent / 100)) * 0.25;
      this.gainNode.gain.setValueAtTime(vol, this.audioCtx.currentTime);
    }
  }
}

export const sirenEngine = new SirenSynthesizer();
