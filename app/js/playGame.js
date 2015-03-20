
(function(){
  game.state.add('playgame', {create:create, update: update});

    var laser;
    var explodeBaddie;
    var player;
    var baddie1;
    var cursors;
    var starfield;
    var bulletGroup;
    var bullet;
    var bulletTime = 0;
    var score=0;
    var scoreText;

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

  //add physics to player's ship
    game.physics.arcade.enable(player);
    player.body.gravity.y = 0;
    player.body.bounce.y = 0;
    player.anchor.setTo(0.5, 0.5);
    player.body.collideWorldBounds = true;

  //baddie group & physics
    baddie1 = this.add.group();
    baddie1.enableBody = true;
    baddie1.physicsBodyType = Phaser.Physics.ARCADE;
    baddie1.createMultiple(20, 'baddie1');
    baddie1.setAll('anchor.x', 0.5);
    baddie1.setAll('anchor.y', 0.5);
    baddie1.setAll('outOfBoundsKill', true);
    baddie1.setAll('checkWorldBounds', true);

    for (var i = 0; i < 20; i++) {
      var c = baddie1.create(game.world.randomX -20,
                             (Math.random() * 150) + 50,
                             'baddie1', game.rnd.integerInRange(0, 20));
      c.name = 'bad' + i;
      c.body.immovable = true;
    }

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
  this.game.physics.arcade.overlap(bulletGroup, baddie1, collisionHandler, null, this);
  this.game.physics.arcade.overlap(player, baddie1, checkPlayerCollision, null, this);
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
}

//functions

function fireBullet() {
  if (game.time.now > bulletTime)
  {
    bullet = bulletGroup.getFirstExists(false);
    if (bullet)
    {
      bullet.reset(player.x - 9, player.y - 23);
      bullet.body.velocity.y = -300;
      bulletTime = game.time.now + 25;
      laser.play('');
    }
  }
}
function checkPlayerCollision (player, baddie1) {
  player.kill();
  explodeBaddie.play('');
  game.state.start('gameOver');
}

function collisionHandler (bullet, baddie1) {
  bullet.kill();
  baddie1.kill();
  explodeBaddie.play('');
  //  Add and update the score
  score += 50;
  scoreText.text = 'Score: ' + score;
}
})();