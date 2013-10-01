BrowserController = function($scope, $rootScope, github) {
  $scope.loading  = false;
  $scope.currentPath = [];

  var updateFilesList = function(files) {
    $scope.$apply(function() {
      $scope.files = files;
    });
  }

  var setLoading = function(value) {
    $scope.$apply(function(){
      $scope.loading = value;
    });
  }

  $scope.browseToDirectory = function(treeArray) {
    setLoading(true);
    github.getTree(treeArray.join('/')).then(function(files) {
      $scope.currentPath = treeArray;
      updateFilesList(files);
      setLoading(false);
    });
  }

  $rootScope.$on('githubLoaded', function(){
    setLoading(true);
    github.setRepo('progit-bana');
    github.getTree().then(function(files){
      setLoading(false);
      updateFilesList(files);
    });
  });

  $rootScope.$on('deleteFile', function(e,path){
    github.deleteFile(path).then(function(){
      $scope.currentPath = [];
      $scope.browseToDirectory([]);
    });
  });

  $rootScope.$on('dirSelected', function(e, dir) {
    var requestedPath = $scope.currentPath;
    requestedPath.push(dir.path);
    $scope.browseToDirectory(requestedPath);
  });

  $rootScope.$on('parentSelected', function(e) {
    var requestedPath = $scope.currentPath;
    requestedPath.pop();
    $scope.browseToDirectory(requestedPath);
  });

  $rootScope.$on('fileSelected', function(e) {
    $rootScope.$emit('hideMenu');
  });

  $scope.$emit('browserLoaded');
}
