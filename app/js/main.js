'use strict'
var game = new Phaser.Game(400, 400, Phaser.AUTO, 'game-holder',
           { preload: preload, create: create, update: update });

var sprite;
var player;
var cursors;
var starfield;
var bullets;
var bullet;
var bulletTime = 0;

function preload() {

  game.load.image('starfield', 'app/assets/starfield_background.png');
  game.load.image('player', 'app/assets/spaceship.png');
  game.load.image('bullet', 'app/assets/purple_ball.png');
  //game.load.atlasJSONHash('laser', 'app/assets/beams.png', 'app/assets/beams.json');
}

function create() {

  //create physics & cursors
  game.physics.startSystem(Phaser.Physics.ARCADE);
  cursors = game.input.keyboard.createCursorKeys();

  //add image assets to game
  starfield = game.add.tileSprite(0, 0, 400, 400, 'starfield');
  player = game.add.sprite(180, 560, 'player');
  //laser = game.add.sprite(2, 2, 'laser');

  //add physics to player's ship
  game.physics.arcade.enable(player);
  player.body.gravity.y = 0;
  player.body.bounce.y = 0;
  player.body.collideWorldBounds = true;

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

  // function resetBullet(bullet) {
  //   bullet.kill();
  // }

}