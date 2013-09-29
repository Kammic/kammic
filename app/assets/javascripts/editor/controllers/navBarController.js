NavBarController = function($scope, $rootScope) {
  $scope.$element = $('#nav');


  $rootScope.$on('windowResized', function(e, width, height){
    $scope.$element.width(width);
  });

  $scope.$emit('navBarLoaded');
}
