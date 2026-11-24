function circleCollidesWithRectangle({ circle, rectangle }) {
  // Adjust padding for collision detection
  const padding = Boundary.width / 2 - circle.radius - 2;

  // Check if the circle collides with the rectangle
  return (
      circle.position.y - circle.radius + circle.velocity.y <=
          rectangle.position.y + rectangle.height + padding &&
      circle.position.x + circle.radius + circle.velocity.x >=
          rectangle.position.x - padding &&
      circle.position.y + circle.radius + circle.velocity.y >=
          rectangle.position.y - padding &&
      circle.position.x - circle.radius + circle.velocity.x <=
          rectangle.position.x + padding + rectangle.width
  );
}

function createImage(src) {
  // Create and return an image object
  const image = new Image();
  image.src = src;
  return image;
}
