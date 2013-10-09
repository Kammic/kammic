PendingController = function($scope, $rootScope, github, editor) {
  var context         = this;
  $scope.$element     = $('#pending');

  $scope.changed = function() { return editor.changedFiles(); };
  $scope.saved = function(path) { editor.resetFile(path); };

  $scope.saveAll = function() {
    editor.saveAllChangedFiles($scope.message);
  }

  $rootScope.$on('saved', function(e, path) {
    $scope.saved(path);
  });

  $rootScope.$on('saveAll', function(e) {
    $scope.saveAll();
    editor.resetAllFiles();
    $scope.message = null;
  });

  $rootScope.$on('remove', function(e, path) {
    $scope.saved(path);
    localStorage.removeItem(path);
    if(editor.currentPath() == path)
      $scope.$emit('fileSelected', {path: path});
  });
};
