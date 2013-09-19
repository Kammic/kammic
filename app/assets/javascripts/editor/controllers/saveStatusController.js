SaveStatusController = function($scope, $rootScope) {
  $scope.$element = $("#menu-changes");
  $scope.class    = ['icon-info-sign'];

  $rootScope.$on('savedLocal', function() {
    $scope.$apply(function(){
      $scope.class = ['icon-warning-sign'];  
    });
    
  });

  $rootScope.$on('clearedLocal', function() {
    $scope.$apply(function() {
      $scope.class = ['icon-ok-circle'];
    });
  });
}
