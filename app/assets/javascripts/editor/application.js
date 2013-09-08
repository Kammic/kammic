var Application = angular.module('Application', []);

Application.controller({
  ApplicationController: function($scope, $rootScope) {
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
  },
  PreviewController: function($scope, $rootScope) {
    var $element = $('#preview');
    $rootScope.$on("windowResized", function(e, width, height){
      $element.width(width);
    });
    $scope.$emit('previewLoaded');
  },
  EditorController: function($scope, $rootScope) {
    var editor  = ace.edit("editor");
    var $element = $('#editor');

    editor.setTheme("ace/theme/twilight");
    editor.getSession().setUseWrapMode(true);
    editor.getSession().setMode("ace/mode/markdown");
    editor.on('change', function(e) {
      $scope.$emit('markdownUpdated', editor.getValue());
    });

    $rootScope.$on("windowResized", function(e, width, height){
      $element.width(width);
    });

    $scope.$emit('editorLoaded', editor.getSession().getValue());
  }
});
