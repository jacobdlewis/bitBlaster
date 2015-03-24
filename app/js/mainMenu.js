(function(){
  game.state.add('menu', {preload:preload, create:create});
  game.state.start('menu');

  function preload(){
    game.load.image('starfield', 'app/assets/starfield_background_faded.png');
    game.load.image('player', 'app/assets/heroShip.png');
    game.load.image('playerBullet', 'app/assets/playerBullet.png');
    game.load.image('playerDeathParticle', 'app/assets/playerDeathParticle.png');
    game.load.image('UFOShipGroup', 'app/assets/UFOShip.png');
    game.load.image('menu', 'app/assets/startingMenu.png');
    game.load.image('gameOverMenu', 'app/assets/gameOver.png');
    game.load.image('bomberShip', 'app/assets/bomberShip.png')
    game.load.spritesheet('bomberBullet', 'app/assets/bomberBullet.png', 12, 12, 2);
    game.load.image('UFODeathParticle', 'app/assets/UFODeathParticle.png');
    game.load.spritesheet('UFOBullet', 'app/assets/UFOBulletAnimation.png', 10, 9, 2);
    game.load.spritesheet('laserUp', 'app/assets/laserPowerUp.png', 16, 16, 2);
    game.load.audio('laser', 'app/assets/sfx/blaster.mp3');
    game.load.audio('explodeUFO', 'app/assets/sfx/explosion.mp3');
    game.load.audio('mainTheme', 'app/assets/sfx/mainThemeCropped.mp3');
    game.load.audio('UFOshot', 'app/assets/sfx/lazer.wav');
    game.load.audio('bomberFlight', 'app/assets/sfx/numkey.wav');
    game.load.audio('playerDeath', 'app/assets/sfx/player_death.wav');
  }

  function create(){
    game.add.sprite(0, 0, 'menu');

    var spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacebar.onDown.add(startLvl1);
  }

  function startLvl1() {
    this.game.state.start('playgame');
  }
})();