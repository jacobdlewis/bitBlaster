var bitBlaster = {

};

bitBlaster.Boot = function(game) {};

bitBlaster.Boot.prototype = {

  init: function () {
    this.input.maxPointers = 1;
  },

  preload: function () {
    //I think this is where a loading progress bar should be loaded
  },

  create: function () {
    this.state.start('Preloader');
  }


}