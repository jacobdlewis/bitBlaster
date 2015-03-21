(function(){
  game.state.add('menu', {preload:preload, create:create});
  game.state.start('menu');

  function preload(){
    game.load.image('starfield', 'app/assets/starfield_background.png');
    game.load.image('player', 'app/assets/heroShip.png');
    game.load.image('playerBullet', 'app/assets/greenLaser.png');
    game.load.image('alienShipGroup', 'app/assets/alienShip.png');
    game.load.audio('laser', 'app/assets/sfx/blaster.mp3');
    game.load.audio('explodeBaddie', 'app/assets/sfx/explosion.mp3');
    game.load.image('kaplow', 'app/assets/explosion.png', 128, 128);
    game.load.image('menu', 'app/assets/startMenu.png');
    game.load.image('gameOverMenu', 'app/assets/gameOver.png');
    game.load.image('enemyBullet', 'app/assets/enemyBullet.png');
  }

  function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'menu');

    var spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacebar.onDown.add(startLvl1);
  }

  function startLvl1() {
    this.game.state.start('playgame');
  }
})();