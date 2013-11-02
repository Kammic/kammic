PendingController = ["$scope", "$rootScope", "github", "editor", function($scope, $rootScope, github, editor) {

  var context     = this;
  $scope.$element = $('#pending');
  $scope.changed  = function() { return editor.changedFiles(); };
  $scope.saved    = function(path) { editor.resetFile(path); };

  $scope.saveAll  = function() {
    $scope.$emit('showLoading');
    editor.saveAllChangedFiles($scope.message).then(function() {
      $scope.$emit('hideLoading');
      $scope.message = null;
      editor.resetAllFiles();
      $scope.$apply();
    });
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
}];
