ApplicationController = function($scope, $rootScope) {
  function updatePreview(value) {
    var mdConverter = new Showdown.converter();
    markdown = mdConverter.makeHtml(value);
    $scope.value = markdown;
  }

  $scope.$on('previewLoaded', function(e) {
    $(window).resize();
  });

  $scope.$on('editorLoaded', function(e, value) {
    $(window).resize();
    updatePreview(value);
  });

  $scope.$on('markdownUpdated', function(e, value) {
    $scope.$apply(function(){
      updatePreview(value);  
    });
  });

  $(window).resize(function() {
    var width  = $(document).width()/2.05;
    var height = $(document).height();
    $scope.$emit('windowResized', width, height);
  });
};
