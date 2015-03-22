(function(){
  game.state.add('gameOver', {create:create});

  function create(){
    game.add.sprite(100, 0, 'gameOverMenu');

    var spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacebar.onDown.add(restartGame);
  }

  function restartGame() {
    this.game.state.start('playgame');
  }
})();