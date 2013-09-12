BrowserController = function($scope, $rootScope, githubFactory) {
  $scope.$element = $('#browser');
  $scope.$element.hide();
  $scope.visible  = false;

  $rootScope.$on('toggleBrowser', function(e) {
    if($scope.visible) {
      $scope.visible = false;
      $scope.$element.fadeOut(250);
    } else {
      $scope.visible = true;
      $scope.$element.fadeIn(250);
    }
  });

  $rootScope.repo   = githubFactory.github.getRepo('ortuna','progit-bana');
  $rootScope.branch = $rootScope.repo.getDefaultBranch();

  var fetchFiles = function(path) {
    $rootScope.repo.contents('master', path).done(function(files) {
      $scope.$apply(function(){
        $scope.files = files;
      });
    });
  };

  fetchFiles('');

  $rootScope.$on('fileSelected', function(e, selectedFile) {
    $rootScope.branch.read(selectedFile.path).done(function(file) {
      file.path = selectedFile.path;
      $rootScope.$emit('toggleBrowser');
      $rootScope.$emit('loadFile', file);
    });
  });

  $rootScope.$on('dirSelected', function(e, file) {
    fetchFiles(file.path);
  });

  
  
  $(window).resize(function() {
    var width  = $(document).width()/2.05;
    var height = $(document).height()/2.05;
    $scope.$element.width(width);
    $scope.$element.height(height);

    $scope.$element.css('top', height/2);
    $scope.$element.css('left', (width/2));
  });
  $(window).resize();
  $scope.$emit('browserLoaded');
}
