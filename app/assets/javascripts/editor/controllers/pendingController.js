PendingController = function($scope, $rootScope, changedFileQueue) {
  var context         = this;
  $scope.$element     = $('#pending');
  $scope.changed = function() {
    var changedFiles = changedFileQueue.changedFiles();
    return Object.keys(changedFiles);
  };

  $scope.saved = function(path) {
    changedFileQueue.resetFile(path);
  };

  $rootScope.$on('saved', function(e, path) {
    $scope.saved(path);
  });
};
