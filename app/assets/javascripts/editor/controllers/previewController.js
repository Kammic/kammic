PreviewController = function($scope, $rootScope) {
  $scope.$element = $('#preview');
  var mdConverter = new Showdown.converter();

  var mdToHTML = function(md) {  
    return mdConverter.makeHtml(md);
  }

  var updatePreview = function(rawText) {
    $scope.preview = mdToHTML(rawText);
  }
  
  $scope.$element.click(function() {
    $scope.$emit('hideBrowser');
  });

  $rootScope.$on('markdownUpdated', function(e, rawText) {
    if($scope.$$phase == '$apply')
      updatePreview(rawText);
    else {
      $scope.$apply(function() {
        updatePreview(rawText);
      });
    }
  });

  $rootScope.$on('windowResized', function(e, width, height){
    $scope.$element.width(width/2.05);
  });

  $scope.$emit('previewLoaded');
}
