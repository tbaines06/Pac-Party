//Creating a class for the pellets in the game, the collectables that Byte has to
// eat in order to earn points from the game.
class Pellet {
    constructor({ position,}) {
        this.position = position;
        this.radius = 3;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }
}   