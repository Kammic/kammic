ApplicationController = function($scope, $rootScope, github) {
  var context = this;

  $scope.$on('previewLoaded', function(e) {
    $(window).resize();
  });

  $scope.$on('editorLoaded', function(e, value) {
    $(window).resize();
  });

  $rootScope.$on('notify', function(e, message){
    $.bootstrapGrowl(message, {
      ele: '#preview',
      type: 'success',
      offset: {from: 'bottom', amount: 10},
      align: 'left',
      width: 'auto',
      delay: 1000,
      allow_dismiss: true,
      stackup_spacing: 3
    });
  });

  github.init(env.auth_token).then(function() {
    $scope.$emit('githubLoaded');
  });

  key('esc', function(){
    $scope.$emit('toggleMenu');
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
