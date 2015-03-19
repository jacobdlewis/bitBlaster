(function(){
  game.state.add('menu', {preload:preload, create:create});
  game.state.start('menu');

  function preload(){
    game.load.image('starfield', 'app/assets/starfield_background.png');
    game.load.image('player', 'app/assets/heroShip.png');
    game.load.image('bullet', 'app/assets/purple_ball.png');
    game.load.image('baddie1', 'app/assets/shmup-baddie.png');
    game.load.audio('laser', 'app/assets/sfx/blaster.mp3');
    game.load.audio('explodeBaddie', 'app/assets/sfx/explosion.mp3');
    game.load.image('kaplow', 'app/assets/explosion.png', 128, 128);
    game.load.image('menu', 'app/assets/startMenu.png');
  }

  function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'menu');

    var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.add(startLvl1);
  }

  function startLvl1() {
    this.game.state.start('lvl1');
  }
})();