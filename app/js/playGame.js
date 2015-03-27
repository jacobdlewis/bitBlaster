  game.state.add('playgame', { create:create, update: update });

    var starfield;
    var laser;
    var cursors;
    var gameOverDelay;
    var score;
    var scoreText;
    var finalScore;
    var topTenScores;
    var playerInitials;
    var nextMuteTick;
    var bossfight;

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

    var deathStarGroup;
    var deathStar;
    var deathStarHP;

    var bomberShipGroup;
    var bomberSound;
    var bomber;
    var bomberCreated;
    var nextBomberFireTick;
    var mainTheme;
    var bomberDirection;

function create() {
    initializeVariables();
    getScoresFromFirebase();

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

  //deathStarGroup
    deathStarGroup = game.add.group();
    deathStarGroup.enableBody = true;
    //deathStarGroup.physicsBodyType = Phaser.Physics.ARCADE;
    deathStarGroup.setAll('checkWorldBounds', true);
    deathStarGroup.setAll('outOfBoundsKill', true);

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
  game.physics.arcade.collide(playerBulletGroup, deathStarGroup, playerBulletHitDeathStar);
  game.physics.arcade.collide(player, deathStar, playerTouchingDeathStar);

  starfield.tilePosition.y += 3;

  stopSpriteMomentum(player);

  if (cursors.left.isDown) {
    player.body.velocity.x = -225;
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 225;
  }
  if (cursors.up.isDown){
    player.body.velocity.y = -225;
  } else if (cursors.down.isDown) {
    player.body.velocity.y = 225;
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    playerFireBullet();
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
    muteAllSound();
  }

  //deathStar routines;
  if (score > 50000  && score < 55000  && deathStarGroup.countLiving () < 1 ||
      score > 100000 && score < 105000 && deathStarGroup.countLiving () < 1 ||
      score > 150000 && score < 155000 && deathStarGroup.countLiving () < 1 ||
      score > 200000 && score < 205000 && deathStarGroup.countLiving () < 1 ||
      score > 250000 && score < 255000 && deathStarGroup.countLiving () < 1
      ) {
    addDeathStar();
    startBossFight();
    nextDeathStarFireTick = game.time.now + 3000;
  }
  if (deathStar) {
    if (deathStarHP < 0) {
      killDeathStar();
    }
  }
  if (deathStarGroup.countLiving() === 1) {
    if (game.time.now > nextDeathStarFireTick && deathStarHP > 90 || game.time.now > nextDeathStarFireTick && deathStarHP > 30 &&  deathStarHP < 60) {
      deathStarBomb();
    }
    else if (game.time.now > nextDeathStarFireTick && deathStarHP > 60 || game.time.now > nextDeathStarFireTick && deathStarHP > 0 && deathStarHP < 30) {
      deathStarMultiShot();
    }
  }
  //deathstar movement routine
  if (deathStarGroup.countLiving() > 0) {
    if (deathStar.body.x > 490 && deathStar.body.x < 500) {
      deathStar.body.velocity.x = -200;
    }
    if (deathStar.body.x < 10 && deathStar.body.x > 0) {
      deathStar.body.velocity.x = 200;
    }
  }

  if (score !== 0 && score % scoreBeforeNextLaserUpgrade === 0 && game.time.now > nextLaserUpgradeTick) {
    dropLaserPowerUp();
  }

  if (bomberShipGroup.countLiving() === 1) {
    if (game.time.now > nextBomberFireTick) {
      fireBomberBullet();
    }
  }

  if (bossfight === false && bomberShipGroup.countLiving() === 0 && score !==0 && score % 1000 === 0) {
    addBomber();
  }

  if (bossfight === false && UFOShipGroup.countLiving() < maxUFOs) {
    if (game.time.now > nextUFOTick) {
      addUFO();
      fireUFOBullet();
      nextUFOTick = game.time.now + timeBeforeNextUFO;
    }
  }
  if (game.time.now > gameOverDelay) {
    if (checkForNewHighScore()) {
      var playerResponse;
      playerResponse = prompt("You got a high score! What are your initials?").toUpperCase();
      while (playerResponse !== undefined) {
        if (playerResponse.length > 3 || playerResponse.length < 3) {
          playerResponse = prompt("There was a problem with your entry. Please enter 3 character initials. Ex. AAA").toUpperCase();
        }
        if (playerResponse.length === 3) {
          break;
        }
      }
      storePlayerScore(playerResponse);
    }
    game.state.start('gameOver', true, false);
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

function addDeathStar () {
  deathStar = deathStarGroup.create(250, 50, 'deathStarGroup');
  deathStar.animations.add('deathStarAnimation', [0, 1, 2, 3, 4, 4, 4], 8, true);
  deathStar.animations.play('deathStarAnimation');
  deathStar.enableBody = true;
  deathStar.body.setSize(100, 100, 0, 0);
  deathStar.body.immovable = true;
  deathStar.body.collideWorldBounds = true;
  deathStar.anchor.setTo = (0.5, 0.5);
  deathStar.body.velocity.y = 0;
  deathStar.body.velocity.x = 200;
  deathStar.checkWorldBounds = true;
  deathStar.outOfBoundsKill = true;
}

function deathStarBomb () {
  deathStarBullet = bomberBulletGroup.getFirstExists(false);
  if (deathStarBullet) {
      deathStarBullet.anchor.setTo(0.5, 0.5);
      deathStarBullet.animations.add('bomberBulletAnimation', [0, 1], 5, true);
      deathStarBullet.animations.play('bomberBulletAnimation');
      deathStarBullet.reset(deathStar.x + 50, deathStar.y + 80);
      deathStarBullet.body.velocity.y = 300;
    }
  deathStarBullet2 = bomberBulletGroup.getFirstExists(false);
  if (deathStarBullet2) {
      deathStarBullet2.anchor.setTo(0.5, 0.5);
      deathStarBullet2.animations.add('bomberBulletAnimation', [0, 1], 5, true);
      deathStarBullet2.animations.play('bomberBulletAnimation');
      deathStarBullet2.reset(deathStar.x - 10, deathStar.y + 80);
      deathStarBullet2.body.velocity.y = 300;
    }
  deathStarBullet3 = bomberBulletGroup.getFirstExists(false);
  if (deathStarBullet3) {
      deathStarBullet3.anchor.setTo(0.5, 0.5);
      deathStarBullet3.animations.add('bomberBulletAnimation', [0, 1], 5, true);
      deathStarBullet3.animations.play('bomberBulletAnimation');
      deathStarBullet3.reset(deathStar.x + 110, deathStar.y + 80);
      deathStarBullet3.body.velocity.y = 300;
    }
    nextDeathStarFireTick = game.time.now + 500;
    bomberSound.play('', 0, .8);
}

function deathStarMultiShot () {
  deathStarBullet1 = bomberBulletGroup.getFirstExists(false);
  if (deathStarBullet1) {
      deathStarBullet1.anchor.setTo(0.5, 0.5);
      deathStarBullet1.animations.add('bomberBulletAnimation', [0, 1], 5, true);
      deathStarBullet1.animations.play('bomberBulletAnimation');
      deathStarBullet1.reset(deathStar.x - 10, deathStar.y + 80);
      game.physics.arcade.velocityFromAngle(120, 300, deathStarBullet1.body.velocity)
    }
  deathStarBullet2 = bomberBulletGroup.getFirstExists(false);
  if (deathStarBullet2) {
      deathStarBullet2.anchor.setTo(0.5, 0.5);
      deathStarBullet2.animations.add('bomberBulletAnimation', [0, 1], 5, true);
      deathStarBullet2.animations.play('bomberBulletAnimation');
      deathStarBullet2.reset(deathStar.x + 20, deathStar.y + 80);
      game.physics.arcade.velocityFromAngle(105, 300, deathStarBullet2.body.velocity)
    }
  deathStarBullet3 = bomberBulletGroup.getFirstExists(false);
  if (deathStarBullet3) {
      deathStarBullet3.anchor.setTo(0.5, 0.5);
      deathStarBullet3.animations.add('bomberBulletAnimation', [0, 1], 5, true);
      deathStarBullet3.animations.play('bomberBulletAnimation');
      deathStarBullet3.reset(deathStar.x + 50, deathStar.y + 80);
      game.physics.arcade.velocityFromAngle(90, 300, deathStarBullet3.body.velocity)
    }
  deathStarBullet4 = bomberBulletGroup.getFirstExists(false);
  if (deathStarBullet4) {
      deathStarBullet4.anchor.setTo(0.5, 0.5);
      deathStarBullet4.animations.add('bomberBulletAnimation', [0, 1], 5, true);
      deathStarBullet4.animations.play('bomberBulletAnimation');
      deathStarBullet4.reset(deathStar.x + 80, deathStar.y + 80);
      game.physics.arcade.velocityFromAngle(75, 300, deathStarBullet4.body.velocity)
    }
  deathStarBullet5 = bomberBulletGroup.getFirstExists(false);
  if (deathStarBullet5) {
      deathStarBullet5.anchor.setTo(0.5, 0.5);
      deathStarBullet5.animations.add('bomberBulletAnimation', [0, 1], 5, true);
      deathStarBullet5.animations.play('bomberBulletAnimation');
      deathStarBullet5.reset(deathStar.x + 110, deathStar.y + 80);
      game.physics.arcade.velocityFromAngle(60, 300, deathStarBullet5.body.velocity)
    }
    nextDeathStarFireTick = game.time.now + 500;
    bomberSound.play('', 0, .8);
}


function addUFO () {
  UFO = UFOShipGroup.create((Math.random() * 570), (Math.random() * 70) + 30, 'UFOShipGroup', game.rnd.integerInRange(0, 20));
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
      laser.play('', 0, .6, false);
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
  scoreBeforeNextLaserUpgrade += 5000;
  score += 2500;
  redrawScore();
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
  redrawScore();

   if (score % 500 === 0 && maxUFOs < 9) {
    increaseUFOSpawnRateAndNumber();
  }
}

function playerBulletHitDeathStar (playerBulletGroup, deathStarGroup) {
  playerBulletGroup.kill();
  blowUpShip(UFODeathEmitter, playerBulletGroup, 20);
  deathStarHP -= 1;
  score += 200;
  redrawScore();
}

function playerBulletHitBomber (playerBulletGroup, bomberShipGroup){
  playerBulletGroup.kill();
  bomberShipGroup.kill();
  explodeUFO.play('');
  blowUpShip(UFODeathEmitter, bomberShipGroup, 50);
  score += 900;
  redrawScore();
}
function playerTouchingDeathStar (player, deathStar) {
  player.kill();
  gameOver();
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

 function initializeVariables() {
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
    topTenScores = 0;
    nextDeathStarFireTick = 0
    deathStarHP = 120;
    nextMuteTick = 0;
    bossfight = false;
}

function checkForNewHighScore () {
  if (topTenScores === 0 || topTenScores.length < 10) {
    return true
  } else if (finalScore > topTenScores[9].score) {
    return true;
  } else {
    return false;
  }
}

function getScoresFromFirebase () {
  var fb = new Firebase('https://bitblaster.firebaseio.com/');
  fb.once('value', function(snapshot) {
    var storedScores = snapshot.val();
    var sortedScores =  _.sortBy(storedScores, 'score');
    topTenScores = sortedScores.slice(sortedScores.length -10, sortedScores.length).reverse();
    scoreText = game.add.text(8, 8, 'SCORE: 0', { fontSize: '32px', fill: 'white' });
    game.add.text(320, 10, 'HIGH SCORE: ' + topTenScores[0].score, { fontSize: '32px', fill: 'white' })
  });
}
function redrawScore() {
  scoreText.text = 'SCORE: ' + score;
}

function storePlayerScore(initials) {
  var fb = new Firebase('https://bitblaster.firebaseio.com/');
  var fbRef = fb.push();
  fbRef.set({ score: score, id: fbRef.key(), initials: initials });
}

function muteAllSound() {
  if (game.sound.mute && game.time.now > nextMuteTick) {
    game.sound.mute = false;
    nextMuteTick = game.time.now + 500;
  } else if (!game.sound.mute && game.time.now > nextMuteTick) {
    game.sound.mute = true;
    nextMuteTick = game.time.now + 500;
  }
}
function killDeathStar() {
  blowUpShip(playerDeathEmitter, deathStar, 250);
  deathStar.kill();
  deathStarHP = 120;
  bossfight = false;
  score += 10000;
  redrawScore();
}

function startBossFight() {
  bossfight = true;
  timeBeforeBossFight = game.time.now + 2000;
}
function gameOver () {
  mainTheme.stop();
  bulletTime = bulletTime + 8000000;
  blowUpShip(playerDeathEmitter, player, 150)
  playerDeathSound.play('');
  gameOverDelay = game.time.now + 5000;
  game.add.text(230, 280, 'GAME OVER', { fontSize: '32px', fill: 'white' });
  finalScore = score;
  checkForNewHighScore();
}

