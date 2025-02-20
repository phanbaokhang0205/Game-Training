export class InputController {
    constructor() {
        this.keys = {};
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
    }

    isKeyPressed(key) {
        return this.keys[key] || false;
    }


    checkMusicToggle(bg_music) {
        if (this.isKeyPressed('m')) {
            bg_music.play().catch(error => console.log("Lỗi phát nhạc:", error));
        }
    }
}
// const inputController = new InputController();

