(function(){
  game.state.add('ready', {create:create, update:update});
  var gameStartTime;
  var readyTime;
  var countInTimer;

  function create(){
    game.add.sprite(0, 0, 'starfield');
    game.add.text(230, 280, 'GET READY', { fontSize: '32px', fill: 'white' });

    gameStartTime = new Date().getTime();
    readyTime = gameStartTime + 3000;
    countInTimer = game.add.text(295, 310, '3', { fontSize: '32px', fill: 'white' });
    countInSound = game.add.audio('bomberFlight');


    var spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacebar.onDown.add(startLvl1);
  }

  function update(){
    startLvl1();
  }

  function startLvl1() {
    var timeRightNow = new Date().getTime();
    if (timeRightNow - gameStartTime < 1000 && timeRightNow - gameStartTime > 900){
      countInTimer.text = 3;
      countInSound.play('');
    }
    if (timeRightNow - gameStartTime < 2000 && timeRightNow - gameStartTime > 1900){
      countInTimer.text = 2;
      countInSound.play('');
    }
    if (timeRightNow - gameStartTime < 3000 && timeRightNow - gameStartTime > 2900){
      countInTimer.text = 1;
      countInSound.play('');
    }
    if(timeRightNow > readyTime){
      this.game.state.start('playgame');
    }
  }
})();