// The function sets up the game map by iterating over a 2D array, creating boundaries, pellets,
// power-ups, and items based on specific symbols. The Boundary class is used to define map edges,
// while importImage is used to load the correct images for each section of the maze.
function generateBoundaries(currentLevelIndex, map) {
    const boundaries = [];
    const MAP_ROWS = maps[currentLevelIndex].length;
    const MAP_COLUMNS = maps[currentLevelIndex][0].length;
    
    // Set canvas size based on map dimensions
    canvas.width = Boundary.width * MAP_COLUMNS;
    canvas.height = Boundary.height * MAP_ROWS;
  
    // Iterate through each row and column of the map array
    map[currentLevelIndex].forEach((row, i) => {
      row.forEach((symbol, j) => {
        const x = j * Boundary.width;
        const y = i * Boundary.height;
  
        // Switch case to handle different map symbols
        switch (symbol) {
          // Horizontal and vertical pipes
          case '-':
            boundaries.push(new Boundary({
              position: { x, y },
              image: importImage('./img/pipeHorizontal.png'),
            }));
            break;
          case '|':
            boundaries.push(new Boundary({
              position: { x, y },
              image: importImage('./img/pipeVertical.png'),
            }));
            break;
          
          // Corners
          case '1':
            boundaries.push(new Boundary({
              position: { x, y },
              image: importImage('./img/pipeCorner1.png'),
            }));
            break;
          case '2':
            boundaries.push(new Boundary({
              position: { x, y },
              image: importImage('./img/pipeCorner2.png'),
            }));
            break;
          case '3':
            boundaries.push(new Boundary({
              position: { x, y },
              image: importImage('./img/pipeCorner3.png'),
            }));
            break;
          case '4':
            boundaries.push(new Boundary({
              position: { x, y },
              image: importImage('./img/pipeCorner4.png'),
            }));
            break;
  
          // Block
          case 'b':
            boundaries.push(new Boundary({
              position: { x, y },
              image: importImage('./img/block.png'),
            }));
            break;
  
          // Caps
          case '[':
            boundaries.push(new Boundary({
              position: { x, y },
              image: importImage('./img/capLeft.png'),
            }));
            break;
          case ']':
            boundaries.push(new Boundary({
              position: { x, y },
              image: importImage('./img/capRight.png'),
            }));
            break;
          case '_':
            boundaries.push(new Boundary({
              position: { x, y },
              image: importImage('./img/capBottom.png'),
            }));
            break;
          case '^':
            boundaries.push(new Boundary({
              position: { x, y },
              image: importImage('./img/capTop.png'),
            }));
            break;
  
          // Cross
          case '+':
            boundaries.push(new Boundary({
              position: { x, y },
              image: importImage('./img/pipeCross.png'),
            }));
            break;
  
          // Connectors
          case '5':
            boundaries.push(new Boundary({
              position: { x, y },
              color: 'blue',
              image: importImage('./img/pipeConnectorTop.png'),
            }));
            break;
          case '6':
            boundaries.push(new Boundary({
              position: { x, y },
              color: 'blue',
              image: importImage('./img/pipeConnectorRight.png'),
            }));
            break;
          case '7':
            boundaries.push(new Boundary({
              position: { x, y },
              color: 'blue',
              image: importImage('./img/pipeConnectorBottom.png'),
            }));
            break;
          case '8':
            boundaries.push(new Boundary({
              position: { x, y },
              image: importImage('./img/pipeConnectorLeft.png'),
            }));
            break;
  
          // Pellet positions (small dots)
          case '.':
            pellets.push(new Pellet({
              position: {
                x: x + Boundary.width / 2,
                y: y + Boundary.height / 2,
              },
            }));
            break;
  
          // Power-up positions (large dots)
          case 'p':
            powerUps.push(new PowerUp({
              position: {
                x: x + Boundary.width / 2,
                y: y + Boundary.height / 2,
              },
            }));
            break;
  
          // Item positions (extra items like pizza and soda)
          case 'I':
            items.push(new Item({
              position: {
                x: x + Boundary.width / 2,
                y: y + Boundary.height / 2,
              },
              imgSrc: './img/Assets2/SinglePizzaBig.png',
            }));
            break;
          case 'T':
            items.push(new Item({
              position: {
                x: x + Boundary.width / 2,
                y: y + Boundary.height / 2,
              },
              imgSrc: './img/Assets2/MainSoda.png',
            }));
            break;
        }
      });
    });
  
    return boundaries;
  }
  

