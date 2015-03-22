
(function(){
  game.state.add('playgame', {create:create, update: update});

    var starfield;
    var laser;
    var playerBulletGroup;
    var explodeUFO;
    var player;
    var UFOShipGroup;
    var cursors;
    var bulletTime = 0;
    var bullet;
    var score=0;
    var scoreText;
    var UFO;
    var UFODeathEmitter;
    var nextUFOTick = 0;
    var maxUFOs = 5;
    var timeBeforeNextUFO = 1000;
    var UFOBulletGroup;
    var UFOBullet;
    var UFOBulletTime = 0;


function create() {

  //add audio clips & sprites to game
    laser = game.add.audio('laser');
    explodeUFO = game.add.audio('explodeUFO');
    starfield = game.add.tileSprite(0, 0, 600, 600, 'starfield');
    player = game.add.sprite(200, 580, 'player');
    UFODeathEmitter = game.add.emitter(0, 0, 100);
    UFODeathEmitter.makeParticles('UFODeathParticle');
    UFODeathEmitter.gravity = 200;


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

  //UFO group & physics
    UFOShipGroup = game.add.group();
    UFOShipGroup.enableBody = true;
    UFOShipGroup.physicsBodyType = Phaser.Physics.ARCADE;
    UFOShipGroup.setAll('anchor.x', 0.5);
    UFOShipGroup.setAll('anchor.y', 0.5);
    UFOShipGroup.setAll('outOfBoundsKill', true);

  //UFO bulelt group
  UFOBulletGroup = this.add.group();
  UFOBulletGroup.enableBody = true;
  UFOBulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
  UFOBulletGroup.createMultiple(50, 'UFOBullet');
  UFOBulletGroup.setAll('checkWorldBounds', true);
  UFOBulletGroup.setAll('outOfBoundsKill', true);


  //bullet group & physics
  playerBulletGroup = this.add.group();
  playerBulletGroup.enableBody = true;
  playerBulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
  playerBulletGroup.createMultiple(50, 'playerBullet');
  playerBulletGroup.setAll('checkWorldBounds', true);
  playerBulletGroup.setAll('outOfBoundsKill', true);
}

function update() {
  //check for hits/collisions
  this.game.physics.arcade.collide(playerBulletGroup, UFOShipGroup, checkPlayerBulletHitUFO);
  this.game.physics.arcade.collide(UFOBulletGroup, player, checkUFOBulletHitPlayer);
  this.game.physics.arcade.collide(player, UFOShipGroup, checkPlayerTouchingUFO);
  this.game.physics.arcade.collide(UFOShipGroup, UFOShipGroup);
  this.game.physics.arcade.collide(UFOShipGroup, game.world.bounds);

  //scroll starfield background vertically
  starfield.tilePosition.y += 3;

  //check for input to move player
  if (cursors.left.isDown) {
    player.body.velocity.x = -200;
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 200;
  } else if (cursors.up.isDown){
    player.body.velocity.y = -200;
  } else if (cursors.down.isDown) {
    player.body.velocity.y = 200;
  } else {
    stopSpriteMomentum(player);
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    fireBullet();
  }

  if (UFOShipGroup.countLiving() < maxUFOs) {
    if (game.time.now > nextUFOTick) {
      addUFO();
      fireUFOBullet();
      nextUFOTick = game.time.now + timeBeforeNextUFO;
    }
  }
}

//functions
function addUFO() {
      UFO = UFOShipGroup.create((Math.random() * 570), (Math.random() * 100) + 30, 'UFOShipGroup', game.rnd.integerInRange(0, 20));
      UFO.body.setSize(25, 25, 3, -1);
      UFO.anchor.setTo = (0.5, 0.5);
      UFO.body.velocity.y = getRandomArbitrary(125, 300);
      UFO.body.velocity.x = getRandomArbitrary(-100, 100);
      UFO.checkWorldBounds = true;
      UFO.outOfBoundsKill = true;
}

function fireBullet() {
  if (game.time.now > bulletTime)
  {
    bullet = playerBulletGroup.getFirstExists(false);
    if (bullet)
    {
      bullet.anchor.setTo(0.5, 0.5);
      bullet.reset(player.x , player.y - 23);
      bullet.body.velocity.y = -300;
      bulletTime = game.time.now + 225;
      laser.play('');
    }
  }
}
function fireUFOBullet() {
  if (game.time.now > UFOBulletTime)
  {
    UFOBullet = UFOBulletGroup.getFirstExists(false);
    if (UFOBullet)
    {
      UFOBullet.anchor.setTo(0.5, 0.5);
      UFOBullet.animations.add('UFOBulletAnimation', [0, 1, 2, 3], 5, true);
      UFOBullet.animations.play('UFOBulletAnimation');
      UFOBullet.reset(UFO.x , UFO.y + 32);
      UFOBulletTime = game.time.now + 100;
      game.physics.arcade.moveToObject(UFOBullet,player, 270);
      laser.play('');
    }
  }
}

function increaseUFOSpawnRateAndNumber() {
  maxUFOs +=1;
  timeBeforeNextUFO -=100;
}

function checkPlayerTouchingUFO (player, UFOShipGroup) {
  player.kill();
  UFOShipGroup.kill();
  explodeUFO.play('');
  game.state.start('gameOver');
}

function stopSpriteMomentum (sprite) {
   sprite.body.velocity.x = 0;
   sprite.body.velocity.y = 0;
}

function blowUpUFOs(UFOHit) {
  UFODeathEmitter.x = UFOHit.x;
  UFODeathEmitter.y = UFOHit.y;
  UFODeathEmitter.start(true, 2000, null, 10);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function checkUFOBulletHitPlayer (UFOBulletGroup, player) {
  UFOBulletGroup.kill();
  player.kill();
  explodeUFO.play('');
  game.state.start('gameOver');
}
function checkPlayerBulletHitUFO (playerBulletGroup, UFOShipGroup) {
  playerBulletGroup.kill();
  UFOShipGroup.kill();
  explodeUFO.play('');
  blowUpUFOs(UFOShipGroup);
  //  Add and update the score
  score += 50;
  scoreText.text = 'Score: ' + score;

   if (score % 500 === 0 && maxUFOs <10) {
    increaseUFOSpawnRateAndNumber();
  }
}
})();