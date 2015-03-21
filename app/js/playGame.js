
(function(){
  game.state.add('playgame', {create:create, update: update});

    var laser;
    var explodeBaddie;
    var player;
    var firstBaddieGroup;
    var cursors;
    var starfield;
    var bulletGroup;
    var bullet;
    var bulletTime = 0;
    var score=0;
    var scoreText;
    var nextBaddieTick = 0;



function create() {

  //add audio clips to game
    laser = game.add.audio('laser');
    explodeBaddie = game.add.audio('explodeBaddie');

  //set world bounds
    game.world.setBounds(0, 0, 400, 600);

  //create physics & cursors
    game.physics.startSystem(Phaser.Physics.ARCADE);
    cursors = game.input.keyboard.createCursorKeys();

  //add image assets to game
    starfield = game.add.tileSprite(0, 0, 400, 600, 'starfield');
    player = game.add.sprite(200, 580, 'player');

  //create game score
    scoreText = game.add.text(8, 8, 'score: 0', { fontSize: '32px', fill: 'white' });

  //add clock
    clock = game.time;

  //add physics to player's ship
    game.physics.arcade.enable(player);
    player.body.gravity.y = 0;
    player.body.bounce.y = 0;
    player.anchor.setTo(0.5, 0.5);
    player.body.collideWorldBounds = true;

  //baddie group & physics
    firstBaddieGroup = game.add.group();
    firstBaddieGroup.enableBody = true;
    firstBaddieGroup.physicsBodyType = Phaser.Physics.ARCADE;
    firstBaddieGroup.setAll('anchor.x', 0.5);
    firstBaddieGroup.setAll('anchor.y', 0.5);
    firstBaddieGroup.setAll('outOfBoundsKill', true);


  //bullet group & physics
  bulletGroup = this.add.group();
  bulletGroup.enableBody = true;
  bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;

  for (var i = 0; i < 100; i++)
  { var b = bulletGroup.create(0, 0, 'bullet');
    b.name = 'bullet' + i;
    b.exists = false;
    b.visible = false;
    b.checkWorldBounds = true;
    //b.events.onOutOfBounds.add(resetBullet, this);
  }

  bulletGroup.createMultiple(50, 'bullet');
  bulletGroup.setAll('checkWorldBounds', true);
  bulletGroup.setAll('outOfBoundsKill', true);
}

function update() {
  //check for hits/collisions
  this.game.physics.arcade.collide(bulletGroup, firstBaddieGroup, collisionHandler);
  this.game.physics.arcade.collide(player, firstBaddieGroup, checkPlayerCollision);
  this.game.physics.arcade.collide(firstBaddieGroup, firstBaddieGroup);
  this.game.physics.arcade.collide(firstBaddieGroup, game.world.bounds);

  //scroll starfield background vertically
  starfield.tilePosition.y += 2;

  // //check for input to move player
   player.body.velocity.x = 0;
   player.body.velocity.y = 0;

  if (cursors.left.isDown) {
    player.body.velocity.x = -200;
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 200;
  } else if (cursors.up.isDown){
    player.body.velocity.y = -200;
  } else if (cursors.down.isDown) {
    player.body.velocity.y = 200;
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    fireBullet();
  }

  if (firstBaddieGroup.countLiving() < 50) {
    if (game.time.now > nextBaddieTick) {
      addEnemy();
      nextBaddieTick = game.time.now + 10;
    }
  }

}

//functions
function addEnemy() {
  var i = 0;
  var enemy = firstBaddieGroup.create((Math.random() * 370), (Math.random() * 150) + 30, 'firstBaddieGroup', game.rnd.integerInRange(0, 20));
      enemy.body.immovable = true;
      enemy.body.velocity.y = 2;
      enemy.name = 'baddie' + i;
      enemy.anchor.setTo = (0.5, 0.5);
      enemy.checkWorldBounds = true;
      i++;
}

function fireBullet() {
  if (game.time.now > bulletTime)
  {
    bullet = bulletGroup.getFirstExists(false);
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
function checkPlayerCollision (player, firstBaddieGroup) {
  player.kill();
  explodeBaddie.play('');
  game.state.start('gameOver');
}


function collisionHandler (bulletGroup, firstBaddieGroup) {
  bulletGroup.kill();
  firstBaddieGroup.kill();
  explodeBaddie.play('');
  //  Add and update the score
  score += 50;
  scoreText.text = 'Score: ' + score;
}
})();