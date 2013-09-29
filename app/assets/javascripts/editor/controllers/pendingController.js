PendingController = function($scope, $rootScope, github, editor) {
  var context         = this;
  $scope.$element     = $('#pending');

  $scope.changed = function() { return editor.changedFiles(); };
  $scope.changedWithContent = function() { return editor.changedWithContent(); }
  $scope.saved = function(path) { editor.resetFile(path); };

  $scope.saveAll = function() { editor.saveAllChangedFiles(); }

  $rootScope.$on('saved', function(e, path) {
    $scope.saved(path);
  });

  $rootScope.$on('saveAll', function(e) {
    $scope.saveAll();
  });

  $rootScope.$on('remove', function(e, path) {
    $scope.saved(path);
    localStorage.removeItem(path);
    if(editor.currentPath() == path)
      $scope.$emit('fileSelected', {path: path});
  });
};
