NavBarController = function($scope, $rootScope, github) {
  $scope.$element = $('#nav');
  $scope.loading  = false;

  $scope.setLoading = function(value) {
    if(typeof value === 'undefined') { throw('value is required'); }
    if(!$scope.$$phase) {
      $scope.$apply(function(){
        $scope.loading = value;
      });
    } else {
      $scope.loading = value;
    }
  }


  $scope.updateUser = function() {
    $scope.user   = github.getUser();
    $scope.avatar = $scope.user.avatar_url;
  }

  $rootScope.$on('showLoading', function(e){
    $scope.setLoading(true);
  });

  $rootScope.$on('hideLoading', function(e){
    $scope.setLoading(false);
  });

  $rootScope.$on('windowResized', function(e, width, height){
    $scope.$element.width(width);
  });

  $rootScope.$on('githubLoaded', function(){ $scope.updateUser(); });
  $scope.$emit('navBarLoaded');
}
