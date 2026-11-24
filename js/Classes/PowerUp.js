//The creation of the powerup class 
class PowerUp {
    constructor({ position,}) {
        this.position = position;
        this.radius = 9;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }
}
