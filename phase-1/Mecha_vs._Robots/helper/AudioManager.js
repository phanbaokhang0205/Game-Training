export class AudioManager {
    constructor() {
        this.sounds = {};
    }

    loadSound(name, src) {
        const audio = new Audio(src);
        this.sounds[name] = audio;
    }

    playSound(name) {
        if (this.sounds[name]) this.sounds[name].play();
    }
}

// const audioManager = new AudioManager();
// audioManager.loadSound('jump', 'jump.wav');
// audioManager.playSound('jump');  // Plays the "jump" sound

