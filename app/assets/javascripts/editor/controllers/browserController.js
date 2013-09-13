BrowserController = function($scope, $rootScope, github) {
  $scope.$element = $('#browser');
  $scope.$element.hide();
  $scope.visible  = false;

  $scope.currentPath = [];

  $rootScope.$on('toggleBrowser', function(e) {
    $scope.visible ? hideBrowser() : showBrowser();
  });

  var hideBrowser = function() {
    $scope.visible = false;
    $scope.$element.fadeOut(env.browserFadeOutTime);
  }

  var showBrowser = function() {
    $scope.visible = true;
    $scope.$element.fadeIn(env.browserFadeInTime);
  }

  var updateFilesList = function(files) {
    $scope.$apply(function() {
      $scope.files = files;
    });
  }

  var browseToDirectory = function(treeArray) {
    github.getTree(treeArray.join('/')).then(function(files) {
      $scope.currentPath = treeArray;
      updateFilesList(files);
    });
  }

  github.init(env.auth_token).then(function(){
    github.setRepo('progit-bana');
    github.getTree().then(function(files){
      console.debug(files);
      updateFilesList(files);
    });
  });

  $rootScope.$on('dirSelected', function(e, dir) {
    var requestedPath = $scope.currentPath;
    requestedPath.push(dir.path);
    browseToDirectory(requestedPath);
  });

  $rootScope.$on('parentSelected', function(e){
    var requestedPath = $scope.currentPath;
    requestedPath.pop();
    browseToDirectory(requestedPath);
  });

  
  $rootScope.$on('windowResized', function(e, width, height){
    $scope.$element.width(width/2.05);
    $scope.$element.height(height/2.05);

    $scope.$element.css('top', height/4.05);
    $scope.$element.css('left', width/4.05);
  });
  $(window).resize();

  $scope.$emit('browserLoaded');
}
