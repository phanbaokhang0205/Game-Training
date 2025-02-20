import { Weapon } from "./Weapon.js";
import { Lobby } from "./Lobby.js";
import { CollisionManager } from "../helper/CollisionManager.js";
import { GameManager } from "../helper/GameManager.js";
import { AudioManager } from "../helper/AudioManager.js";

export class Grid {
    static instance = null
    constructor(rows, cols, context, cw, ch) {
        Grid.instance = this;

        this.rows = rows;
        this.cols = cols;
        this.context = context;
        this.canvas = context.canvas;
        this.cellWidth = cw / cols;
        this.cellHeight = ch / rows - 2;

        this.weaponItems = []
        this.draggingWeapon = null;
        this.weapons = []

        this.au_install = new AudioManager()
        this.au_install.loadSound('install', '../audio/install_weapon.mp3')

        this.installWeapon(GameManager.instance);

        this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));

        this.lobby = new Lobby(this.context, this.weaponItems)
        this.createWeaponLobby();


    }

    createWeaponLobby() {
        const weapon1 = new Weapon(this.lobby.x - this.lobby.width + 0, 0, "weapon1", 4, 4, 1, false, 100, 10, 2500, 10)
        const weapon2 = new Weapon(this.lobby.x - this.lobby.width + 200, 0, "weapon2", 6, 6, 2, false, 100, 20, 1250, 10)
        const weapon3 = new Weapon(this.lobby.x - this.lobby.width + 400, 0, "weapon3", 4, 4, 3, false, 200, 50, 3000, 30)
        this.weaponItems.push(weapon1)
        this.weaponItems.push(weapon2)
        this.weaponItems.push(weapon3)
    }

    draw() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.context.strokeStyle = "rgba(0, 0, 0, 0)";
                this.context.strokeRect(
                    col * this.cellWidth,
                    row * this.cellHeight,
                    this.cellWidth,
                    this.cellHeight
                );

                const weapon = this.grid[row][col];
                if (weapon) {
                    weapon.draw(weapon._x, weapon._y, this.context);
                }
            }
        }

        this.drawWeaponIcon()
    }

    drawWeaponIcon() {
        if (this.draggingWeapon) {
            this.draggingWeapon.draw(this.draggingWeapon._x, this.draggingWeapon._y, this.context)
        }
        this.weaponItems.forEach(w => {
            this.drawInfo(this.context, w.sun, w.x + 20, w.y + 20)
        })

        this.lobby.drawLobby()
        this.lobby.drawWeaponItem()

    }


    drawInfo(context, sun, x, y) {
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.fillText(`${sun} ☀️`, x, y);
    }

    installWeapon(gameMng) {
        this.canvas.addEventListener("mousedown", (e) => {
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;

            const selectedWeapon = this.weaponItems.find(obj => {
                return (
                    mouseX >= obj.x &&
                    mouseX <= obj.x + obj.width &&
                    mouseY >= obj.y &&
                    mouseY <= obj.y + obj.height
                );
            });

            if (selectedWeapon) {
                this.draggingWeapon = new Weapon(
                    mouseX, mouseY,
                    selectedWeapon.imgSrc,
                    selectedWeapon.idleSprite, selectedWeapon.shootSprite,
                    selectedWeapon.level, false,
                    100, selectedWeapon.sun,
                    selectedWeapon.atkSpeed, selectedWeapon.damage
                )
            }
        });

        this.canvas.addEventListener("mousemove", (e) => {
            if (this.draggingWeapon) {
                this.draggingWeapon.x = e.offsetX - 40;
                this.draggingWeapon.y = e.offsetY - 30;
            }
        });

        this.canvas.addEventListener("mouseup", (e) => {

            if (this.draggingWeapon && this.draggingWeapon.sun <= gameMng.suns) {
                const mouseX = e.offsetX;
                const mouseY = e.offsetY;

                const col = Math.floor(mouseX / this.cellWidth);
                const row = Math.floor(mouseY / this.cellHeight);

                if (
                    row >= 1 && row < this.rows
                    && col >= 0 && col < this.cols
                    && !this.grid[row][col]
                ) {
                    const centerX = col * this.cellWidth + this.cellWidth / 2 - this.draggingWeapon.width / 2;
                    const centerY = row * this.cellHeight + this.cellHeight / 2 - this.draggingWeapon.height / 2;

                    this.draggingWeapon.x = centerX;
                    this.draggingWeapon.y = centerY;

                    this.grid[row][col] = this.draggingWeapon;
                    this.weapons.push(this.draggingWeapon)
                    this.draggingWeapon.isInstalled = true

                    gameMng.suns -= this.draggingWeapon.sun
                    this.au_install.playSound('install')
                }

                this.draggingWeapon = null;
            }
            this.draggingWeapon = null;
        })
    }

    clearWeapons() {
        this.weapons.forEach(weapon => {
            weapon.isAlive = false;
            CollisionManager.instance.removeCollider(weapon.collider)
            this.removeFromGrid(weapon)
            weapon.bullets.forEach(b => { b.removeBullets() })
        })
    }

    updateWeapon(enemies) {
        let weaponList = []
        this.weapons.forEach(weapon => {
            weapon.update(enemies)
            if (!weapon.isAlive) {
                weaponList.push(weapon)
            }
        })

        if (weaponList.length > 0) {
            weaponList.forEach(w => {
                this.weapons.splice(this.weapons.indexOf(w), 1)

                this.removeFromGrid(w)
            })
        }
    }

    removeFromGrid(w) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.grid[row][col] === w) {
                    this.grid[row][col] = null;
                }
            }
        }
    }

}