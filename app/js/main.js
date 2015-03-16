'use strict'
var game = new Phaser.Game(600, 400, Phaser.AUTO, 'game-holder',
           { preload: preload, create: create, update: update });

function preload() {

  game.load.image('starfield', 'app/assets/starfield_background.png');
}

function create() {

  game.physics.startSystem(Phaser.Physics.ARCADE);

  this.starfield = game.add.tileSprite(0, 0, 600, 400, 'starfield');

}

function update() {
  this.starfield.tilePosition.y += 1;
}