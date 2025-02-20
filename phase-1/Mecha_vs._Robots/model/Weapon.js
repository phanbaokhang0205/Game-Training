import { Bullet } from "./Bullet.js";
import { AudioManager } from "../helper/AudioManager.js";
import RectCollider from "../helper/RectCollider.js";
import { CollisionManager } from "../helper/CollisionManager.js";
import { Enemy } from "./Enemy.js";
import { Grid } from "./Grid.js";
import { GameManager } from "../helper/GameManager.js";

export class Weapon {
    constructor(x, y, imgSrc, idleSprite, shootSprite, level, isShoot, HP, sun, atkSpeed, damage) {
        this.image = new Image()
        this.imgSrc = imgSrc;
        this.src = `../img/weapon/${this.imgSrc}/idle_1.png`
        this.idleSprite = idleSprite
        this.shootSprite = shootSprite;
        this.state = 'idle'
        this.imageIndex = 1;


        this.isAlive = true;
        this.isShoot = isShoot;
        this.isDamaged = false;
        this.isInstalled = false;
        this.isColliderAdded = false;

        this.sun = sun;

        this.HP = HP;
        this.DTPE = 0; // damage taken per Enemy 
        this.range = 0;
        this.baseHP = HP;
        this.level = level;
        this.damage = damage;
        this.atkSpeed = atkSpeed;
        this.targetFound = false;

        this.shootingInterval = null;

        this.rowWeapon = 0;

        // audio
        this.au_shooting = new AudioManager()
        this.au_shooting.loadSound('shooting', '../audio/shooting1.mp3')

        // sprite bullet
        this.bullets = []

        // collider
        this.collider = new RectCollider(
            x, y,
            1, 1,
            this.onCollision.bind(this), this
        )

        setInterval(() => {
            if (this.state === "idle") {
                this.imageIndex = (this.imageIndex % this.idleSprite) + 1;
                this.loadImage();
            }
        }, 150);

        setInterval(() => {
            if (this.state === "shoot") {
                this.imageIndex = (this.imageIndex % this.shootSprite) + 1;
                this.loadImage();
            }
        }, 100);

        this.loadImage()
    }

    decreaseHP(DTPE) {
        if (!this.isDamaged) {

            this.isDamaged = true;
            this.DTPE = DTPE;

            this.HP -= this.DTPE;
            if (this.HP <= 0) {
                this.isAlive = false;
            }

            setTimeout(() => {
                this.isDamaged = false;
            }, 250 * 4);
        }
    }

    loadImage() {
        if (this.state == 'idle') {
            this.image.src = `../img/weapon/${this.imgSrc}/idle_${this.imageIndex}.png`;

        } else if (this.state == 'shoot') {
            this.image.src = `../img/weapon/${this.imgSrc}/shoot_${this.imageIndex}.png`;
        }
        this.image.onload = () => {
            if (this.level === 1) {
                this.width = this.image.width / 1.2
                this.height = this.image.height / 1.2
            }
            else if (this.level === 2) {
                this.width = this.image.width / 1.5
                this.height = this.image.height / 1.5
            }
            else {
                this.width = this.image.width / 1.7
                this.height = this.image.height / 1.7
            }

            this.collider.width = this.width;
            this.collider.height = this.height;

        };
        this.image.onerror = () => {
            console.error("Failed to load weapon image");
        };
    }

    onCollision(otherCollider) {
        if (otherCollider.owner instanceof Enemy) {
            this.decreaseHP(otherCollider.owner.damage)
            if (!this.isAlive) {
                CollisionManager.instance.removeCollider(this.collider);
            }
        } else if (otherCollider.owner instanceof Weapon) {
            return
        }
    }

    shooting() {
        this.state = "shoot";
        this.loadImage();

        if (this.imgSrc === 'weapon3') {
            const bullet = new Bullet(this.x + 40, this.y, this.imgSrc, this.damage);
            this.bullets.push(bullet)
        } else if (this.imgSrc === 'weapon2') {
            const bullet = new Bullet(this.x + 40, this.y, this.imgSrc, this.damage);
            this.bullets.push(bullet)
        }
        else {
            const bullet = new Bullet(this.x + 40, this.y + (this.height / 2), this.imgSrc, this.damage);
            this.bullets.push(bullet)
        }

        this.au_shooting.playSound('shooting')

        setTimeout(() => {
            this.state = "idle";
            this.loadImage();
        }, 400);
    }

    draw(x = this.x, y = this.y, context) {
        if (!this.isAlive) return;

        if (this.image.complete) {
            context.drawImage(this.image, x, y, this.width, this.height);

            // Vẽ thanh máu
            context.fillStyle = "green";
            const hpBarWidth = (this.width * this.HP) / 100;
            context.fillRect(this.x, this.y - 10, hpBarWidth, 5);

        }

        this.bullets.forEach(bullet => {
            bullet.draw(context)
        });

    }

    drawHitBox(context) {
        context.beginPath();
        context.strokeStyle = 'blue';
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.stroke();
    }

    checkForEnemy(enemies) {
        for (let enemy of enemies) {
            if (enemy.rowEnemy === this.rowWeapon && enemy.x > this.x && enemy.x - this.x < this.range) {
                this.targetFound = true;
                this.isShoot = true;
                return;
            }
        }
        this.targetFound = false;
    }

    update(enemies) {
        this.rowWeapon = Math.floor(this.y / Grid.instance.cellHeight);


        if (this.isInstalled && !this.isColliderAdded) {
            CollisionManager.instance.addCollider(this.collider);
            this.isColliderAdded = true;
            this.range = 1000 - this.x
        }

        this.checkForEnemy(enemies);


        // speed attack
        if (this.isAlive && this.targetFound) {
            if (this.isShoot && !this.shootingInterval) {
                this.shootingInterval = setInterval(() => {
                    this.shooting()
                    console.log(GameManager.instance.state);
                }, this.atkSpeed);
            }

            if (GameManager.instance.state === 'pause' || GameManager.instance.state === 'gameOver') {
                clearInterval(this.shootingInterval);
                this.shootingInterval = null;
            }
        } else {
            if (this.shootingInterval) {
                clearInterval(this.shootingInterval);
                this.shootingInterval = null;
            }
        }

        // update bullets
        let hitList = []
        this.bullets.forEach((bullet) => {
            bullet.update()
            if (bullet.isHit) {
                hitList.push(bullet)
            }
        })

        if (hitList.length > 0) {
            hitList.forEach(b => {
                this.bullets.splice(this.bullets.indexOf(b), 1)
            })
        }
    }


    get x() {
        return this.collider.x;
    }

    get y() {
        return this.collider.y;
    }

    set x(value) {
        this.collider.x = value;
    }

    set y(value) {
        this.collider.y = value;
    }
}