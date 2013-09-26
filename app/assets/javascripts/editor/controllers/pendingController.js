PendingController = function($scope, $rootScope, changedFileQueue, editorState) {
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

  $rootScope.$on('remove', function(e, path) {
    changedFileQueue.resetFile(path);
    localStorage.removeItem(path);
    if(editorState.currentPath() == path)
      $scope.$emit('fileSelected', {path: path});
  });
};
