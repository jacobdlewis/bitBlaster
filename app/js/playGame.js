
(function(){
  game.state.add('playgame', {create:create, update: update});

    var starfield;
    var laser;
    var cursors;
    var gameOverDelay;
    var score;
    var scoreText;
    var finalScore;
    var storedScores;

    var laserUpgradeGroup;
    var playerLaserCount;
    var powerUp;
    var nextLaserUpgradeTick;
    var scoreBeforeNextLaserUpgrade;

    var playerBulletGroup;
    var player;
    var playerDeathSound;
    var playerDeathEmitter;
    var bulletTime;
    var bullet;

    var UFOShipGroup;
    var UFO;
    var UFODeathEmitter;
    var nextUFOTick;
    var maxUFOs;
    var timeBeforeNextUFO;
    var UFOBulletGroup;
    var UFOBulletTime;
    var explodeUFO;
    var UFOshotSound;

    var bomberShipGroup;
    var bomberSound;
    var bomber;
    var bomberCreated;
    var nextBomberFireTick;
    var mainTheme;
    var bomberDirection;

function create() {
    getStoredScores();
    initializeNumericalVariables();

  //add audio clips & sprites to game
    gameOverDelay = Infinity;
    laser = game.add.audio('laser');
    explodeUFO = game.add.audio('explodeUFO');
    starfield = game.add.tileSprite(0, 0, 600, 600, 'starfield');
    player = game.add.sprite(200, 580, 'player');
    playerDeathEmitter = game.add.emitter(0, 0, 100);
    playerDeathEmitter.makeParticles('playerDeathParticle');
    playerDeathEmitter.gravity = 0;
    UFODeathEmitter = game.add.emitter(0, 0, 100);
    UFODeathEmitter.makeParticles('UFODeathParticle');
    UFODeathEmitter.gravity = 200;
    UFOshotSound = game.add.audio('UFOshot')
    mainTheme = game.add.audio('mainTheme');
    mainTheme.play('', 0, .8, true);
    bomberSound = game.add.audio('bomberFlight');
    playerDeathSound = game.add.audio('playerDeath');

  //set world bounds, physics, cursors
    game.world.setBounds(0, 0, 600, 600);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    cursors = game.input.keyboard.createCursorKeys();

  //create game score & clock
    scoreText = game.add.text(8, 8, 'score: 0', { fontSize: '32px', fill: 'white' });
    clock = game.time;

  //add physics to player's ship
    game.physics.arcade.enable(player);
    player.anchor.setTo(0.5, 0.5);
    player.enableBody = true;
    player.body.setSize(20, 20, 0, 5);
    player.body.collideWorldBounds = true;

  //player bullet group & physics
    playerBulletGroup = game.add.group();
    playerBulletGroup.enableBody = true;
    playerBulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
    playerBulletGroup.createMultiple(50, 'playerBullet');
    playerBulletGroup.setAll('checkWorldBounds', true);
    playerBulletGroup.setAll('outOfBoundsKill', true);

  //UFO group & physics
    UFOShipGroup = game.add.group();
    UFOShipGroup.enableBody = true;
    UFOShipGroup.physicsBodyType = Phaser.Physics.ARCADE;
    UFOShipGroup.setAll('checkWorldBounds', true);
    UFOShipGroup.setAll('outOfBoundsKill', true);

  //UFO bullet group
    UFOBulletGroup = game.add.group();
    UFOBulletGroup.enableBody = true;
    UFOBulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
    UFOBulletGroup.createMultiple(50, 'UFOBullet');
    UFOBulletGroup.setAll('checkWorldBounds', true);
    UFOBulletGroup.setAll('outOfBoundsKill', true);

  //BomberShipGroup
    bomberShipGroup = game.add.group();
    bomberShipGroup.enableBody = true;
    bomberShipGroup.physicsBodyType = Phaser.Physics.ARCADE;
    bomberShipGroup.setAll('checkWorldBounds', true);
    bomberShipGroup.setAll('outOfBoundsKill', true);

  //BomberBulletGroup
    bomberBulletGroup = game.add.group();
    bomberBulletGroup.enableBody = true;
    bomberBulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
    bomberBulletGroup.createMultiple(50, 'bomberBullet');
    bomberBulletGroup.setAll('checkWorldBounds', true);
    bomberBulletGroup.setAll('outOfBoundsKill', true);

  //laserUpgradeGroup
    laserUpgradeGroup = game.add.group();
    laserUpgradeGroup.enableBody = true;
    laserUpgradeGroup.physicsBodyType = Phaser.Physics.ARCADE;
    laserUpgradeGroup.createMultiple(3, 'laserUp');
    laserUpgradeGroup.setAll('checkWorldBounds', true);
    laserUpgradeGroup.setAll('outOfBoundsKill', true);
}

function update() {
  //check for hits/collisions
  game.physics.arcade.collide(playerBulletGroup, UFOShipGroup, playerBulletHitUFO);
  game.physics.arcade.collide(UFOBulletGroup, player, UFOBulletHitPlayer);
  game.physics.arcade.collide(player, UFOShipGroup, playerTouchingUFO);
  game.physics.arcade.collide(player, bomberShipGroup, playerTouchingBomber);
  game.physics.arcade.collide(player, bomberBulletGroup, bomberBulletHitPlayer);
  game.physics.arcade.collide(player, powerUp, upgradeLaser);
  game.physics.arcade.collide(playerBulletGroup, bomberShipGroup, playerBulletHitBomber);
  game.physics.arcade.collide(UFOShipGroup, UFOShipGroup);
  game.physics.arcade.collide(UFOShipGroup, game.world.bounds);

  //scroll starfield background vertically
  starfield.tilePosition.y += 3;

  //check for input to move player
  stopSpriteMomentum(player);
  //player.body.velocity.x = 0;
  //player.body.velocity.y = 0;

  if (cursors.left.isDown) {
    player.body.velocity.x = -200;
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 200;
  }
  if (cursors.up.isDown){
    player.body.velocity.y = -200;
  } else if (cursors.down.isDown) {
    player.body.velocity.y = 200;
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    playerFireBullet();
  }

  if (bomberShipGroup.countLiving() === 0 && score !==0 && score % 1000 === 0) {
    addBomber();
  }

  if (score !== 0 && score % scoreBeforeNextLaserUpgrade === 0 && game.time.now > nextLaserUpgradeTick) {
    dropLaserPowerUp();
  }

  if (bomberShipGroup.countLiving() === 1) {
    if (game.time.now > nextBomberFireTick) {
      fireBomberBullet();
    }
  }

  if (UFOShipGroup.countLiving() < maxUFOs) {
    if (game.time.now > nextUFOTick) {
      addUFO();
      fireUFOBullet();
      nextUFOTick = game.time.now + timeBeforeNextUFO;
    }
  }
  if (game.time.now > gameOverDelay) {
    game.state.start('gameOver', true, false, finalScore);
  }
}

//functions
function addBomber () {
  if (bomberDirection){
    bomber = bomberShipGroup.create(570, 30, 'bomberShip');
    bomber.body.velocity.x = -200;
    bomberDirection = false;
  } else {
    bomber = bomberShipGroup.create(-30, 30, 'bomberShip');
    bomber.body.velocity.x = 200;
    bomberDirection = true;
  }
  bomber.anchor.setTo = (0.5, 0.5);
  bomber.checkWorldBounds = true;
  bomber.outOfBoundsKill = true;
  bomberCreated = game.time.now;
}

function fireBomberBullet () {
  bomberBullet = bomberBulletGroup.getFirstExists(false);
    if (bomberBullet) {
      bomberBullet.anchor.setTo(0.5, 0.5);
      bomberBullet.animations.add('bomberBulletAnimation', [0, 1], 5, true);
      bomberBullet.animations.play('bomberBulletAnimation');
      bomberBullet.reset(bomber.x, bomber.y + 30);
      bomberBullet.body.velocity.y = 300;
      nextBomberFireTick = game.time.now + 250;
      bomberSound.play('', 0, .8);
    }
}

function addUFO () {
  UFO = UFOShipGroup.create((Math.random() * 570), (Math.random() * 100) + 30, 'UFOShipGroup', game.rnd.integerInRange(0, 20));
  UFO.body.setSize(25, 25, 3, -1);
  UFO.anchor.setTo = (0.5, 0.5);
  UFO.body.velocity.y = getRandomArbitrary(125, 300);
  UFO.body.velocity.x = getRandomArbitrary(-100, 100);
  UFO.checkWorldBounds = true;
  UFO.outOfBoundsKill = true;
}

function fireUFOBullet () {
  if (game.time.now > UFOBulletTime)
  {
    UFOBullet = UFOBulletGroup.getFirstExists(false);
    if (UFOBullet) {
      UFOBullet.anchor.setTo(0.5, 0.5);
      UFOBullet.animations.add('UFOBulletAnimation', [0, 1], 5, true);
      UFOBullet.animations.play('UFOBulletAnimation');
      UFOBullet.reset(UFO.x , UFO.y + 32);
      UFOBulletTime = game.time.now + 100;
      game.physics.arcade.moveToObject(UFOBullet,player, 270);
      UFOshotSound.play('', 0, .7);
    }
  }
}

function increaseUFOSpawnRateAndNumber () {
  maxUFOs +=1;
  timeBeforeNextUFO -=100;
}

function playerFireBullet () {
  if (game.time.now > bulletTime)
  {
    bullet = playerBulletGroup.getFirstExists(false);
    if (bullet)
    {
      bullet.anchor.setTo(0.5, 0.5);
      bullet.reset(player.x , player.y - 20);
      bullet.body.velocity.y = -350;
      bulletTime = game.time.now + 350;
      laser.play('');
    }
    if (playerLaserCount > 0) {
    bullet2 = playerBulletGroup.getFirstExists(false);
      if (bullet2)
      {
        bullet2.anchor.setTo(0.5, 0.5);
        bullet2.reset(player.x + 10, player.y - 20);
        bullet2.body.velocity.y = -350;
      }
      bullet3 = playerBulletGroup.getFirstExists(false);
      if (bullet3)
      {
        bullet3.anchor.setTo(0.5, 0.5);
        bullet3.reset(player.x - 10, player.y - 20);
        bullet3.body.velocity.y = -350;
      }
    }
    if (playerLaserCount > 1) {
    bullet4 = playerBulletGroup.getFirstExists(false);
      if (bullet4)
      {
        bullet4.anchor.setTo(0.5, 0.5);
        bullet4.reset(player.x + 20, player.y - 20);
        bullet4.body.velocity.y = -350;
      }
      bullet5 = playerBulletGroup.getFirstExists(false);
      if (bullet5)
      {
        bullet5.anchor.setTo(0.5, 0.5);
        bullet5.reset(player.x - 20, player.y - 20);
        bullet5.body.velocity.y = -350;
      }
    }
  }
}

function dropLaserPowerUp () {
  powerUp = laserUpgradeGroup.getFirstExists(false);
  if (powerUp) {
    powerUp.enableBody = true;
    powerUp.anchor.setTo(0.5, 0.5);
    powerUp.body.setSize(20, 20);
    powerUp.animations.add('laserUp', [0, 1], 5, true);
    powerUp.animations.play('laserUp');
    powerUp.reset(284, -30);
    powerUp.body.velocity.y = 250;
    nextLaserUpgradeTick = game.time.now + 3000;
  }
}

function upgradeLaser() {
  powerUp.kill();
  playerLaserCount++;
  scoreBeforeNextLaserUpgrade += 2500;
}

function blowUpShip (emitter, shipHit, numEmittedParticles) {
  emitter.x = shipHit.x;
  emitter.y = shipHit.y;
  emitter.start(true, 2000, null, numEmittedParticles);
}

function getRandomArbitrary (min, max) {
  return Math.random() * (max - min) + min;
}

function UFOBulletHitPlayer (UFOBulletGroup, player) {
  UFOBulletGroup.kill();
  player.kill();
  explodeUFO.play('');
  gameOver();
}

function playerBulletHitUFO (playerBulletGroup, UFOShipGroup) {
  playerBulletGroup.kill();
  UFOShipGroup.kill();
  explodeUFO.play('');
  blowUpShip(UFODeathEmitter, UFOShipGroup, 25);
  //  Add and update the score
  score += 100;
  scoreText.text = 'Score: ' + score;

   if (score % 500 === 0 && maxUFOs < 9) {
    increaseUFOSpawnRateAndNumber();
  }
}

function playerBulletHitBomber (playerBulletGroup, bomberShipGroup){
  playerBulletGroup.kill();
  bomberShipGroup.kill();
  explodeUFO.play('');
  blowUpShip(UFODeathEmitter, bomberShipGroup, 50);
  score += 900;
  scoreText.text = 'Score: ' + score;
}

function playerTouchingUFO (player, UFOShipGroup) {
  player.kill();
  UFOShipGroup.kill();
  explodeUFO.play('');
  gameOver();
}

function bomberBulletHitPlayer (bomberBulletGroup, player) {
  bomberBulletGroup.kill();
  player.kill();
  explodeUFO.play('');
  gameOver();
}

function playerTouchingBomber (player, bomberShipGroup) {
  bomberBulletGroup.kill();
  player.kill();
  explodeUFO.play('');
  gameOver();
}

function stopSpriteMomentum (sprite) {
   sprite.body.velocity.x = 0;
   sprite.body.velocity.y = 0;
}

function getStoredScores () {
  var fb = new Firebase('https://bitblaster.firebaseio.com/');
  fb.once('value', function(snapshot) {
    storedScores = snapshot.val();
    console.log(storedScores);
  })
}

function initializeNumericalVariables() {
  score = 0;
    bulletTime = 0;
    nextUFOTick = 0;
    maxUFOs = 5;
    timeBeforeNextUFO = 1000;
    UFOBulletTime = 0;
    nextBomberFireTick = 0;
    bomberDirection = true;
    playerLaserCount = 0;
    nextLaserUpgradeTick = 0;
    scoreBeforeNextLaserUpgrade = 1000;
}

function gameOver () {
  mainTheme.stop();
  bulletTime = bulletTime + 8000000;
  blowUpShip(playerDeathEmitter, player, 150)
  playerDeathSound.play('');
  gameOverDelay = game.time.now + 5000;
  var fb = new Firebase('https://bitblaster.firebaseio.com/');
  var fbRef = fb.push();
  fbRef.set({ score: score, id: fbRef.key()});
  game.add.text(230, 280, 'GAME OVER', { fontSize: '32px', fill: 'white' });
  finalScore = score;
}

})();