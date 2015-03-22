
(function(){
  game.state.add('playgame', {create:create, update: update});

    var starfield;
    var laser;
    var playerBulletGroup;
    var explodeUFO;
    var player;
    var alienShipGroup;
    var cursors;
    var bulletTime = 0;
    var bullet;
    var score=0;
    var scoreText;
    var enemy;
    var alienDeathEmitter;
    var nextUFOTick = 0;
    var maxUFOs = 5;
    var timeBeforeNextUFO = 1000;
    var enemyBulletGroup;
    var enemyBullet;
    var enemyBulletTime = 0;


function create() {

  //add audio clips & sprites to game
    laser = game.add.audio('laser');
    explodeUFO = game.add.audio('explodeUFO');
    starfield = game.add.tileSprite(0, 0, 600, 600, 'starfield');
    player = game.add.sprite(200, 580, 'player');
    alienDeathEmitter = game.add.emitter(0, 0, 100);
    alienDeathEmitter.makeParticles('alienDeathParticle');
    alienDeathEmitter.gravity = 200;

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
    alienShipGroup = game.add.group();
    alienShipGroup.enableBody = true;
    alienShipGroup.physicsBodyType = Phaser.Physics.ARCADE;
    alienShipGroup.setAll('anchor.x', 0.5);
    alienShipGroup.setAll('anchor.y', 0.5);
    alienShipGroup.setAll('outOfBoundsKill', true);

  //enemy bulelt group
  enemyBulletGroup = this.add.group();
  enemyBulletGroup.enableBody = true;
  enemyBulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
  enemyBulletGroup.createMultiple(50, 'enemyBullet');
  enemyBulletGroup.setAll('checkWorldBounds', true);
  enemyBulletGroup.setAll('outOfBoundsKill', true);


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
  this.game.physics.arcade.collide(playerBulletGroup, alienShipGroup, checkPlayerBulletHitAlien);
  this.game.physics.arcade.collide(enemyBulletGroup, player, checkAlienBulletHitPlayer);
  this.game.physics.arcade.collide(player, alienShipGroup, checkPlayerTouchingAlien);
  this.game.physics.arcade.collide(alienShipGroup, alienShipGroup);
  this.game.physics.arcade.collide(alienShipGroup, game.world.bounds);

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

  if (alienShipGroup.countLiving() < maxUFOs) {
    if (game.time.now > nextUFOTick) {
      addEnemy();
      fireEnemyBullet();
      nextUFOTick = game.time.now + timeBeforeNextUFO;
    }
  }
}

//functions
function addEnemy() {
      enemy = alienShipGroup.create((Math.random() * 570), (Math.random() * 100) + 30, 'alienShipGroup', game.rnd.integerInRange(0, 20));
      enemy.body.setSize(25, 25, 3, -1);
      enemy.anchor.setTo = (0.5, 0.5);
      enemy.body.velocity.y = getRandomArbitrary(125, 300);
      enemy.body.velocity.x = getRandomArbitrary(-100, 100);
      enemy.checkWorldBounds = true;
      enemy.outOfBoundsKill = true;
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
function fireEnemyBullet() {
  if (game.time.now > enemyBulletTime)
  {
    enemyBullet = enemyBulletGroup.getFirstExists(false);
    if (enemyBullet)
    {
      enemyBullet.anchor.setTo(0.5, 0.5);
      enemyBullet.reset(enemy.x , enemy.y + 32);
      enemyBulletTime = game.time.now + 100;
      game.physics.arcade.moveToObject(enemyBullet,player,250);
      laser.play('');
    }
  }
}

function increaseUFOSpawnRateAndNumber() {
  maxUFOs +=1;
  timeBeforeNextUFO -=100;
}

function checkPlayerTouchingAlien (player, alienShipGroup) {
  player.kill();
  alienShipGroup.kill();
  explodeUFO.play('');
  game.state.start('gameOver');
}

function stopSpriteMomentum (sprite) {
   sprite.body.velocity.x = 0;
   sprite.body.velocity.y = 0;
}

function blowUpAliens(alienHit) {
  alienDeathEmitter.x = alienHit.x;
  alienDeathEmitter.y = alienHit.y;
  alienDeathEmitter.start(true, 2000, null, 10);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function checkAlienBulletHitPlayer (enemyBulletGroup, player) {
  enemyBulletGroup.kill();
  player.kill();
  explodeUFO.play('');
  game.state.start('gameOver');
}
function checkPlayerBulletHitAlien (playerBulletGroup, alienShipGroup) {
  playerBulletGroup.kill();
  alienShipGroup.kill();
  explodeUFO.play('');
  blowUpAliens(alienShipGroup);
  //  Add and update the score
  score += 50;
  scoreText.text = 'Score: ' + score;

   if (score % 500 === 0 && maxUFOs <10) {
    increaseUFOSpawnRateAndNumber();
  }
}
})();