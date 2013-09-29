PendingController = function($scope, $rootScope, github, editorState) {
  var context         = this;
  $scope.$element     = $('#pending');

  $scope.changed = function() { return editorState.changedFiles(); };
  $scope.changedWithContent = function() { return editorState.changedWithContent(); }
  $scope.saved = function(path) { editorState.resetFile(path); };

  $scope.saveAll = function() {
    var files = $scope.changedWithContent();
    var changedFiles = $scope.changed();
    for(var i = 0; i < changedFiles.length; i++) {
      $scope.saved(changedFiles[i]);
    }
    return github.saveFiles(files, 'Updated pending files');
  }

  $rootScope.$on('saved', function(e, path) {
    $scope.saved(path);
  });

  $rootScope.$on('saveAll', function(e) {
    $scope.saveAll();
  });

  $rootScope.$on('remove', function(e, path) {
    $scope.saved(path);
    localStorage.removeItem(path);
    if(editorState.currentPath() == path)
      $scope.$emit('fileSelected', {path: path});
  });
};
