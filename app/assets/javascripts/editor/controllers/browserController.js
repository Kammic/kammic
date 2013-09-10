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

  var repo   = githubFactory.github.getRepo('ortuna','simple-book');
  var branch = repo.getDefaultBranch();
  
  $rootScope.$on('fileSelected', function(e, file) {
    branch.read(file.name).done(function(file){
      $rootScope.$emit('loadFile', file);
    });
  });

  repo.contents('master','/').done(function(files){
    $scope.files = files;
  });
  
  $(window).resize(function() {
    var width  = $(document).width()/2.05;
    var height = $(document).height()/2.05;
    $scope.$element.width(width);
    $scope.$element.height(height);

    $scope.$element.css('top', height/2);
    $scope.$element.css('left', width/2);
  });
  $(window).resize();
  $scope.$emit('browserLoaded');
}
