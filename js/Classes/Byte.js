//Creating a class for the Byte character which is representative of Byte, allocating the
//attributes of position on the board, velocity because it the the vector of speed thus also has direction
//as well as the radius to give the character its circular shape, it similarly has the method of draw to
//ensure the colour and shape of the character remain without leaving a trail behind. Also the 
//method of update ensures that at every movement, that the position of the character is updated to go 
//along with this character movement

const SPEED = 200; // Movement speed multiplier
const chomprate = 30;

// Represents a game entity "Byte" with position, velocity, and behavior
class Byte {
  constructor({ position, velocity }) {
    this.position = position; // Current position of the entity
    this.velocity = velocity; // Current velocity of the entity
    this.radius = 15; // Radius of the entity
    this.radians = 0.75; // Angle for "mouth" opening
    this.openRate = 0.12; // Rate of change for mouth opening/closing
    this.rotation = 0; // Rotation angle of the entity
    this.desiredDirection = { // Intended direction of movement
      x: 0,
      y: 0,
    };
    this.state = 'active';
  }

  // Draws the Byte on the canvas
  draw() {
    c.save(); // Save the canvas state
    c.translate(this.position.x, this.position.y); // Move to Byte's position
    c.rotate(this.rotation); // Apply rotation
    c.translate(-this.position.x, -this.position.y); // Reset translation
    c.beginPath(); // Begin drawing
    c.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radians,
      Math.PI * 2 - this.radians, // Arc for the "mouth" opening
    );
    c.lineTo(this.position.x, this.position.y); // Close the shape
    c.fillStyle = '#ffbcff'; // Fill color
    c.fill();
    c.closePath();
    c.restore(); // Restore the canvas state
  }

  // Updates the intended direction based on input
  move(direction) {
    switch (direction) {
      case 'up':
        this.desiredDirection = { x: 0, y: -1 };
        break;
      case 'down':
        this.desiredDirection = { x: 0, y: 1 };
        break;
      case 'left':
        this.desiredDirection = { x: -1, y: 0 };
        break;
      case 'right':
        this.desiredDirection = { x: 1, y: 0 };
        break;
    }
  }

  // Checks for collisions with boundaries
  collision(boundaries) {
    for (const boundary of boundaries) {
      if (
        circleCollidesWithRectangle({
          circle: this,
          rectangle: boundary,
        })
      ) {
        return true; // Collision detected
      }
    }
    return false; // No collision
  }

  // Aligns Byte to a grid for smooth positioning
  snapToGrid() {
    const CELL_SIZE = 20; // Size of each grid cell
    this.position = {
      x: Math.round(this.position.x / CELL_SIZE) * CELL_SIZE,
      y: Math.round(this.position.y / CELL_SIZE) * CELL_SIZE,
    };
  }

  // Determines if the desired move is valid
  isValidMove(boundaries) {
    const pixelbuffer= 5; // Buffer for collision checking
    for (const boundary of boundaries) {
      if (
        circleCollidesWithRectangle({
          circle: {
            ...this,
            velocity: {
              x: this.desiredDirection.x * pixelbuffer,
              y: this.desiredDirection.y * pixelbuffer,
            },
          },
          rectangle: boundary,
        })
      ) {
        return false; // Invalid move
      }
    }
    return true; // Valid move
  }

  moveByteWithInput(delta, boundaries){
    // Update velocity if the desired move is valid
    if (this.isValidMove(boundaries)) {
      this.velocity.x = this.desiredDirection.x;
      this.velocity.y = this.desiredDirection.y;
    }

    // Handle collision
    if (this.collision(boundaries)) {
      this.velocity.x = 0;
      this.velocity.y = 0;
      this.snapToGrid(); // Align to grid after collision
    } else {
      // Update position based on velocity and delta time
      this.position.x += this.velocity.x * delta * SPEED;
      this.position.y += this.velocity.y * delta * SPEED;
    }

    // Handle mouth opening and closing
    if (this.radians < 0 || this.radians > 0.75) this.openRate = -this.openRate;
    this.radians = Math.max(0, Math.min(this.radians, 0.75));
    this.radians += this.openRate * delta * chomprate;

    this.verticalTeleport();
    this.horizontalTeleport();
    
  }

  verticalTeleport(){
    //Transport between openings
    if (this.position.y + this.radius < 0) this.position.y = canvas.height
    else if (this.position.y - this.radius > canvas.height) this.position.y = 0
  }

  horizontalTeleport(){
    if (this.position.x + this.radius < 0) this.position.x = canvas.width
    else if (this.position.x - this.radius > canvas.width) this.position.x = 0
  }

  byteDeath(lives, game){
    this.state = 'initDeath';
    gsap.to(this, {
      radians: Math.PI - 0.0001,
      onComplete: () => {
        setTimeout(()=>{
          if (lives>0){
            game.init();
            game.initStart();
          }else{
            sound.gamesound.stop()
            sound.introduction.play()
            game.end()
          }
         
        },750 )
        
      }
    })
  }

  // Updates Byte's state, including movement and collision handling
  update(delta, boundaries) {
    this.draw();
    switch (this.state){
      case 'active':
        this.moveByteWithInput(delta, boundaries);
        break
      case 'initDeath':
        this.state = 'death'
        break
    }

    
  }
}
