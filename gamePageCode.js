// Get the canvas and its 2D context
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Get elements for score, lives, and level display
const scoreEl = document.querySelector('#scoreEl');
const livesEl = document.querySelector('#livesEl');
const levelEl = document.querySelector('#levelEl');

//The layout of the different maps in the game set up through thr arrays
// of which the corresponding switch case is in the file Map SetUP
const maps = [
  [
    ['1', '-', '-', '-', '-', '-', '-', '2', '.', '1', '-', '-', '-', '-', '-', '-', '2'],
    ['|', 'p', '.', '.', '.', '.', '.', '_', '.', '_', '.', '.', '.', '.', '.', 'I', '|'],
    ['|', '.', '1', ']', '.', 'b', '.', '.', '.', '.', '.', 'b', '.', '[', '2', '.', '|'],
    ['|', '.', '|', '.', '.', '.', '.', '[', '7', ']', '.', '.', '.', '.', '|', '.', '|'],
    ['|', '.', '_', '.', '[', ']', '.', '.', '|', '.', '.', '[', ']', '.', '_', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '[', '5', ']', '.', '.', '.', '.', '.', '.', '|'],
    ['4', ']', '.', 'b', '.', 'b', '.', '.', '.', '.', '.', 'b', '.', 'b', '.', '[', '3'],
    ['.', '.', '.', '.', '.', '.', '.', '[', '5', ']', '.', '.', '.', '.', '.', '.', '.'],
    ['1', ']', '.', 'b', '.', 'b', '.', '.', ' ', '.', '.', 'b', '.', 'b', '.', '[', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '[', '7', ']', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', '^', '.', '[', ']', '.', '.', '|', '.', '.', '[', ']', '.', '^', '.', '|'],
    ['|', '.', '|', '.', '.', '.', '.', '[', '5', ']', '.', '.', '.', '.', '|', '.', '|'],
    ['|', '.', '4', ']', '.', 'b', '.', '.', '.', '.', '.', 'b', '.', '[', '3', '.', '|'],
    ['|', 'T', '.', '.', '.', '.', '.', '^', '.', '^', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '3', '.', '4', '-', '-', '-', '-', '-', '-', '3'],
  ],[
    ['1', '-', '-', '-', '-', '-', '-', '2', '.', '1', '-', '-', '-', '-', '-', '-', '2'],
    ['|', 'p', '.', '.', '.', '.', '.', '_', '.', '_', '.', '.', '.', '.', '.', 'I', '|'],
    ['|', '.', '[', '2', '.', '^', '.', '.', '.', '.', '.', '^', '.', '1', ']', '.', '|'],
    ['|', '.', '.', '_', '.', '4', '2', '.', '^', '.', '1', '3', '.', '_', '.', '.', '|'],
    ['6', ']', '.', '.', '.', '.', '|', '.', '|', '.', '|', '.', '.', '.', '.', '[', '8'],
    ['|', '.', '.', '[', ']', '.', '_', '.', '_', '.', '_', '.', '[', ']', '.', '.', '|'],
    ['4', ']', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '[', '3'],
    ['.', '.', '.', '^', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '^', '.', '.', '.'],
    ['1', ']', '.', '|', '.', '.', '.', '.', ' ', '.', '.', '.', '.', '|', '.', '[', '2'],
    ['|', '.', '.', '|', '.', '[', ']', '.', '^', '.', '[', ']', '.', '|', '.', '.', '|'],
    ['6', ']', '.', '_', '.', '.', '.', '.', '|', '.', '.', '.', '.', '_', '.', '[', '8'],
    ['|', '.', '.', '.', '.', '1', ']', '.', '_', '.', '[', '2', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '_', '.', '.', '.', '.', '.', '_', '.', '[', ']', '.', '|'],
    ['|', 'T', '.', '.', '.', '.', '.', '^', '.', '^', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '3', '.', '4', '-', '-', '-', '-', '-', '-', '3'],
  ]
]

// Arrays to store game objects
const pellets = [] // Normal food items for the player
const powerUps = [] // Special items for temporary effects
let ghosts = [] // Array to hold ghost instances
let byte = {} // Player object
let items = [] // Extra collectible items
let ghostSpeed = 75 // Initial speed of the ghosts

//State of Input Keys
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

let lastKey = '' // Keeps track of the last pressed key
let score = 0 // Player's score
let animationId // ID for the animation loop
let prevMs = Date.now() // Tracks the previous timestamp for animations
let accumulatedTime = 0 // Time accumulated for ghost release
let levelcount = 1 // Tracks the level count
const incrementspeed = 25 // Speed increment per level
let ghostReleaseIntervals = [0, 7, 14, 21] // Time intervals for releasing ghosts
let currentLevelIndex = 1 // Tracks the current level index
let lives = 3;
let boundaries = generateBoundaries(currentLevelIndex, maps) // Generates the walls and obstacles for the level
let isMusicPlaying = false; // Variable to track if music is already playing


//Pre-defined positions for the ghosts depending on which map
const ghostPositions = [
  [
    {
      x: Boundary.width * 8 + Boundary.width / 2,
      y: Boundary.height *6  + Boundary.height / 2,
    },
    {
      x: Boundary.width * 8 + Boundary.width / 2,
      y: Boundary.height * 7 + Boundary.height / 2,
    },
    {
      x: Boundary.width * 7 + Boundary.width / 2,
      y: Boundary.height * 7 + Boundary.height / 2,
    },
    {
      x: Boundary.width * 9 + Boundary.width / 2,
      y: Boundary.height * 7 + Boundary.height / 2,
    },
  ],
  [
    {
      x: Boundary.width * 8 + Boundary.width / 2,
      y: Boundary.height * 6 + Boundary.height / 2,
    },
    {
      x: Boundary.width * 8 + Boundary.width / 2,
      y: Boundary.height * 7 + Boundary.height / 2,
    },
    {
      x: Boundary.width * 7 + Boundary.width / 2,
      y: Boundary.height * 7 + Boundary.height / 2,
    },
    {
      x: Boundary.width * 9 + Boundary.width / 2,
      y: Boundary.height * 7 + Boundary.height / 2,
    },
  ],
]

//Game object for initialisation and level management
const game = {
  //Initialise the game and reset all moving objects
  init() {
    //Reset the accumulated time and set up the player character
    accumulatedTime = 0
    // Set up the player character (byte) at the starting position
    byte = new Byte({
      position: {
        x: Boundary.width * 8 + Boundary.width / 2,
        y: Boundary.height * 8 + Boundary.height / 2,
      },
      velocity: { x: 0, y: 0 },
    });
    //Initialise the ghosts
    ghosts = [
      new Ghost({
        position: ghostPositions[currentLevelIndex][0],
        velocity: {
          x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
          y: 0,
        },
        imgSrc: './img/Assets2/sprites/blueGhost.png',
        state: 'active',
        speed: ghostSpeed,
      }),
      new Ghost({
        position: ghostPositions[currentLevelIndex][1],
        velocity: {
          x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
          y: 0,
        },
        imgSrc: './img/Assets2/sprites/greenGhost.png',
        speed: ghostSpeed,
      }),
      new Ghost({
        position: ghostPositions[currentLevelIndex][2],
        velocity: {
          x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
          y: 0,
        },
        imgSrc: './img/Assets2/sprites/redGhost.png',
        speed: ghostSpeed,
      }),
      new Ghost({
        position: ghostPositions[currentLevelIndex][3],
        velocity: {
          x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
          y: 0,
        },
        imgSrc: './img/Assets2/sprites/yellowGhost.png',
        speed: ghostSpeed,
      }),
    ]
    if (!isMusicPlaying && lives > 0) {
      sound.gamesound.play();  // Start the music
      isMusicPlaying = true;  // Mark music as playing
    }
  

  },
  //Pause the characters at the end and start of a new level
  initStart() {
    byte.state = 'paused'
    ghosts.forEach((ghost) => {
      ghost.state = 'paused'
    })

    setTimeout(() => {
      //activate the ghosts and player after the delay
      ghosts[0].state = 'active'
      ghosts[1].state = null
      ghosts[2].state = null
      ghosts[3].state = null
      byte.state = 'active'
    }, 1000) //1 second delay
  },

  //Prepare for the next round
  nextRound(){
    //prepare for the next round and increase speed etc
    byte.state = 'paused'
    ghosts.forEach((ghost) => {
      ghost.state = 'paused'
    })

    //Increase ghost speed and adjust release intervals
    ghostSpeed += incrementspeed;
    ghostReleaseIntervals = ghostReleaseIntervals.map((interval, index) =>{
      if (index === 0)
      return interval
      else if (index === 1 && interval > 1)
      return interval - 1
      else if (index === 2 && interval > 2)
      return interval - 1
      else if (index === 3 && interval > 3)
      return interval - 1
    
    });

    //Allow for the pausing between games and restting which is called
    setTimeout(() => {
      currentLevelIndex++
      if (currentLevelIndex > maps.length - 1) currentLevelIndex = 0
      boundaries = generateBoundaries(currentLevelIndex, maps)
      game.init()
      game.initStart()
    }, 1000)
  },

  //The pausing function of the game
   pausegame(){
    byte.state = 'paused'
    ghosts.forEach((ghost) => {
      ghost.state = 'paused'
    })
  },

  //Ending the game function
  end() {
    cancelAnimationFrame(animationId);

    // Pause the game
    byte.state = 'paused';
    ghosts.forEach((ghost) => {
        ghost.state = 'paused';
    });

    // Store the score in localStorage to use in aftergame.html
    localStorage.setItem('finalScore', score);

    // Create the Game Over message
    const gameOverMessage = document.createElement('div');
    gameOverMessage.textContent = 'Game Over';
    gameOverMessage.style.position = 'absolute';
    gameOverMessage.style.top = '50%';
    gameOverMessage.style.left = '50%';
    gameOverMessage.style.transform = 'translate(-50%, -50%)';
    gameOverMessage.style.padding = '20px';
    gameOverMessage.style.backgroundColor = 'white';
    gameOverMessage.style.color = '#FF073A';
    gameOverMessage.style.fontSize = '30px';
    gameOverMessage.style.fontWeight = 'bold';
    gameOverMessage.style.textAlign = 'center';
    gameOverMessage.style.borderRadius = '10px';
    gameOverMessage.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
    gameOverMessage.style.zIndex = '1000'; // Ensure it appears above other content
    document.body.appendChild(gameOverMessage);

    // Wait for 5 seconds before removing the message and redirecting
    setTimeout(() => {
        gameOverMessage.style.display = 'none'; // Hide the message

        // Redirect to the aftergame page
        window.location.href = "aftergame.html";
    }, 5000);
  }
  
  
}

//Start the game in the first place
game.init();

// Define a new function to pause the ghosts for a specific time duration
function pauseGhosts(duration) {
  ghosts.forEach((ghost) => {
    ghost.state = 'paused'; // Pause all ghosts
  });

  // After the duration, reactivate the ghosts
  setTimeout(() => {
    ghosts.forEach((ghost) => {
      ghost.state = 'active'; // Reactivate all ghosts
    });
  }, duration);
}

//Main animation loop
function animate() {
  animationId = requestAnimationFrame(animate)//Request the next animation frame
  c.clearRect(0, 0, canvas.width, canvas.height)//Clear the canvas for redrawing


  const currentMs = Date.now()
  const delta = (currentMs - prevMs) / 1000
  // Calculate time difference for smooth animation
  prevMs = currentMs

  if (byte.state === 'active') accumulatedTime += delta// Add to time if the player is active

  if (keys.w.pressed && lastKey === 'w') byte.move('up')
  else if (keys.a.pressed && lastKey === 'a') byte.move('left')
  else if (keys.s.pressed && lastKey === 's') byte.move('down')
  else if (keys.d.pressed && lastKey === 'd') byte.move('right')

// detect collision between ghosts and player
for (let i = ghosts.length - 1; 0 <= i; i--) {
  const ghost = ghosts[i]
  // ghost touches player
  if (
    Math.hypot(
      ghost.position.x - byte.position.x,
      ghost.position.y - byte.position.y,
    ) <
      ghost.radius + byte.radius &&
    byte.state === 'active'
  ) {
    if (ghost.state === 'scared') {
      ghosts.splice(i, 1)
      sound.eaten.play()
    } else {
      lives--
      livesEl.innerHTML = lives;
      sound.death.play()
      byte.byteDeath(lives, game)
      ghosts.forEach((ghost) => {
        ghost.state = 'paused'
      })
    }
  }
}


  // win condition goes here
  if (pellets.length === 0 && byte.state === 'active') {
    game.nextRound()
    levelcount += 1;
    levelEl.innerHTML = levelcount;
  }

  // power ups go
  for (let i = powerUps.length - 1; 0 <= i; i--) {
    const powerUp = powerUps[i]
    powerUp.draw()

    // byte collides with powerup
    if (
      Math.hypot(
        powerUp.position.x - byte.position.x,
        powerUp.position.y - byte.position.y,
      ) <
      powerUp.radius + byte.radius
    ) {
      
      powerUps.splice(i, 1)
      sound.normalpartyPellet.play()

      // make ghosts scared
      ghosts.forEach((ghost) => {
        ghost.state = 'preScared'

        setTimeout(() => {
          ghost.state = 'preActive'
        }, 5000)
      })
    }
  }

  // ITEM FOR LOOP
  for (let i = items.length - 1; 0 <= i; i--) {
    const item = items[i];
    item.draw();
  
    // Byte collides with item
    if (
      Math.hypot(
        item.position.x - byte.position.x,
        item.position.y - byte.position.y
      ) <
      item.radius + byte.radius
    ) {
      sound.partyPellet.play();
      items.splice(i, 1);
      score += 50;
      scoreEl.innerHTML = score;
  
      // Freeze all active ghosts for 3 seconds
      ghosts.forEach((ghost) => {
        if (ghost.state === 'active') {
          ghost.state = 'frozen';
          setTimeout(() => {
            ghost.state = 'active';
          }, 3000); // Unfreeze after 3 seconds
        }
      });
    }
  }
  

  // touch pellets here
  for (let i = pellets.length - 1; 0 <= i; i--) {
    const pellet = pellets[i]
    pellet.draw()

    if (
      Math.hypot(
        pellet.position.x - byte.position.x,
        pellet.position.y - byte.position.y,
      ) <
      pellet.radius + byte.radius
    ) {
      //sound.pellet.play()
      pellets.splice(i, 1)
      score += 10
      scoreEl.innerHTML = score
    }
  }

  boundaries.forEach((boundary) => {
    boundary.draw()
  })

  //Update Bytes positioning
  byte.update(delta, boundaries)

//Update Ghosts positioning
  ghosts.forEach((ghost, index) => {
    ghost.update(delta, boundaries)

    if (accumulatedTime > ghostReleaseIntervals[index] && !ghost.outOfCage)
      ghost.enterGame(ghostPositions[currentLevelIndex][1])
  })

  if (byte.velocity.x > 0) byte.rotation = 0
  else if (byte.velocity.x < 0) byte.rotation = Math.PI
  else if (byte.velocity.y > 0) byte.rotation = Math.PI / 2
  else if (byte.velocity.y < 0) byte.rotation = Math.PI * 1.5
} // end of animate()


// Start the animation loop
animate()

document.querySelector('#startButton').addEventListener('click', (e) => {
  document.querySelector('#startScreen').style.display = 'none'

  game.init();
})