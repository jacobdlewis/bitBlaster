(function(){
  game.state.add('gameOver', {create:create});


  function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'gameOverMenu');

    var spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacebar.onDown.add(restartGame);
  }

  function restartGame() {
    this.game.state.start('playgame');
  }
})();