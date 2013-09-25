PendingController = function($scope, $rootScope, changedFileQueue) {
  var context         = this;
  $scope.$element     = $('#pending');
  $scope.changed = function(){
    return changedFileQueue.changedFiles();
  };

};
