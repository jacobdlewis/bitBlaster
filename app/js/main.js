'use strict'
var game = new Phaser.Game(400, 400, Phaser.AUTO, 'game-holder',
           { preload: preload, create: create, update: update });

var player;
var cursors;
var starfield;

function preload() {

  game.load.image('starfield', 'app/assets/starfield_background.png');
  game.load.image('player', 'app/assets/spaceship.png')

}

function create() {

  //create physics & cursors
  game.physics.startSystem(Phaser.Physics.ARCADE);
  cursors = game.input.keyboard.createCursorKeys();

  //add image assets to game
  this.starfield = game.add.tileSprite(0, 0, 400, 400, 'starfield');
  player = game.add.sprite(180, 560, 'player');

  //add physics to player's ship
  game.physics.arcade.enable(player);
  player.body.gravity.y = 0;
  player.body.bounce.y = 0;
  player.body.collideWorldBounds = true;
}

function update() {
  //scroll starfield background vertically
  this.starfield.tilePosition.y += 1;

  // //check for input to move player
  player.body.velocity.x = 0;

  if (cursors.left.isDown) {
    player.body.velocity.x = -150;
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 150;
  } else if (cursors.up.isDown){
    player.body.velocity.y = -150;
  } else if (cursors.down.isDown) {
    player.body.velocity.y = 150;
  }

}