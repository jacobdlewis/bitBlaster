'use strict'
var game = new Phaser.Game(600, 400, Phaser.AUTO, 'game-holder',
           { preload: preload, create: create, update: update });

function preload() {

  game.load.image('starfield', 'app/assets/starfield.png');
}

function create() {
  game.add.sprite(0, 0, 'starfield');
}

function update() {

}