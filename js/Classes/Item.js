class Item {
    constructor({ position, imgSrc }) {
        // Set the initial position of the item
        this.position = position;
        // Define the radius of the item
        this.radius = 9;
        // Create a new image for the item
        this.image = new Image();
        // Set the image source
        this.image.src = imgSrc;
        // Track whether the image has finished loading
        this.loaded = false;
        this.image.onload = () => {
            this.loaded = true; // Mark as loaded once the image has finished loading
        };
        // Set the scaling factors for the item's height and width
        this.scaledHeight = 2;
        this.scaledWidth = 2;
        // Save the initial position as the centre for rotation
        this.centre = JSON.parse(JSON.stringify(position));
        // Initial angle in radians for rotation
        this.radians = 0;
    }

    draw() {
        // If the image isn't loaded, don't attempt to draw
        if (!this.loaded) return;

        // Draw the image at the adjusted position
        c.drawImage(
            this.image, 
            this.position.x - this.image.width / 14, 
            this.position.y - this.image.height / 2
        );

        // Increment the angle to create a rotation effect
        this.radians += 0.1;

        // Update the item's position to make it rotate around its centre
        this.position.x = this.centre.x + Math.cos(this.radians);
        this.position.y = this.centre.y + Math.sin(this.radians);
    }
}
