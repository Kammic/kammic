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

  var browseToDirectory = function(treeArray) {
    setLoading(true);
    github.getTree(treeArray.join('/')).then(function(files) {
      $scope.currentPath = treeArray;
      updateFilesList(files);
      setLoading(false);
    });
  }

  github.init(env.auth_token).then(function() {
    setLoading(true);
    github.setRepo('progit-bana');
    github.getTree().then(function(files){
      setLoading(false);
      updateFilesList(files);
    });
  });

  $rootScope.$on('dirSelected', function(e, dir) {
    var requestedPath = $scope.currentPath;
    requestedPath.push(dir.path);
    browseToDirectory(requestedPath);
  });

  $rootScope.$on('parentSelected', function(e) {
    var requestedPath = $scope.currentPath;
    requestedPath.pop();
    browseToDirectory(requestedPath);
  });

  $rootScope.$on('fileSelected', function(e) {
    $rootScope.$emit('hideMenu');
  });

  $scope.$emit('browserLoaded');
}
