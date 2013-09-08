PreviewController = function($scope, $rootScope) {
  var $element = $('#preview');
  $rootScope.$on("windowResized", function(e, width, height){
    $element.width(width);
  });
  $scope.$emit('previewLoaded');
}
