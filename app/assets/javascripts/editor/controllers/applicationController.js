ApplicationController = function($scope, $rootScope) {
  var context = this;

  $scope.$on('previewLoaded', function(e) {
    $(window).resize();
  });

  $scope.$on('editorLoaded', function(e, value) {
    $(window).resize();
  });

  KeyboardJS.on('ctl + s', function() {
    $scope.$emit('saveFile');
  });

  KeyboardJS.on('esc', function() {
    $scope.$emit('toggleBrowser');
  });

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
