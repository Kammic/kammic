SaveStatusController = function($scope, $rootScope) {
  $scope.$element = $("#menu-browser");
  $scope.class    = ['glyphicon-list-alt'];

  $rootScope.$on('savedLocal', function() {
    $scope.$apply(function(){
      $scope.class = ['glyphicon-warning-sign'];
    });
    
  });

  $rootScope.$on('clearedLocal', function() {
    $scope.$apply(function() {
      $scope.class = ['glyphicon-ok-circle'];
    });
  });
}
