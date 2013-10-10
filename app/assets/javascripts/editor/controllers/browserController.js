BrowserController = function($scope, $rootScope, github) {
  $scope.loading  = false;
  $scope.currentPath = [];

  $scope.updateFilesList = function(files) {
    $scope.$apply(function() {
      $scope.files = files;
    });
  }

  $scope.setLoading = function(value) {
    if(!$scope.$$phase) {
      $scope.$apply(function(){
        $scope.loading = value;
      });
    } else {
      $scope.loading = value;
    }
  }

  $scope.browseToDirectory = function(treeArray) {
    $scope.setLoading(true);
    github.getTree(treeArray.join('/')).then(function(files) {
      $scope.currentPath = treeArray;
      $scope.updateFilesList(files);
      $scope.setLoading(false);
    });
  }

  $scope.createFile = function(path) {
    if(typeof path === 'undefined')
      throw('path is required');
    var fullPath = $scope.currentPath.slice(0);
    fullPath.push(path);
    fullPath = fullPath.join('/');

    $scope.setLoading(true);
    github.saveFile(fullPath, '').then(function() {
      $scope.browseToDirectory($scope.currentPath);
      $scope.fileName = null;
      $scope.setLoading(false);
    });
  }

  $rootScope.$on('createFile', function(e){
    $scope.createFile($scope.fileName);
  });

  $rootScope.$on('githubLoaded', function() {
    github.setRepo('progit-bana');
    $scope.browseToDirectory([]);
  });

  $rootScope.$on('deleteFile', function(e, path) {
    $scope.setLoading(true);
    github.deleteFile(path).then(function() {
      $scope.currentPath = [];
      $scope.browseToDirectory([]);
      $scope.setLoading(false);
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
