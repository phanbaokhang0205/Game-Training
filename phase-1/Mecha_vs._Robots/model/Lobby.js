export class Lobby {
    constructor(context, weaponItems) {
        this.context = context;
        this.canvas = context.canvas;
        this.x = 850;
        this.y = 0;
        this.width = 600;
        this.heght = 115;
        this.weaponItems = weaponItems
    }

    drawWeaponItem() {
        this.weaponItems.forEach(obj => {
            const image = new Image()
            image.src = obj.src;
            this.context.drawImage(image, obj.x, obj.y, 80, 80);
        });
    }

    drawLobby() {
        this.strokeStyle = 'black';
        this.context.strokeRect(this.x - this.width, this.y, this.width, this.heght)
    }


}