(function(){
  game.state.add('gameOver', {init: init, create:create});

  var addScore;

  function init (finalScore) {
    addScore = function () {
      game.add.text(8, 8, 'score: ' + finalScore, { fontSize: '32px', fill: 'white' });
    }
  }

  function create(){

    game.add.sprite(200, 0, 'gameOverMenu');
    addScore();
    var spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacebar.onDown.add(restartGame);
  }

  function restartGame() {
    this.game.state.start('playgame');
  }
})();