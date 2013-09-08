var Application = angular.module('Application', []);

Application.controller({
  ApplicationController: function($scope, $rootScope) {
    $scope.$on('markdownUpdated', function(e, value) {
      $scope.$apply(function(){
        var mdConverter = new Showdown.converter();
        markdown = mdConverter.makeHtml(value);
        $scope.value = markdown;
      });
    });

    $(window).resize(function() {
      var width  = $(document).width()/2.05;
      var height = $(document).height();
      $scope.$emit('windowResized', width, height);
    });
  },
  PreviewController: function($scope, $rootScope) {
    var $element = $('#preview');
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
