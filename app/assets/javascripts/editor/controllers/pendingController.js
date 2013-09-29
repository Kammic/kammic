PendingController = function($scope, $rootScope, github, changedFileQueue, editorState) {
  var context         = this;
  $scope.$element     = $('#pending');

  $scope.changed = function() {
    var changedFiles = changedFileQueue.changedFiles();
    return Object.keys(changedFiles);
  };

  $scope.changedWithContent = function() {
    var changedFiles = $scope.changed();
    var changedFilesWithContent = {}
    for(var i = 0; i < changedFiles.length; i++) {
      changedFilesWithContent[changedFiles[i]] = localStorage.getItem(changedFiles[i]);
    }

    console.debug(changedFilesWithContent);
    return changedFilesWithContent;
  }

  $scope.saved = function(path) {
    changedFileQueue.resetFile(path);
  };

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
    changedFileQueue.resetFile(path);
    localStorage.removeItem(path);
    if(editorState.currentPath() == path)
      $scope.$emit('fileSelected', {path: path});
  });
};
