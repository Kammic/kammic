var Application = angular.module('Application', []);

Application.controller({
  ApplicationController: function($scope, $rootScope, previewService) {
    $scope.$on('markdownUpdated', function(e, value) {
      var mdConverter = new Showdown.converter();
      markdown = mdConverter.makeHtml(value);
      previewService.updatePreview(markdown);
    });

    $(window).resize(function() {
      var width  = $(document).width()/2.05;
      var height = $(document).height();
      $scope.$emit('windowResized', width, height);
    });
  },
  PreviewController: function($scope, $rootScope, previewService) {
    var $element = $('#preview');
    previewService.setup($element);

    $rootScope.$on("windowResized", function(e, width, height){
      $element.width(width);
    });
    $(window).resize();
  },
  EditorController: function($scope, $rootScope, editorService) {
    var $element = $('#editor');
    editorService.setup($element, $scope);
    $rootScope.$on("windowResized", function(e, width, height){
      $element.width(width);
    });
    $(window).resize();
  }
});
