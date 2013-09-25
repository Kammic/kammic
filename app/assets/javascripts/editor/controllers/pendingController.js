PendingController = function($scope, $rootScope, changedFileQueue) {
  var context         = this;
  $scope.$element     = $('#pending');
  $scope.changed = function(){
    var changedFiles = changedFileQueue.changedFiles();
    return Object.keys(changedFiles);
  };

};
