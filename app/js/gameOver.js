(function(){
  game.state.add('gameOver', {create:create});

  // var addScore;
  var topTenScores;
  getScoresFromFirebase();

  function create(){
    console.log(topTenScores);
    game.add.text(100, 120, 'HIGH SCORE LEADERBOARD', { fontSize: '48px', fill: 'white' });
    game.add.text(200, 170, topTenScores[0].initials + '     ' + topTenScores[0].score, { fontSize: '32px', fill: 'white' });
    game.add.text(200, 200, topTenScores[1].initials + '     ' + topTenScores[1].score, { fontSize: '32px', fill: 'white' });
    game.add.text(200, 230, topTenScores[2].initials + '     ' + topTenScores[2].score, { fontSize: '32px', fill: 'white' });
    game.add.text(200, 260, topTenScores[3].initials + '     ' + topTenScores[3].score, { fontSize: '32px', fill: 'white' });
    game.add.text(200, 290, topTenScores[4].initials + '     ' + topTenScores[4].score, { fontSize: '32px', fill: 'white' });
    game.add.text(200, 320, topTenScores[5].initials + '     ' + topTenScores[5].score, { fontSize: '32px', fill: 'white' });
    game.add.text(200, 350, topTenScores[6].initials + '     ' + topTenScores[6].score, { fontSize: '32px', fill: 'white' });
    game.add.text(200, 380, topTenScores[7].initials + '     ' + topTenScores[7].score, { fontSize: '32px', fill: 'white' });
    game.add.text(200, 410, topTenScores[8].initials + '     ' + topTenScores[8].score, { fontSize: '32px', fill: 'white' });
    game.add.text(200, 440, topTenScores[9].initials + '     ' + topTenScores[9].score, { fontSize: '32px', fill: 'white' });
    game.add.text(130, 490, '- press SPACE to restart -', { fontSize: '32px', fill: 'white' });

    //addScore();
    var spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacebar.onDown.add(restartGame);
  }

  function restartGame() {
    this.game.state.start('ready');
  }

  function getScoresFromFirebase () {
  var fb = new Firebase('https://bitblaster.firebaseio.com/');
  fb.once('value', function(snapshot) {
    var storedScores = snapshot.val();
    var sortedScores =  _.sortBy(storedScores, 'score');
    topTenScores = sortedScores.slice(sortedScores.length -10, sortedScores.length).reverse();
    _.forEach(topTenScores, function(scoreObj) {
    console.log(scoreObj.initials + ": " + scoreObj.score);
    });
  });
}
})();