import { Weapon } from "./Weapon.js";
import { Lobby } from "./Lobby.js";

export class Grid {
    constructor(rows, cols, context, cw, ch) {
        this.rows = rows;
        this.cols = cols;
        this.context = context;
        this.canvas = context.canvas;
        this.cellWidth = cw / cols;
        this.cellHeight = ch / rows;

        this.weaponItems = []
        this.draggingWeapon = null;

        this.installWeapon();

        // Khoi tao mang 2 chieu
        this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));

        // lobby
        this.lobby = new Lobby(this.context, this.weaponItems)

        const weapon1 = new Weapon(this.context, this.lobby.x - this.lobby.width + 0, 0, "weapon1", 4, 4, 1)
        const weapon2 = new Weapon(this.context, this.lobby.x - this.lobby.width + 200, 0, "weapon2", 6, 6, 2)
        const weapon3 = new Weapon(this.context, this.lobby.x - this.lobby.width + 400, 0, "weapon3", 4, 6, 3)
        this.weaponItems.push(weapon1)
        this.weaponItems.push(weapon2)
        this.weaponItems.push(weapon3)

    }

    draw() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.context.strokeStyle = "green";
                this.context.strokeRect(
                    col * this.cellWidth,
                    row * this.cellHeight,
                    this.cellWidth,
                    this.cellHeight
                );

                // Neu o co gia tri 
                const weapon = this.grid[row][col];
                if (weapon) {
                    weapon.draw(weapon._x, weapon._y);
                }
            }
        }
    }

    drawWeaponIcon() {
        // Vẽ Weapon đang được kéo (nếu có)
        if (this.draggingWeapon) {
            this.draggingWeapon.draw(this.draggingWeapon._x, this.draggingWeapon._y)
        }

        this.lobby.drawLobby()
        this.lobby.drawWeaponItem()
    }

    // installWeapon params:
    installWeapon() {
        // su kien chon 1 weapon de install len canvas
        this.canvas.addEventListener("mousedown", (e) => {
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;


            // Kiem tra weapon nao duoc chon
            const selectedWeapon = this.weaponItems.find(obj => {
                return (
                    mouseX >= obj.x &&
                    mouseX <= obj.x + obj.width &&
                    mouseY >= obj.y &&
                    mouseY <= obj.y + obj.height
                );
            });

            // console.log(mouseX);
            // console.log(mouseY);
            // console.log(selectedWeapon);

            if (selectedWeapon) {
                this.draggingWeapon = selectedWeapon; // Lưu trực tiếp đối tượng Weapon
                this.draggingWeapon._x = mouseX;
                this.draggingWeapon._y = mouseY;

                // console.log(this.draggingWeapon);
            }
        });

        this.canvas.addEventListener("mousemove", (e) => {
            if (this.draggingWeapon) {
                // Cập nhật vị trí của plant đang kéo
                this.draggingWeapon._x = e.offsetX;
                this.draggingWeapon._y = e.offsetY;
                // console.log(this.draggingWeapon._x);
                // console.log(this.draggingWeapon._y);
            }
        });

        this.canvas.addEventListener("mouseup", (e) => {
            if (this.draggingWeapon) {
                const mouseX = e.offsetX;
                const mouseY = e.offsetY;

                // Tính chỉ số hàng và cột dựa trên vị trí thả
                const col = Math.floor(mouseX / this.cellWidth);
                const row = Math.floor(mouseY / this.cellHeight);

                // Kiểm tra hợp lệ trước khi thả plant
                if (
                    row >= 0 && row < this.rows
                    && col >= 0 && col < this.cols
                    && !this.grid[row][col]
                ) {
                    this.grid[row][col] = this.draggingWeapon; // Đặt weapon vào lưới
                    console.log(
                        `Weapon placed at row: ${row}, col: ${col}, x: ${this.draggingWeapon._x}, y: ${this.draggingWeapon._y}`
                    );
                }

                this.draggingWeapon = null; // Ngừng kéo
            }
        })
    }

}