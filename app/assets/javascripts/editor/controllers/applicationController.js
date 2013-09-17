ApplicationController = function($scope, $rootScope) {
  var context = this;

  $scope.$on('previewLoaded', function(e) {
    $(window).resize();
  });

  $scope.$on('editorLoaded', function(e, value) {
    $(window).resize();
  });

  key('⌘+s, ctrl+s', function(){
    console.debug("here");
    $scope.$emit('saveFile');
    return false;
  });

  key('esc', function(){
    $scope.$emit('toggleBrowser');
  });

  key('⌘+r, ctrl+r', function(){ });

  var cooldownTimer = null;
  $(window).resize(function() {
    clearTimeout(cooldownTimer);
    cooldownTimer = setTimeout(function(){
      var width  = $(document).width();
      var height = $(document).height();
      $rootScope.$emit('windowResized', width, height);
    }, env.windowResizedCoolDownTime);
  });
};
