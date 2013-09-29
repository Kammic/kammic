NavBarController = function($scope, $rootScope, github) {
  $scope.$element = $('#nav');

  $scope.updateUser = function() {
    $scope.user = github.getUser();
  }

  $rootScope.$on('windowResized', function(e, width, height){
    $scope.$element.width(width);
  });
  
  $rootScope.$on('githubLoaded', function(){ $scope.updateUser(); });
  $scope.$emit('navBarLoaded');
}
