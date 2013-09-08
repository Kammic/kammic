PreviewController = function($scope, $rootScope) {
  $scope.$element = $('#preview');
  $rootScope.$on("windowResized", function(e, width, height){
    $scope.$element.width(width);
  });
  $scope.$emit('previewLoaded');
}
