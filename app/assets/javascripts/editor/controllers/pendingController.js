PendingController = function($scope, $rootScope, github, editor) {
  var context         = this;
  $scope.$element     = $('#pending');

  $scope.changed = function() { return editor.changedFiles(); };
  $scope.changedWithContent = function() { return editor.changedWithContent(); }
  $scope.saved = function(path) { editor.resetFile(path); };

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
    if(editor.currentPath() == path)
      $scope.$emit('fileSelected', {path: path});
  });
};
