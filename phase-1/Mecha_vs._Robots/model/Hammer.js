import { AudioManager } from "../helper/AudioManager.js";
import { GameManager } from "../helper/GameManager.js";
import { Grid } from "./Grid.js";

export class Hammer {
    constructor(x, y, context) {
        this.x = x;
        this.y = y;
        this.context = context;
        this.canvas = context.canvas
        this.image = new Image();
        this.width = 1;
        this.height = 1;
        this.gameMng = GameManager.instance;

        this.positionX = 0;
        this.positionY = 0;

        this.draggingHammer = null;
        this.au_remove = new AudioManager()
        this.au_remove.loadSound('remove', '../audio/remove_weapon.mp3')

        this.handle()
        this.loadImage();
    }
    loadImage() {
        this.image.src = '../img/hammer.png';
        this.image.onload = () => {
            this.width = this.image.width / 3
            this.height = this.image.height / 3
        };
        this.image.onerror = () => {
            console.error("Failed to load weapon image");
        };

    }

    draw() {
        if (this.draggingHammer) {
            this.draggingHammer.draw(this.draggingHammer.x, this.draggingHammer.y, this.context)
        }

        if (this.image.complete) {
            this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    getTouchPosition(e) {
        const touch = e.touches[0] || e.changedTouches[0];
        const rect = e.target.getBoundingClientRect();

        this.positionX = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
        this.positionY = (touch.clientY - rect.top) * (this.canvas.height / rect.height);
    }

    handle() {
        // destop
        this.canvas.addEventListener("mousedown", (e) => { this.pickHammer(e, false) });
        this.canvas.addEventListener("mousemove", (e) => { this.dragHammer(e, false) });
        this.canvas.addEventListener("mouseup", (e) => { this.uncrewWeapon(e, false) })

        // mobile
        this.canvas.addEventListener("touchstart", (e) => { this.pickHammer(e, true) });
        this.canvas.addEventListener("touchmove", (e) => { this.dragHammer(e, true) });
        this.canvas.addEventListener("touchend", (e) => { this.uncrewWeapon(e, true) });
    }

    pickHammer(e, touchable) {
        if (touchable) {
            this.getTouchPosition(e)
        } else {
            this.positionX = e.offsetX;
            this.positionY = e.offsetY;
        }


        if (this.positionX >= this.x &&
            this.positionX <= this.x + this.width &&
            this.positionY >= this.y &&
            this.positionY <= this.y + this.height
        ) {
            this.draggingHammer = new Hammer(this.positionX, this.positionY, this.context)
        }
    }

    dragHammer(e, touchable) {
        if (this.draggingHammer) {
            if (touchable) {
                e.preventDefault()
                this.getTouchPosition(e)
                this.draggingHammer.x = this.positionX - 40;
                this.draggingHammer.y = this.positionY - 30;
            } else {

                this.draggingHammer.x = e.offsetX - 40;
                this.draggingHammer.y = e.offsetY - 30;
            }
        }
    }

    uncrewWeapon(e, touchable) {

        if (this.draggingHammer) {
            if (touchable) {
                e.preventDefault()
                this.getTouchPosition(e)
            } else {
                this.positionX = e.offsetX;
                this.positionY = e.offsetY;
            }

            const col = Math.floor(this.positionX / Grid.instance.cellWidth);
            const row = Math.floor(this.positionY / Grid.instance.cellHeight);


            if (Grid.instance.grid[row][col]) {
                const selectedWeapon = Grid.instance.grid[row][col];
                const refundSun = Math.round(selectedWeapon.sun * 0.75);
                this.gameMng.suns += refundSun;
                selectedWeapon.isAlive = false
                this.au_remove.playSound('remove')
            }
            this.draggingHammer = null;
        }
        this.draggingHammer = null;
    }
}