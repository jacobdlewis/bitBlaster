'use strict'
var game = new Phaser.Game(400, 500, Phaser.AUTO, 'game-holder',
           { preload: preload, create: create, update: update });

var sprite;
var player;
var baddie1;
var cursors;
var starfield;
var bullets;
var bullet;
var bulletTime = 0;
var score=0;
var scoreText;

function preload() {

  game.load.image('starfield', 'app/assets/starfield_background.png');
  game.load.image('player', 'app/assets/spaceship.png');
  game.load.image('bullet', 'app/assets/purple_ball.png');
  game.load.image('baddie1', 'app/assets/shmup-baddie.png');
  //game.load.atlasJSONHash('laser', 'app/assets/beams.png', 'app/assets/beams.json');
}

function create() {

  //create physics & cursors
  game.physics.startSystem(Phaser.Physics.ARCADE);
  cursors = game.input.keyboard.createCursorKeys();

  //add image assets to game
  starfield = game.add.tileSprite(0, 0, 400, 500, 'starfield');
  player = game.add.sprite(180, 560, 'player');
  //laser = game.add.sprite(2, 2, 'laser');
  //create game score
  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });


  //add physics to player's ship
  game.physics.arcade.enable(player);
  player.body.gravity.y = 0;
  player.body.bounce.y = 0;
  player.body.collideWorldBounds = true;

  //baddie group & physics
  baddie1 = game.add.group();
  baddie1.enableBody = true;
  baddie1.physicsBodyType = Phaser.Physics.ARCADE;

  for (var i = 0; i < 50; i++) {
    var c = baddie1.create(game.world.randomX,
                           (Math.random() * 150) + 50,
                           'baddie1', game.rnd.integerInRange(0, 40));
    c.name = 'bad' + i;
    c.body.immovable = true;
  }

  //bullet group & physics
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;

  for (var i = 0; i < 20; i++)
  {
    var b = bullets.create(0, 0, 'bullet');
    b.name = 'bullet' + i;
    b.exists = false;
    b.visible = false;
    b.checkWorldBounds = true;
    //b.events.onOutOfBounds.add(resetBullet, this);
  }

  bullets.createMultiple(50, 'bullet');
  bullets.setAll('checkWorldBounds', true);
  bullets.setAll('outOfBoundsKill', true);
}

function update() {
  //check for hits/collisions
  game.physics.arcade.overlap(bullets, baddie1, collisionHandler, null, this);
  //scroll starfield background vertically
  starfield.tilePosition.y += 2;

  // //check for input to move player
  player.body.velocity.x = 0;

  if (cursors.left.isDown) {
    player.body.velocity.x = -200;
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 200;
  } else if (cursors.up.isDown){
    player.body.velocity.y = -200;
  } else if (cursors.down.isDown) {
    player.body.velocity.y = 200;
  } else if (cursors.right.isDown && cursors.up.isDown) {
    player.body.velocity.x = 200;
    player.body.velocity.y = -200;
  } else if (cursors.right.isDown && cursors.down.isDown) {
    player.body.velocity.x = 200;
    player.body.velocity.y = 200;
  } else if (cursors.left.isDown && cursors.up.isDown) {
    player.body.velocity.x = -200;
    player.body.velocity.y = -200;
  } else if (cursors.left.isDown && cursors.down.isDown) {
    player.body.velocity.x = -200;
    player.body.velocity.y = 200;
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    fireBullet();
  }

}

  function fireBullet() {
    if (game.time.now > bulletTime)
    {
      bullet = bullets.getFirstExists(false);

      if (bullet)
      {
        bullet.reset(player.x + 12, player.y - 8);
        bullet.body.velocity.y = -300;
        bulletTime = game.time.now + 150;
      }
    }
  }

  function collisionHandler (bullet, baddie1) {
    bullet.kill();
    baddie1.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
  }

  function resetBullet(bullet) {
    bullet.kill();
  }
