import { InputController } from "../helper/InputController.js";

export class MenuGame {
    constructor(gameMng) {
        this.input = new InputController();
        this.gameMng = gameMng;
        this.isPause = false;
        this.isKeyPressedOnce = false;

    }

    update() {
        if ((this.input.isKeyPressed('Escape') || this.input.isKeyPressed('p')) && !this.isKeyPressedOnce) {
            this.togglePause();
            this.isKeyPressedOnce = true;
        }

        if (!(this.input.isKeyPressed('Escape') || this.input.isKeyPressed('p'))) {
            this.isKeyPressedOnce = false;
        }
    }

    togglePause() {
        this.isPause = !this.isPause;
        this.gameMng.state = this.isPause ? 'pause' : 'playing';
        console.log(`Game is now ${this.isPause ? 'paused' : 'playing'}`);
    }
}