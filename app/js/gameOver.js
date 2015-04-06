(function(){
  game.state.add('gameOver', {create:create});


  function create(){
    getScoresFromFirebase();
  }

  function restartGame() {
    this.game.state.start('ready');
  }

  function getScoresFromFirebase () {
  var fb = new Firebase('https://bitblaster.firebaseio.com/');
  fb.once('value', function(snapshot) {
    var storedScores = snapshot.val();
    var sortedScores =  _.sortBy(storedScores, 'score');
    leaderboard = sortedScores.slice(sortedScores.length -10, sortedScores.length).reverse();
    // _.forEach(leaderboard, function(scoreObj) {
    // console.log(scoreObj.initials + ": " + scoreObj.score);
    // });
    if (!leaderboard) {
      game.add.text(230, 280, 'GAME OVER', { fontSize: '32px', fill: 'white' });
    }
    if (leaderboard) {
      game.add.text(100, 120, 'HIGH SCORE LEADERBOARD', { fontSize: '48px', fill: 'white' });
    }
    if (leaderboard[0]) {
      game.add.text(200, 170, " 1.  " + leaderboard[0].initials + '     ' + leaderboard[0].score, { fontSize: '32px', fill: 'white' });
    }
    if (leaderboard[1]) {
      game.add.text(200, 200, " 2.  " +leaderboard[1].initials + '     ' + leaderboard[1].score, { fontSize: '32px', fill: 'white' });
    }
    if (leaderboard[2]) {
      game.add.text(200, 230, " 3.  " +leaderboard[2].initials + '     ' + leaderboard[2].score, { fontSize: '32px', fill: 'white' });
    }
    if (leaderboard[3]) {
      game.add.text(200, 260, " 4.  " +leaderboard[3].initials + '     ' + leaderboard[3].score, { fontSize: '32px', fill: 'white' });
    }
    if (leaderboard[4]) {
      game.add.text(200, 290, " 5.  " +leaderboard[4].initials + '     ' + leaderboard[4].score, { fontSize: '32px', fill: 'white' });
    }
    if (leaderboard[5]) {
      game.add.text(200, 320, " 6.  " +leaderboard[5].initials + '     ' + leaderboard[5].score, { fontSize: '32px', fill: 'white' });
    }
    if (leaderboard[6]) {
      game.add.text(200, 350, " 7.  " +leaderboard[6].initials + '     ' + leaderboard[6].score, { fontSize: '32px', fill: 'white' });
    }
    if (leaderboard[7]) {
      game.add.text(200, 380, " 8.  " +leaderboard[7].initials + '     ' + leaderboard[7].score, { fontSize: '32px', fill: 'white' });
    }
    if (leaderboard[8]) {
      game.add.text(200, 410, " 9.  " +leaderboard[8].initials + '     ' + leaderboard[8].score, { fontSize: '32px', fill: 'white' });
    }
    if (leaderboard[9]) {
      game.add.text(200, 440, "10. " +leaderboard[9].initials + '     ' + leaderboard[9].score, { fontSize: '32px', fill: 'white' });
    }
    game.add.text(110, 490, 'press -SPACE- to restart', { fontSize: '32px', fill: 'white' });

    //addScore();
    var spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacebar.onDown.add(restartGame);
  });
}
})();