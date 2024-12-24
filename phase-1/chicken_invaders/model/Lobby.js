export class Lobby {
    constructor(context, weaponItems) {
        this.context = context;
        this.canvas = context.canvas;
        this.x = this.canvas.width;
        this.y = 0;
        this.width = 600;
        this.heght = 115;
        this.weaponItems = weaponItems
    }

    drawWeaponItem() {
        this.weaponItems.forEach(obj => {
            const image = new Image()
            image.src = obj.src;
            this.context.drawImage(image, obj.x, obj.y, 100, 100);
        });
    }

    drawLobby() {
        this.strokeStyle = 'red';
        this.context.strokeRect(this.x - this.width, this.y, this.width, this.heght)
    }

}