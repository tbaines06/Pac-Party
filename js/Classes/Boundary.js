//Creating a class for the boundary of the maze with the attributes of its width and heights
//with the constructor to initalise the object of position, then the draw method to fill the colour
//of the boundary maze

class Boundary {
    static width = 40;
    static height = 40;
    constructor({ position, image }) {
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.image = image;
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

