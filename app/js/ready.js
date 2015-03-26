(function(){
  game.state.add('ready', {create:create, update:update});
  var gameStartTime;
  var readyTime;
  var countInTimer;
  var nextMuteTick = 0;
  var cursors;

  function create(){
    game.add.sprite(0, 0, 'starfield');
    game.add.text(230, 280, 'GET READY', { fontSize: '32px', fill: 'white' });

    cursors = game.input.keyboard.createCursorKeys();
    gameStartTime = new Date().getTime();
    readyTime = gameStartTime + 3000;
    countInTimer = game.add.text(295, 310, '', { fontSize: '32px', fill: 'white' });
    countInSound = game.add.audio('bomberFlight');

    var spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacebar.onDown.add(startLvl1);
  }

  function update(){
    startLvl1();

    if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      muteAllSound();
      console.log('enter');
    }
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
      game.state.start('playgame');
    }
  }

  function muteAllSound() {
  if (game.sound.mute && game.time.now > nextMuteTick) {
    game.sound.mute = false;
    nextMuteTick = game.time.now + 500;
  } else if (!game.sound.mute && game.time.now > nextMuteTick) {
    game.sound.mute = true;
    nextMuteTick = game.time.now + 500;
  }
}
})();