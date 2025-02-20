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


    handle() {
        this.canvas.addEventListener("mousedown", (e) => {
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;


            if (mouseX >= this.x &&
                mouseX <= this.x + this.width &&
                mouseY >= this.y &&
                mouseY <= this.y + this.height
            ) {
                this.draggingHammer = new Hammer(mouseX, mouseY, this.context)
            }
        });

        this.canvas.addEventListener("mousemove", (e) => {
            if (this.draggingHammer) {
                this.draggingHammer.x = e.offsetX - 40;
                this.draggingHammer.y = e.offsetY - 30;
            }
        });

        this.canvas.addEventListener("mouseup", (e) => {
            if (this.draggingHammer) {
                const mouseX = e.offsetX;
                const mouseY = e.offsetY;

                const col = Math.floor(mouseX / Grid.instance.cellWidth);
                const row = Math.floor(mouseY / Grid.instance.cellHeight);


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
        })
    }
}