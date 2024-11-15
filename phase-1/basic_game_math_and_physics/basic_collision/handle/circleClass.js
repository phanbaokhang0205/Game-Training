import { GameObject } from "./gameObject.js";

export class Circle extends GameObject
{
constructor (context, x, y, vx, vy, mass, radius, restitution = 0.90){
        super(context, x, y, vx, vy, mass);

        // Set default radius
        this.radius = radius || 25;
        this.restitution = restitution;
    }
    

    draw(){
        // Draw a simple circle
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.context.fillStyle = this.isColliding ? '#ff8080' : '#0099b0';
        this.context.fill();

        // Draw heading vector
        // this.context.beginPath();
        // this.context.moveTo(this.x, this.y);
        // this.context.lineTo(this.x + this.vx, this.y + this.vy);
        // this.context.stroke();
    }

    update(secondsPassed){
        // Set gravitational acceleration
        const g = 9.81;
        // Apply acceleration
        this.vy += g * secondsPassed;

        // Move with set velocity
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;

        // Calculate the angle (vy before vx)
        let radians = Math.atan2(this.vy, this.vx);

        // Convert to degrees
        let degrees = 180 * radians / Math.PI;
    }
}